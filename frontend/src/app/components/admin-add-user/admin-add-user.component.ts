import { Component } from '@angular/core';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service'; 
import { catchError, tap } from 'rxjs';
import User from '../../models/user.interface';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";

@Component({
    selector: 'app-admin-add-user',
    standalone: true,
    templateUrl: './admin-add-user.component.html',
    styleUrl: './admin-add-user.component.css',
    imports: [RouterLink, ReactiveFormsModule, AdminHeaderComponent]
})
export class AdminAddUserComponent {
  registerForm!: FormGroup;
  isFormSubmited: boolean = false;
  profileImgFileObj: string | File = '';
  previewImg = '';

  constructor(private adminServices: AdminService, private route: Router){
    this.registerForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      profileImg: new FormControl('')
    })
  }

  loadFile(event: any): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files && (files.length > 0 && files.length < 2)) {
      const ImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const validImageExtensions = new Set(ImageExtensions);
      const exec = files[0].name.substring(files[0].name.lastIndexOf('.'));
      if(!validImageExtensions.has(exec)){
        target.value ='';
        this.registerForm.get('profileImg')?.setErrors({required: true});
        //`Please select images Only`
        this.registerForm.get('profileImg')?.setErrors({typeErr: true});
        target.value = '';
      }else{
        const file = files[0];
        this.profileImgFileObj = file;
        this.previewImg = URL.createObjectURL(file);
      }
    } else {
      this.profileImgFileObj = '';
      this.previewImg = '';
    }
  }

  async onSubmit():Promise<void>{
    if(!this.registerForm.valid || (this.registerForm?.value.password !== this.registerForm?.value.confirmPassword) || this.isFormSubmited) {
      return this.registerForm.markAllAsTouched();
    }
    this.isFormSubmited = true;

    // const userData: User = this.registerForm.value;
    // const response$ = this.adminServices.addUser(userData);

    const { name, email, password, confirmPassword } = this.registerForm.value;

    const data: User = {
      name,
      email,
      password,
      confirmPassword,
      profileImg: this.previewImg
    };

    if(this.profileImgFileObj){
      await new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.profileImgFileObj as File);
        fileReader.onload = () => {
            data.profileImg = fileReader.result as string;
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
      });
    }

    const response$ = this.adminServices.addUser(data);
  
    response$.pipe(
      tap((res)=>{
        this.isFormSubmited = false;
        console.log(res,'user added');
        this.route.navigate(['/adminHome']);
      }),
      catchError((err: any)=>{
        this.isFormSubmited = false;
        this.registerForm.get('email')?.setErrors({ alreadyTaken: true});
        return [];
      })
    ).subscribe();
  }
}
