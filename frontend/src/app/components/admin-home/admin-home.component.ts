import { Component } from '@angular/core';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";
import { RouterLink } from '@angular/router';
import User from '../../models/user.interface';
import { AdminService } from '../../services/admin.service';
import { catchError, tap } from 'rxjs';

@Component({
    selector: 'app-admin-home',
    standalone: true,
    templateUrl: './admin-home.component.html',
    styleUrl: './admin-home.component.css',
    imports: [RouterLink,AdminHeaderComponent]
})
export class AdminHomeComponent {
    users!: User[];
    private usersData!: User[];
    noProfileImg: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVJm69EJHsFuzuY5rGHvLv0jcO6MACgPyNGrSKe4Fm1yH0SB-Dcpf79OVa4vGi2yIYUrI&usqp=CAU';
    userDeleteId: string = '';

    constructor(private adminService: AdminService) {
        this.loadAllUsers();
    }

    private loadAllUsers(): void {  
        this.adminService.getAllUsers().pipe(
            tap((res) => {
                if (res.userData) {
                    console.log(res.userData);
                    
                    this.usersData = res.userData as User[];
                    this.users = this.usersData
                }
            }),
            catchError((err: any) => {
                console.error(err);
                return [];
            })
        ).subscribe();
    }

    filterUserData(event: string): void{
      this.users = this.usersData.filter((each: User) => {
        if(each.name.toLowerCase().includes(event.toLowerCase()) || each.email.toLowerCase().includes(event.toLowerCase())){
          return true
        }else{
          return false;
        }
      })
    }

    deleteUser(userId: string): void {
        this.userDeleteId = userId;
    }

    closeModal(){
        this.userDeleteId = '';
      }
    
      confirmDelete(event: any) {
        event.stopPropagation();
        this.adminService.deleteUser(this.userDeleteId).pipe(
          tap((res) => {
            if(res.message){
              this.loadAllUsers();
              this.userDeleteId = '';
            }
          }),
          catchError((err: any) => {
            console.error(err);
            return [];
          })
        ).subscribe();
      }
}
