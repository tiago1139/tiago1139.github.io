import {Component, OnInit} from '@angular/core';
import { AuthService } from './auth/auth.service';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemService} from "./services/item/item.service";
import {map, startWith} from "rxjs/operators";
import {Item} from "./models/item";
import {CarrinhoService} from "./services/carrinho/carrinho.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  loggedIn : any;
  title = 'gamestore-psi12';
  myControl = new FormControl();
  items: any[] = [];
  filteredOptions!: Observable<any>;


  constructor(private carrinhoService: CarrinhoService, private authService : AuthService, private router: Router, private activatedRoute: ActivatedRoute, private itemService: ItemService) {

  }


  ngOnInit(): void {
    this.authService.getAuthStatusListener().subscribe(result => {
      this.loggedIn = result;

    });
    this.loggedIn = this.authService.getIsAuth();
    const searchItem = this.activatedRoute.snapshot.paramMap.get('searchItem');

    this.myControl.setValue(searchItem);

    this.itemService.getItems().subscribe(items => {
      this.items = items;

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterItemsOptions(value))
      );


    });
  }


  filterItemsOptions(value: string): string[] {
    const filteredValue = value.toString().toLowerCase();
    const filtered = this.items.filter(option => option.name.toLowerCase().includes(filteredValue));
    return filtered;
  }

  onOptionSelected(event: any): void {
    const selectedValue = event.option.value;
    this.router.navigate(['/items', selectedValue._id]);
  }

  onEnterKeyPressed(): void {
    const itemSearched = this.myControl.value;
    let found = false;
    if(typeof itemSearched === "string") {
      this.items.some(item => {
        if(!found){
          if(item.name.toLowerCase() === itemSearched.toLowerCase()) {
            this.router.navigate(['/items', item._id]);
            found = true;
          } else {
            this.router.navigate(['/notfound']);
          }
        }

      });
    } else {
      this.items.some(item => {
        if (this.items.some(item => item._id === itemSearched._id)) {
          this.router.navigate(['/items', itemSearched._id]);
        } else {
          this.router.navigate(['/notfound']);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  displayProperty(value: any){
    if(value){
      return value.name;
    }
  }

}
