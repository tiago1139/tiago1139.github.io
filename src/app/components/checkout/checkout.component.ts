import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import { Item } from 'src/app/models/item';
import { CarrinhoService } from 'src/app/services/carrinho/carrinho.service';
import {MatStepper} from "@angular/material/stepper";
import {User} from "../../models/user";
import {UserService} from "../../services/user/user.service";
import { ItemCarrinho } from 'src/app/models/itemCarrinho';

import * as moment from 'moment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('stepper') stepper!: MatStepper;

  user!: User;

  dataSource!: ItemCarrinho[];
  displayedColumns: string[] = ['Imagem', 'Nome', 'Tipo', 'Preço', 'Quantidade'];


  favoriteMethod: string | undefined;
  paymentMethods: any = [
    {
      name: 'Cartão Crédito',
      icon: 'credit_card'
    },
    {
      name: 'Paypal',
      icon: 'paypal'
    },
    {
      name: 'MBWay',
      icon: 'smartphone'
    },
    {
      name: 'Transferência bancária',
      icon: 'local_atm'
    }
  ];
  carrinho!: ItemCarrinho[];
  isLinear = false;
  processamentoCompra!: string;
  compraSucesso = false;


  constructor(private _formBuilder: FormBuilder,
              private carrinhoService : CarrinhoService,
               private userService: UserService,
               private router: Router) {}


  ngOnInit(): void {
    this.carrinho = this.carrinhoService.carrinhoItems();
    this.userService.getUserById(localStorage.getItem('userId')).subscribe(
      user => {this.user = user; this.calculateTotalValue()}
    );
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: [''],
  });

  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  payMessage: any;
  valorTotal: any;


  processaCompra(pagamento: any): void{
    console.log("pagamento ---> ",pagamento);
    if(pagamento === undefined || pagamento === null) {
      this.payMessage = 'Selecione um método de pagamento!';
      return;
    }
    const random = Math.random(); 
    const randomNumber = Math.round(random);

    if (randomNumber === 0) {
      this.compraSucesso = false;
    } else {
      this.compraSucesso = true;
    }

    if(this.compraSucesso == false){
      this.payMessage = 'Método de pagamento não foi aceite, tente novamente';
    }else{
      this.payMessage = '';
      this.stepper.next();
    }

  }


  comprar() : void {

      console.log('ENTREI NA COMPRA');
      for(let item of this.carrinho){
        item.data = moment().format('LLL');
        this.user.library.push(item);

        this.user.wishlist.items = this.user.wishlist.items
    .filter(function(el) { return el._id !== item.item._id; });
      }

      console.log(this.user.library);

      var cart = localStorage.getItem('cart' + this.user._id);
      if(cart !== null){
        var cartJson = JSON.parse(cart);
        cartJson.carrinho = [];

        localStorage.setItem('cart' +this.user._id, JSON.stringify(cartJson));
      }

      console.log('vai fazer update do user');
      this.userService.updateUser(this.user).subscribe(
        result => {
          this.router.navigate(['/dashboard/library']);
        }
      );
      console.log('fez update');
    }

  calculateTotalValue(): void {
    this.valorTotal = this.carrinhoService.carrinhoItems().reduce((total, item) => {
      return total + item.item.preco * item.quantidade;
    }, 0);

    //this.valorTotal = this.valorTotal.toFixed(2);
  }


}

