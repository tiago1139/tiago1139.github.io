import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import {Item} from "../../models/item";
import {AuthService} from "../../auth/auth.service";
import { ItemCarrinho } from 'src/app/models/itemCarrinho';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  //private carrinhoUrl = 'http://appserver.alunos.di.fc.ul.pt:3012/carrinho';
  private carrinhoUrl = environment.api+'/carrinho';

  items: Item[] = [];


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient, private authService: AuthService) {

    }

  addCarrinho(itemToPush: Item) {

    let noCarrinho = false;

    if(noCarrinho){
      alert('O item já está no carrinho, nao vai ser adicionado novamente');
    }

    if(!noCarrinho){

      var i = {
        item: itemToPush,
        quantidade: 1
      } as ItemCarrinho;

      var itemsOfUser = this.carrinhoItems();
      itemsOfUser.push(i);

      var userId = this.authService.getUserId(); //buscar user
      var cart = localStorage.getItem('cart' + userId);

      if(cart !== null){
        var cartJson = JSON.parse(cart);
        cartJson.carrinho = itemsOfUser;

        localStorage.setItem('cart' + userId, JSON.stringify(cartJson));
      }
      noCarrinho = true;

    }

  }

  getCarrinhoByUserId() {
    var userId = this.authService.getUserId(); //buscar user
    var cart = localStorage.getItem('cart' + userId);

    if(cart !== null){
      return JSON.parse(cart);
    }

  }

  createCartIfNotExists(){
    var userId = this.authService.getUserId(); //buscar user
    var cart = localStorage.getItem('cart' + userId);

    if(cart === null){
      var carrinhoVazio = {'carrinho':[
        ]}
      localStorage.setItem('cart' + userId, JSON.stringify(carrinhoVazio));
    }
  }

  carrinhoItems(): ItemCarrinho[] {
    var carrinho = this.getCarrinhoByUserId();
    console.log("Carrinho : "+carrinho);
    var items :ItemCarrinho[] = [];

    for(let item of carrinho.carrinho){
      items.push(item as ItemCarrinho);
    }

    return items;
  }

  updateQuantity(itemCarrinho: ItemCarrinho) {
    var itemsOfUser = this.carrinhoItems();
    var itemsUpdated = itemsOfUser
    .map(item => {
      if(item.item._id === itemCarrinho.item._id) {
        return itemCarrinho;
      }
      return item;
    }); 
   
    var cart = this.getCarrinhoByUserId();

    if(cart !== null){
      cart.carrinho = itemsUpdated;
      var userId = this.authService.getUserId();
      localStorage.setItem('cart' + userId, JSON.stringify(cart));
    }
  }

  removeItemFromCarrinho(item: ItemCarrinho) {
    var itemsOfUser = this.carrinhoItems();
    itemsOfUser = itemsOfUser
    .filter(function(el) { return el.item._id !== item.item._id; }); 

    var cart = this.getCarrinhoByUserId();

    if(cart !== null){
      cart.carrinho = itemsOfUser;
      var userId = this.authService.getUserId();
      localStorage.setItem('cart' + userId, JSON.stringify(cart));
    }

  }

  /*
  * Handle Http operation that failed.
  * Let the app continue.
  *
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
