import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  userProfile: any;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    const id = localStorage.getItem("userId");
    if (id) {
      this.userService.getUserById(id)
        .subscribe(userProfile => this.userProfile = userProfile);
    }
  }

  updateUserProfile(): void {
    this.userService.updateUserProfile(this.userProfile)
      .subscribe(() => {
        alert("Perfil atualizado com sucesso!");
        this.router.navigate(['/user-profile']);
      });
  }
}
