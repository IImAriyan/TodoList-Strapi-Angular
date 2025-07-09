import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IUserRequestBody, IUserResponse, JwtPayload } from '../../DTOs/userDto';
import { jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  errMessage: undefined | string = undefined;

  constructor(private auth: AuthService, private router: Router) {

    if (auth.get("token") !== null) {
      router.navigate(['/todos'])
    }
   }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })



  login() {
    if (this.loginForm.valid) {
      const user: IUserRequestBody = {
        identifier: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value,
      }
      this.auth.Authentication(user).subscribe({
        next: (response: IUserResponse) => {
          this.errMessage = undefined;
          const jwtToken = response.jwt;
          const jwtPayload = jwtDecode<JwtPayload>(jwtToken);
          this.auth.set('token', jwtToken);
          this.auth.set('userID', jwtPayload.id.toString());
          this.router.navigate(['/todos']);
        },
        error: (error: HttpErrorResponse) => {
          const statusCode = error.status;
          if (statusCode == 400) {
            this.errMessage = 'your username or password is incorrect'
          }
        }
      });

    }
  }
}
