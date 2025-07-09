import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators, FormGroup, FormControl} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {IUserRequestBody, IUserResponse, JwtPayload} from '../../DTOs/userDto';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule],
  standalone:true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  constructor(private auth: AuthService, private router:Router) {}

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('',[ Validators.required]),
    password: new FormControl('',[ Validators.required]),
  })


  login() {
    if (this.loginForm.valid) {

      const user: IUserRequestBody = {
       identifier:this.loginForm.controls['username'].value,
        password:this.loginForm.controls['password'].value,
      }
      this.auth.Authentication(user).subscribe((response:IUserResponse)=>{
        const jwtToken = response.jwt;
        const jwtPayload = jwtDecode<JwtPayload>(jwtToken);
        this.auth.set('token', jwtToken);
        this.auth.set('userID', jwtPayload.id.toString());
        this.router.navigate(['/home'])
      })
    }
  }
}
