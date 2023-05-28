import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent {
  user! : User;
  hasFollowers! : Boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

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

  getUser():void {
    let userID = this.authService.getUserId();
    this.userService.getUserByIdFollowers(userID).subscribe(user =>{
      this.user = user;
      console.log(this.hasFollowers);
      this.hasFollowers = this.user.followers.length > 0;
    } );

  }
  ngOnInit(){
    this.getUser();
  }
}
