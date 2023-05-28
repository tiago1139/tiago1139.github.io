import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile!: User;
  showEdit: boolean = false;
  editProfileForm!: FormGroup;
  usernameExistsError: string = '';
  editSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getUserProfile();
    this.createEditProfileForm();
  }

  getUserProfile(): void {
    const id = localStorage.getItem("userId");
    console.log("ID:", id);
    if (id) {
      this.userService.getUserById(id)
        .subscribe(userProfile => {
          this.userProfile = userProfile;
          console.log(this.userProfile.profilePicture)
          this.createEditProfileForm(); // call createEditProfileForm after userProfile is set
        });
    }
  }

  createEditProfileForm(): void {
    this.editProfileForm = this.formBuilder.group({
      username: [
        "",
        [Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9]*$/)],
        this.usernameValidator.bind(this)
      ],
      firstName: [this.userProfile?.profileInfo?.firstName || ''],
      lastName: [this.userProfile?.profileInfo?.lastName || ''],
      email: [this.userProfile?.profileInfo?.email || '', [Validators.email]],
      phone: [this.userProfile?.profileInfo?.phone || '']
    });
  }

  usernameValidator(control: any): Promise<any> | Observable<any> | null {
    const username = control.value;
    if(username !== this.userProfile.username) {
      return this.userService.checkUsernameAvailability(username).pipe(
        map(res => {
          return res ? { usernameExists: true } : null;
        })
      );
    }
    console.log("Chegou aqui");
    return null;
  }

  toggleEdit(): void {
    this.showEdit = !this.showEdit;
  }

  onSubmit(username : string, firstName : string, lastName : string, email : string, phone : string): void {
    if (this.editProfileForm.valid) {
      this.userProfile.username = username?username:this.userProfile.username;
      this.userProfile.profileInfo.firstName = firstName?firstName:this.userProfile.profileInfo.firstName;
      this.userProfile.profileInfo.lastName = lastName?lastName:this.userProfile.profileInfo.lastName;
      this.userProfile.profileInfo.email = email?email:this.userProfile.profileInfo.email;
      this.userProfile.profileInfo.phone = phone?phone:this.userProfile.profileInfo.phone;
      this.userService.updateUserProfile(this.userProfile)
        .subscribe(() => {
          this.getUserProfile();
          this.showEdit = false;
          this.editSuccess = true;
        });
    }
  }

  changePicture(image: string) {
    var tempPic = this.userProfile.profilePicture;
    this.userProfile.profilePicture = image;
    this.userProfile.alternativePics.push(tempPic);
    this.userProfile.alternativePics = this.userProfile.alternativePics
    .filter(function(el) { return el !== image; });
  }
}
