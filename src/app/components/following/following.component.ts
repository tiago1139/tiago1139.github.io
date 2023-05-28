import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent {
  user! : User;
  isFollowing! : Boolean;

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
    this.userService.getUserByIdFollowing(userID).subscribe(user =>{
      this.user = user;
      this.isFollowing = this.user.following.length > 0;
    } );

  }
  ngOnInit(){
    this.getUser();
  }

}
