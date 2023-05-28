import { Component, OnInit } from '@angular/core';
import {Item} from "../../models/item";
import {CarrinhoService} from "../../services/carrinho/carrinho.service";
import { ItemCarrinho } from 'src/app/models/itemCarrinho';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {

  totalQuantidade = 0;
  totalValue = 0;
  dataSource!: ItemCarrinho[];
  displayedColumns: string[] = ['Imagem', 'Nome', 'Tipo', 'Preço', 'Quantidade', 'Botoes'];


  constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    this.carrinhoService.createCartIfNotExists();
    this.updateTotalQuantidade();
    this.calculateTotalValue();
    this.dataSource = this.carrinhoItems;

  }

  get carrinhoItems(): ItemCarrinho[] {
    return this.carrinhoService.carrinhoItems();
  }

  incrementQuantity(item: ItemCarrinho): void {
    console.log('quantidade antes -> ',item.quantidade);
    item.quantidade++;
    console.log('quantidade dps -> ',item.quantidade);
    this.updateTotalQuantidade();
    this.carrinhoService.updateQuantity(item);
    this.calculateTotalValue();
  }

  decrementQuantity(item: ItemCarrinho): void {
    if (item.quantidade > 1) {
      item.quantidade--;
    }
    this.updateTotalQuantidade();
    this.carrinhoService.updateQuantity(item);
    this.calculateTotalValue();
  }

  removeItem(item: ItemCarrinho): void {
    this.carrinhoService.removeItemFromCarrinho(item);
    console.log(`${item.item.name} removido do carrinho.`);
    this.updateTotalQuantidade();
    this.calculateTotalValue();
    this.dataSource = this.carrinhoItems;
  }

  updateTotalQuantidade(): void {
    this.totalQuantidade = this.carrinhoItems.reduce((total, item) => total + item.quantidade, 0);
  }

  calculateTotalValue(): void {
    this.totalValue = this.carrinhoItems.reduce((total, item) => {
      return total + item.item.preco * item.quantidade;
    }, 0);
    //this.totalValue = this.totalValue.toFixed(2);
    console.log(this.totalValue);

  }




}
