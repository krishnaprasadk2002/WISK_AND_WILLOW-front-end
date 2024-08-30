import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent  implements OnInit{
  userProfile:User = {
    name: '',
    email: '',
    mobile: '',
    imageUrl:''
  }
constructor(private userServices:UserservicesService){}
  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile():void{
    this.userServices.getUserProfile().subscribe(
      (profile)=>{
        console.log(profile);
         this.userProfile = profile
      },(error)=>{
        console.error('Error fetching user profile', error);
      }
    )
  }

}
