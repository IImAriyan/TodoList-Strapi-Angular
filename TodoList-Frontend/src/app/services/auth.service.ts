import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {IUserRequestBody, IUserResponse} from '../DTOs/userDto';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public set(item:string, value:string):void {
    localStorage.setItem(item, value)
  }

  public get(item:string):string | null  {
    return localStorage.getItem(item)
  }


  public Authentication(user: IUserRequestBody): Observable<IUserResponse> {
      return this.http.post<IUserResponse>(this.baseUrl+'/auth/local', user)
  }

}
