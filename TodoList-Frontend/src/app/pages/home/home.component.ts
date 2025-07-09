import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {TodoServiceService} from '../../services/todo-service.service';
import {ITodoAddDto, ITodoAddDtoResponse, ITodoGetAPI, ITodoGetDto} from '../../DTOs/todoDto';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';

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

  tableData: ITableValues[] = [];


  constructor(private todoService: TodoServiceService, private router:Router) {
    this.reloadTodos();
  }

  reloadTodos() {
    this.tableData = [];


    const userid = localStorage.getItem("userID");
    const todos = this.todoService.getTodosById(userid);

    todos.subscribe((response) => {
      for (let i = 0; i < response.data.length; i++) {
        const todo = response.data[i];
        if (todo.users[0]) {
          if (todo.users[0].id.toString() == userid) {
            this.tableData.push({
              Id: todo.documentId,
              Name: todo.Name,
              Description: todo.Description,
              compeleted: todo.completed
            });
          }
        }
      }
    });
  }



  addTodo() {
    const Name = this.addTodoForm.controls['Name'].value;
    const Description = this.addTodoForm.controls['Description'].value;
    const completed = false;
    var requestBody: ITodoAddDtoResponse = {
      data: {
        Name: Name,
        Description: Description,
        completed:completed
      }
    }

    this.todoService.addTodo(requestBody).subscribe((response: ITodoAddDtoResponse)=>{
      this.addTodoPopup = false;
      this.reloadTodos();
      this.addTodoForm.reset();
    })

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
