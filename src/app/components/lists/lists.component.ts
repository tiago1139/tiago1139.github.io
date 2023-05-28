import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { List } from 'src/app/models/list';
import { User } from 'src/app/models/user';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';
import { ListCreationComponent } from '../list-creation/list-creation.component';
import { ItemService } from 'src/app/services/item/item.service';
import { ListService} from 'src/app/services/list/list.service';
import { Item } from 'src/app/models/item';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})

export class ListsComponent {
  user! :User;
  hasLists : Boolean = true;

  panelOpenState = false;


  constructor(
    private userService: UserService,
    private authService: AuthService,
    public dialog: MatDialog,
    private itemService: ItemService,
    private listService: ListService
  ) {}

  async criarLista() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { user: this.user };
    
    const dialogRef = this.dialog.open(ListCreationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      let User2:User = this.user;
      User2 = result;
      this.userService.updateUser(User2).subscribe(user => {
        this.user = user;
        this.getUser();
      })
      console.log(User2);
    });
  }


  travelKeyboard(event: KeyboardEvent) {
    const currentElement = event.target as HTMLElement;
    let nextElement: HTMLElement | null;
    nextElement = null;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        nextElement = currentElement.previousElementSibling as HTMLElement;
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        nextElement = currentElement.nextElementSibling as HTMLElement;
        break;
    }

    if (nextElement != null) {
      console.log("inside");
      currentElement.classList.remove('hovered');
      nextElement.classList.add('hovered');
      nextElement.focus();
    }
  }

  getUser(){
    let userID = this.authService.getUserId();
    this.userService.getUserById(userID).subscribe(user =>{
      console.log(user);
      this.user = user;
      this.hasLists = this.user.lists.length > 0;
      console.log(this.hasLists);
      for (let index1 = 0; index1 < this.user.lists.length; index1++) {
        console.log(this.user.lists[index1].title);
        console.log(this.user.lists[index1].items.length);
        this.listService.getListById(this.user.lists[index1]._id).subscribe(list =>{
          this.user.lists[index1] = list;
          /*for (let index = 0; index < list.items.length; index++) {
            const element = list.items[index];
            this.user.lists[index1].items.push(element);
            //console.log(element);
            
          }
        });*/
      });
      
    } });
  }

  ngOnInit(): void {
    this.getUser();
  };
}

