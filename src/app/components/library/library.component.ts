import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {Item} from "../../models/item";
import {User} from "../../models/user";
import {UserService} from "../../services/user/user.service";
import {ItemCarrinho} from "../../models/itemCarrinho";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';



@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, AfterViewInit {

  itemsLibrary!: ItemCarrinho[];
  user!: User;

  displayedColumns: string[] = ['imagem','name','quantidade', 'data', 'botao'];
  dataSource : any;
  constructor(private userService: UserService,
    private _liveAnnouncer: LiveAnnouncer) { }
  
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  
  ngOnInit(): void {
    this.userService.getUserById(localStorage.getItem('userId')).subscribe(
      user => {
        this.user = user;
        this.itemsLibrary = this.user.library;
        this.dataSource = new MatTableDataSource(this.itemsLibrary);
        this.dataSource.sortingDataAccessor = (item: { [x: string]: any; item: { name: any; }; }, property: string | number) => {
          switch(property) {
            case 'name': return item.item.name;
            default: return item[property];
          }
        };
      }
    );
  }


  getItems(): ItemCarrinho[]{
    console.log(this.user.library.length);
    console.log(this.user.library);
    return this.user.library;
  }



}
