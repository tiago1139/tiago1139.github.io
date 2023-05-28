import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ObjectUnsubscribedError, Subject } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { List } from 'src/app/models/list';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { CarrinhoService } from 'src/app/services/carrinho/carrinho.service';
import {ItemCarrinho} from "../../models/itemCarrinho";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  hide = true;
  loadingRegister = false;
  loadingLogin = false;
  registerSuccess = false;
  registerError = false;
  loginError = false;

  private isAuthenticated = false;
  private token!: string | null;
  private tokenTimer: any;
  private userId!: string;
  private authStatusListener = new Subject<boolean>();

  errorMessage= '';

  users: User[] = [];
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private carrinhoService: CarrinhoService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'username' : new FormControl('', [Validators.required,
                                      Validators.minLength(3),
                                      Validators.pattern("[a-zA-Z0-9]+")],
                                      [this.forbiddenNameValidator.bind(this)]),
      'password' : new FormControl('', [Validators.required,
                                      Validators.minLength(8),
                                      this.passwordValidator.bind(this)])

    });

    this.loginForm = new FormGroup({
      'username' : new FormControl('', [Validators.required]),
      'password' : new FormControl('', [Validators.required])

    });

  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  get registerUsername() {
    return this.registerForm.get('username');
  }

  get registerPassword() {
    return this.registerForm.get('password');
  }

  get loginUsername() {
    return this.loginForm.get('username');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }

  getAllUsers() : void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }



  register(username:string, password:string){

    this.loadingRegister = true;
    console.log("loading: "+this.loadingRegister);

    var wishlist = {
      title: 'wishlist',
      items: []
    } as unknown as List ;

    var library:ItemCarrinho[] = [];

    var profileInfo = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''

    };

    var profilePicture = '../../../assets/user-1.png';

    var alternativePics = [
      "../../../assets/user-2.png",
      "../../../assets/user-3.png"
    ];

    this.userService.addUser({username, password, wishlist, library, profileInfo, profilePicture, alternativePics} as User).subscribe(
      {
        next: data => {
            console.log("sucesso");
            setTimeout(() => {
              this.loadingRegister = false;
              this.registerSuccess = true;
              setTimeout(() => this.registerSuccess = false, 6000);
              this.registerForm.reset();
            }, 2000);

        },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
            setTimeout(() => {
              this.loadingRegister = false;
              this.registerError = true;
              setTimeout(() => this.registerError = false, 6000);
              this.registerForm.reset();
            }, 2000);
        }
      }
    );


  }

  login(username:string, password:string){

    console.log("USERNAME FORM "+username);
    console.log("PASS FORM "+password);

    this.loadingLogin = true;
    console.log("loading: "+this.loadingLogin);


    this.authService.login({username, password} as User)
      .subscribe({
        next: (response: any) => {
          const token = response.token;
          this.token = token;
          if (token) {
            console.log("Entra no TOKEN");
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authService.setAuthStatusListener(true);
            const now = new Date();
            console.log("TEMPO ATUAL: "+now.getTime());
            const expirationDate = moment().add(1, 'hours').format('LLL');
            console.log("EXPIRA EM: "+expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/dashboard']);
            this.carrinhoService.createCartIfNotExists();
            console.log("PASSOU PARA O DASHBOARD");
          }
        },

        error : (err: any) => {
          console.error('There was an error!', err);
          setTimeout(() => {
            this.loadingLogin = false;
            this.loginError = true;
            setTimeout(() => this.loginError = false, 6000);

          }, 2000);
        }
      });

  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }


  private setAuthTimer(duration: number) {

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: any, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate);
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");

  }


  private async forbiddenNameValidator(control : AbstractControl) : Promise<{ [key: string]: any; } | null> {
    try {
      var user = await this.userService.getUserByName(control.value);
      if(user?.username === control.value) {
        console.log("Utilizador Existe");
        control?.get('username')?.setErrors({'usado':true});
        return {'usado':true};
      }

    } catch (error) {
    }
    console.log("Null 3");
    control?.get('username')?.setErrors(null);
    return null;
  }

  private passwordValidator(control : AbstractControl) : {[key : string]: any } | null {
    var upperCase = new RegExp(
      "^(?=.*[A-Z]).+$"
    );

    var lowerCase = new RegExp(
      "^(?=.*[a-z]).+$"
    );

    var numeric = new RegExp(
      "^(?=.*\\d).+$"
    );

    if(!upperCase.test(control.value)) {
      return {'upperCase':true};
    }

    if(!lowerCase.test(control.value)) {
      return {'lowerCase':true};
    }

    if(!numeric.test(control.value)) {
      return {'numeric':true};
    }
    return null;
  }


  usernameRegisterError() {
    var user = this.registerUsername;
    if (user?.hasError('usado')) {
      console.log("asdasd");
      return 'O utilizador já existe!';
    }

    if (user?.hasError('required')) {
      return 'Nome de utilizador necessário!';
    }

    if (user?.hasError('minlength')) {
      return 'O tamanho minimo é 3 carateres!';
    }

    if (user?.hasError('pattern')) {
      return 'Só podem ser usados carateres alfanuméricos!';
    }


    return '';

  }

  usernameLoginError() {
    var user = this.registerUsername;

    if (user?.hasError('required')) {
      return 'Nome de utilizador necessário!';
    }

    return '';

  }

  passwordRegisterError() {
    var password = this.registerPassword;

    if (password?.hasError('required')) {
      return 'Password necessária!';
    }

    if (password?.hasError('minlength')) {
      return 'O tamanho minimo é 8 carateres!';
    }

    if (password?.hasError('upperCase')) {
      return 'Falta 1 letra maiuscula';
    }

    if (password?.hasError('lowerCase')) {
      return 'Falta 1 letra minuscula';
    }

    if (password?.hasError('numeric')) {
      return 'Falta 1 numero';
    }

    return '';

  }

  passwordLoginError() {
    var password = this.registerPassword;

    if (password?.hasError('required')) {
      return 'Password necessária!';
    }

    return '';

  }

}



