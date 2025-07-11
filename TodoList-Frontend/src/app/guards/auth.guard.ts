import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import { AuthService } from '../services/auth.service';

interface jwtClaims {
  id:number,
  iat:number,
  exp:number
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const auth = inject(AuthService)

  const localStorageToken = auth.get("token")

  if (localStorageToken == null) {
    router.navigate(['/authentication/login'])
    return false
  }else {
    const tokenDecode = jwtDecode<jwtClaims>(localStorageToken);
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = currentTime > tokenDecode.exp;
    // console.log(currentTime, tokenDecode.exp)
    if (isExpired) {
      auth.delete("token")
      auth.delete("userID")
      router.navigate(['/authentication/login'])
      return  false
    }else {
      return  true
    }
  }

};
