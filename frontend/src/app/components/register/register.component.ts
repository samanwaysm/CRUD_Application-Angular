import { Component } from '@angular/core';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, tap } from 'rxjs';
import User from '../../models/user.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  isFormSubmited: boolean = false;
  profileImgFileObj: string | File = '';
  previewImg = '';

  constructor(private userServices: UserService, private route: Router){
    this.registerForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      profileImg: new FormControl('')
    });
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
    // const response$ = this.userServices.registerUser(userData);

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

    const response$ = this.userServices.registerUser(data);
  
    response$.pipe(
      tap((res)=>{
        this.isFormSubmited = false;
        localStorage.setItem('token', res.token);
        this.route.navigate(['/']);
      }),
      catchError((err: any)=>{
        this.isFormSubmited = false;
        this.registerForm.get('email')?.setErrors({ alreadyTaken: true});
        return [];
      })
    ).subscribe();
  }
}
