import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginComponent } from '../components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard{

  constructor(private authService: AuthService,
    private router: Router) { }


  canActivateLogin(){
    if(this.authService.getIsAuth()){
      this.router.navigate(['/dashboard']);
      return false;
    }
    console.log('entramos aqui');
    return true;
  }


  canActivate(){
    if(this.authService.getIsAuth()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }



}
