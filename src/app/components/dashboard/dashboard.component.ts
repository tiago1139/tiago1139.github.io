import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  navLinks: any[];
  activeLink = null;
  activeLinkIndex = -1;
  //user! :User;

  constructor(private router: Router,
    private userService:UserService) {
    this.navLinks = [
        {
            label: 'Listas',
            link: './lists',
            index: 0
        }, {
            label: 'Biblioteca',
            link: './library',
            index: 1
        }, {
            label: 'A seguir',
            link: './following',
            index: 2
        }, 
        {
          label: 'Seguidores',
          link: './followers',
          index: 3
      }, 
    ];
}
ngOnInit(): void {
  this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
      //let uID = localStorage.getItem("userId");
      //this.userService.getUserById(uID).subscribe(user => this.user = user);
  });
}

}
