import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {ITodoAddDtoResponse, ITodoGetAPI, ITodoGetDto} from '../DTOs/todoDto';

@Injectable({
  providedIn: 'root'
})
export class TodoServiceService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getTodos(): Observable<ITodoGetAPI> {
    return this.http.get<ITodoGetAPI>(this.baseUrl+'/todos')
  }

  public addTodo(requestBody : ITodoAddDtoResponse): Observable<ITodoAddDtoResponse> {
    return this.http.post<ITodoAddDtoResponse>(this.baseUrl+'/todos',requestBody)
  }

  public updateTodo(requestBody : ITodoAddDtoResponse, todoID : string ) {
    return this.http.put(this.baseUrl+'/todos/'+todoID,requestBody)
  }

  public delete(todoID : string ) {
    return this.http.delete(this.baseUrl+'/todos/'+todoID)
  }

  public getTodosById(id:string | null): Observable<ITodoGetAPI> {
     return this.http.get<ITodoGetAPI>(this.baseUrl+'/todos?populate=*')
  }

}
