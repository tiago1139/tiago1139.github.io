import {EventEmitter, Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  //private loginUrl = 'http://appserver.alunos.di.fc.ul.pt:3012/auth/login';
  private loginUrl = environment.api+'/auth/login';

  private isAuthenticated = false;
  private token!: string | null;
  private tokenTimer: any;
  private userId!: string;
  private authStatusListener = new EventEmitter<boolean>();

  constructor(private http: HttpClient,private router: Router) {
    this.authStatusListener.emit(false);
  }



  getToken() {
    return this.token;
  }

  getIsAuth() {
    if(localStorage.getItem("token") !== null) {
      return true;
    } else {
      return false;
    }
  }

  getUserId() {
    return localStorage.getItem("userId");
  }
  getAuthStatusListener() {
    return this.authStatusListener;
  }

  setAuthStatusListener(status:any) {
    this.authStatusListener.emit(status);
  }

  login(user : User) {
    return this.http
      .post<{ token: string; expiresIn: number, userId: string }>(
        this.loginUrl,
        user
      );

  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");

  }


}
