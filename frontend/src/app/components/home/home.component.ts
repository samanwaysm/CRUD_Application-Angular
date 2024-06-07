import { Component } from '@angular/core';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { EditUserProfileComponent } from '../edit-user-profile/edit-user-profile.component';
import { UserService } from '../../services/user.service';
import User from '../../models/user.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserProfileComponent,EditUserProfileComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userData!: User;
  editForm: boolean = false;

  constructor(private userSerivice: UserService){
  }

  showForm(status: boolean): void {
    this.editForm = status;
  }

}
