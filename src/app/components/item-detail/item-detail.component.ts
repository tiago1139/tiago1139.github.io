import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/models/item';

import { ItemService } from 'src/app/services/item/item.service';
import {CarrinhoService} from "../../services/carrinho/carrinho.service";
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Avaliacao } from 'src/app/models/avaliacao';
import { AvaliacaoService } from 'src/app/services/avaliacao/avaliacao.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AvaliacaoDialogComponent } from './avaliacao-dialog/avaliacao-dialog.component';



@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],

})
export class ItemDetailComponent implements OnInit {
  itemId: string | null | undefined;
  itemFound: boolean = true;
  item!: Item;
  isDisabled = false;
  inWishlist = false;
  user!: User;
  isLoadingWishlist = false;
  isloadingAvaliacao = false;


  avaliacao !: Avaliacao;
  avaliacoes !: Avaliacao[];
  
  ratingValue: number = 0;

  

  constructor(private route: ActivatedRoute,
              private itemService: ItemService,
              private carrinhoService: CarrinhoService,
              private userService: UserService,
              private avaliacaoService: AvaliacaoService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder,
              public dialog: MatDialog)
  {
    

  }

  ngOnInit() {
    
    this.isDisabled = false;
    this.inWishlist = false;
    console.log('Disabled inicial ', this.isDisabled);
    this.route.paramMap.subscribe(params => {
   
      
      this.itemId = params.get('searchItem');
      console.log(this.itemId);

      if (this.itemId !== null) {
        console.log('entra');
        this.itemService.getItemById(this.itemId)
        .subscribe({

          next: result => {
            this.item = result;
            this.avaliacaoService.getAvaliacoesByItem(result._id)
            .subscribe(avals => {
              this.avaliacoes = avals;
              this.getRatingTotal();
              console.log(avals);
              this.getAvaliacao();
              if(this.avaliacao !== undefined) {
                this.ratingValue = this.avaliacao.estrelas;
              }
            });
            this.checkInCarrinho();
            console.log('disable', this.isDisabled);
            if(this.item == null) {
              this.itemFound = false;
            } else {
              this.itemFound = true;
            }
            this.checkWishlist();
            
          },

          error: err => {
            this.itemFound = false;
            console.log('item not found');
          }
          });
      } else {
        this.itemFound = false;
        console.log('asdada');
      }
    });
  }

  openDialog(aval:Avaliacao): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = aval;
    
    const dialogRef = this.dialog.open(AvaliacaoDialogComponent, dialogConfig);

  }

  private getAvaliacao() {

    for(let aval of this.avaliacoes) {
      if(aval.user._id === localStorage.getItem('userId')) {
        this.avaliacao = aval;
        break;
      }
    }
    
    console.log(this.avaliacao);
    console.log(this.avaliacao.user);
    console.log(this.avaliacao.item);
  }

  private checkWishlist() {
    this.userService.getUserById(localStorage.getItem('userId'))
        .subscribe(
          result => {
            this.user = result;
            var items = result.wishlist.items;
            for(let item of items) {
              if(item._id === this.item._id) {
                this.inWishlist = true;
                console.log('está na wishlist');
                break;
              } else {
                this.inWishlist = false;
              }

            }
          }
        );
  }


  private checkInCarrinho(){
    var carrinhoItems =this.carrinhoService.carrinhoItems();
    console.log('vai fazer check do item.');
    var temItem = false;

    for(let i = 0; i < carrinhoItems.length; i++){
      if(carrinhoItems[i].item._id == this.item?._id){
        console.log('Carrinho item id : ', carrinhoItems[i].item._id);
        console.log(' item id : ', this.item?._id);
        console.log('ja comprado.');
        this.isDisabled = true;
        temItem = true;
      }
    }
    if(!temItem) {
      this.isDisabled = false;
    }
  }


  addItemCarrinho(item: Item): void {


    this.carrinhoService.addCarrinho(item);
    this.isDisabled = true;

    console.log(`Item ${item.name} adicionado ao carrinho!`);
  }

  addToWishlist(item: Item) {
    this.isLoadingWishlist = true;
    this.user.wishlist.items.push(item);

    this.userService.updateUser(this.user).subscribe({

      next: (result: User) => {
        this.user = result;
        this.isLoadingWishlist = false;
        this.snackBarSuccess("Adicionado à Wishlist com sucesso!");
        this.inWishlist = true;

      },
      
      error: (err: any) => {
        console.log('Erro dentro do error');
        this.isLoadingWishlist = false;
        this.inWishlist = false;
        this.snackBarError("Erro ao adicionar à wishlist!");
      }
    
    });


  }

  removeFromWishlist(item:Item) {
    this.isLoadingWishlist = true;
    this.user.wishlist.items = this.user.wishlist.items
    .filter(function(el) { return el._id !== item._id; }); 


    
    this.userService.updateUser(this.user).subscribe({

      next: (result: User) => {
        this.user = result;
        this.isLoadingWishlist = false;
        this.snackBarSuccess("Removido da wishlist com sucesso!");
        this.inWishlist = false;

      },
      
      error: (err: any) => {
        console.log('Erro dentro do error');
        this.inWishlist = true;
        this.isLoadingWishlist = false;
        this.snackBarError("Erro ao remover da wishlist!");
      }
    
    });

  }

  snackBarSuccess(message:string) {
    this._snackBar.open(message, undefined, {
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: ['snackbar-success']
      // direction: "rtl"
    });
  }

  snackBarError(message:string) {
    this._snackBar.open(message, undefined, {
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: ["snackbar_error"]
      // direction: "rtl"
    });
  }

  saveComment(comentario:string) {
    this.isloadingAvaliacao = true;
    if(comentario.length > 5000) {
      this.isloadingAvaliacao = false;
      this.snackBarError("Comentário só pode ter no máximo 5000 carateres!");
      return;
    }
    
    console.log(this.ratingValue);

    if(this.ratingValue < 1) {
      this.isloadingAvaliacao = false;
      this.snackBarError("É necessário atribuir pelo menos uma estrela");
      return;
    }
    console.log(comentario);
    if(this.avaliacao !== undefined) {
      this.avaliacao.comentario = comentario;
      this.avaliacao.estrelas = this.ratingValue;
      console.log(this.avaliacao.estrelas);
      this.avaliacaoService.updateAvaliacao(this.avaliacao)
      .subscribe({
        next: result => {
          this.isloadingAvaliacao = false;
          this.snackBarSuccess("Avaliação guardada com sucesso!");
        },
        error: err => {
          this.isloadingAvaliacao = false;
          this.snackBarError("Erro ao guardar avaliação ...");
        }
      });

    
    } else {
      var aval = {} as Avaliacao;
      aval.user = this.user;
      aval.item = this.item;
      aval.estrelas = this.ratingValue;
      aval.comentario =comentario;

      this.avaliacao = aval;
      this.avaliacoes.push(aval);
      this.avaliacaoService.addAvaliacao(aval).subscribe(
        {
          next: result => {
            this.isloadingAvaliacao = false;
            this.snackBarSuccess("Avaliação guardada com sucesso!");
          },
          error: err => {
            this.isloadingAvaliacao = false;
            this.snackBarError("Erro ao guardar avaliação ...");
          }
        }
      );
    }
    
    
  }

  getRatingTotal() {
    var totalRating = 0;

    if(this.avaliacoes.length !== 0 ){
      for(let a of this.avaliacoes) {
        totalRating += a.estrelas;
      }
      this.item.rating = totalRating/this.avaliacoes.length;
  
      this.itemService.updateItem(this.item).subscribe();
    }
    

  }

  showAvaliacao(aval:Avaliacao) {
    this.openDialog(aval);
  }



}

