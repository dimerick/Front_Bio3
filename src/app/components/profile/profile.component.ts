import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'], 
  providers: [UserService]
})
export class ProfileComponent implements OnInit {
  public user: User;
  public idUser: number;

  constructor(
    private userService: UserService, 
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idUser = +params['id'];
    });
this.getUser();
  }

  getUser(){
    this.userService.getInfoUser(this.idUser).subscribe(resp => {
this.user = resp;
    }, 
    (err) => {

    })
  }

}
