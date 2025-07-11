import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {TodoServiceService} from '../../services/todo-service.service';
import {ITodoAddDto, ITodoAddDtoResponse, ITodoAddToApiDto, ITodoGetAPI, ITodoGetDto} from '../../DTOs/todoDto';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Notyf } from 'notyf';

interface ITableHeadField {
  field:string
}

interface ITableValues {
  Id:string,
  Name:string,
  Description:string,
  compeleted : boolean,
}




@Component({
  selector: 'app-home',
  imports: [MatIconModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})



export class HomeComponent {
  addTodoPopup :boolean = false;
  deletePopup: boolean = false;
  deleteTodoID: string = "";
  updatePopup: boolean  = false;
  todosCompletedPrecentage: string = "0%";
  completedTodos: number = 0
  totalTodos:number = 0;
  console:Console = console;
  updateDto  = {
    Id:"",
    Name: "",
    Description:"",
    completed:false
  }



  editTodoForm :  FormGroup =  new FormGroup({
    Name: new FormControl(this.updateDto.Name, [Validators.required]),
    Description: new FormControl(this.updateDto.Description, [Validators.required]),
  });

  addTodoForm: FormGroup = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Description: new FormControl('', [Validators.required]),
  });

  tablehead: ITableHeadField[] = [
    {field:"Name"},
    {field:"Description"},
    {field:"Completed"},
    {field:"Actions"}
  ];

  notyf:Notyf = new Notyf();

  tableData: ITableValues[] = [];
    searchQuery: string | undefined = undefined;

  filterdItems :ITableValues[] | undefined = undefined


  constructor(private todoService: TodoServiceService, private router:Router, private auth : AuthService ) {
    this.reloadTodos();


  }

  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    if (this.searchQuery !== undefined) {
    // @ts-ignore
      return this.filterdItems.slice(startIndex, endIndex);
    }
    return this.tableData.slice(startIndex, endIndex);
  }

  get pages(): number[] {

    const data = this.searchQuery !== undefined ? this.filterdItems : this.tableData;
    // @ts-ignore
    this.totalPages = Math.ceil(data.length / this.itemsPerPage);
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  onSearch() {
      if (this.searchQuery !== undefined) {
        const lowerSearch = this.searchQuery.toLowerCase();
        this.filterdItems = this.tableData.filter(item =>
          item.Name.toLowerCase().includes(lowerSearch) ||
          item.Description.toLowerCase().includes(lowerSearch)
        );
      }
  }
  clearSearch() {
    this.searchQuery = undefined
  }



  reloadTodos() {

    this.tableData = [];
    this.filterdItems = [];
    const userid = localStorage.getItem("userID");
    const todos = this.todoService.getTodosById(userid);

    todos.subscribe((response) => {
      for (let i = 0; i < response.data.length; i++) {
        const todo = response.data[i];
        if (todo.users[0]) {
          if (todo.users[0].id.toString() == userid) {
            if (todo.completed) {
              this.completedTodos++;
            }
            this.tableData.push({
              Id: todo.documentId,
              Name: todo.Name,
              Description: todo.Description,
              compeleted: todo.completed
            });
            if (this.filterdItems !== undefined) {
                this.filterdItems.push({
              Id: todo.documentId,
              Name: todo.Name,
              Description: todo.Description,
              compeleted: todo.completed
            });

            this.totalTodos = this.tableData.length;
            this.todosCompletedPrecentage = Math.floor(((this.completedTodos / this.totalTodos) * 100)).toString() + "%";
            this.console.log(this.todosCompletedPrecentage);
          }

          }
        }
      }
      // this.onSearch()
    });


  }
  addTodo() {
    const Name = this.addTodoForm.controls['Name'].value;
    const Description = this.addTodoForm.controls['Description'].value;
    const completed = false;
    const userID = this.auth.get('userID')
    if (userID !== null) {
         var requestBody: ITodoAddToApiDto = {
      data: {
        Name: Name,
        Description: Description,
        completed:completed,
        users:[
          {
            id:Number(userID)
          }
        ]
      }
    }
    this.todoService.addTodo(requestBody).subscribe((response: ITodoAddDtoResponse)=>{
      this.addTodoPopup = false;
      this.reloadTodos();
      this.addTodoForm.reset();

      this.notyf.success("Todo Successfully Added")
    })
    }

  }
  updateTodoCompelete(todoId:string) {

    var todoForUpdate: ITodoAddDto  = {
      Name:"",
      Description:"",
      completed:false
    };

    this.todoService.getTodos().subscribe((response : ITodoGetAPI) =>{

      response.data.forEach(todo => {
        if (todo.documentId == todoId) {
          todoForUpdate = {
            Name: todo.Name,
            Description: todo.Description,
            completed: todo.completed
          }

          todoForUpdate.completed = !todoForUpdate.completed;
          var todoForRequest : ITodoAddDtoResponse = {
            data: {
              Name:todoForUpdate.Name,
              Description:todoForUpdate.Description,
              completed:todoForUpdate.completed
            }
          }

          this.todoService.updateTodo(todoForRequest , todoId).subscribe((response=>{
            this.tableData = []
            this.reloadTodos();
            this.notyf.success('Todo Successfully Updated')
          }))
        }

      })
    })



  }

  onclickDelete(id:string) {
    this.deleteTodoID = id
    this.deletePopup = true
  }


  deleteTodo() {
    this.todoService.delete(this.deleteTodoID).subscribe((response)=>{
      this.deleteTodoID = "";
      this.deletePopup = false;
      this.reloadTodos()
      this.notyf.success('Todo Successfully Deleted')

    })
  }

  updateButtonClicked(id:string,name:string, description:string, completed:boolean) {
      this.updatePopup = true;
      this.updateDto = {
        Id: id,
        Name:name,
        Description:description,
        completed:completed,
      }
      this.editTodoForm.controls["Name"].setValue(this.updateDto.Name);
      this.editTodoForm.controls["Description"].setValue(this.updateDto.Description);
  }

  update() {
    if (this.editTodoForm.valid) {
      const requestBody: ITodoAddDtoResponse = {
        data:{
          Name:this.editTodoForm.controls['Name'].value,
          Description:this.editTodoForm.controls['Description'].value,
          completed:this.updateDto.completed
        }
      }

      this.todoService.updateTodo(requestBody, this.updateDto.Id).subscribe((response=>{
        this.editTodoForm.reset();
        this.updateDto = {
          Id:"",
          Name: "",
          Description:"",
          completed:false
        }
        this.updatePopup = false
        this.reloadTodos()
      }))
    }
  }



  logOut() {
    localStorage.removeItem("token")
    localStorage.removeItem("userID")
    this.router.navigate(['/authentication/login'])

  }



}
