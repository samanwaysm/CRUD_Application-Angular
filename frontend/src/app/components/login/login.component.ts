import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { catchError, tap } from 'rxjs';
import { Store, select } from '@ngrx/store';
import User from '../../models/user.interface';
import { UserLogin } from '../../states/models/user.interface';
import { selectError, selectIsLoading, selectUser } from '../../states/user/user.selectors';
import * as UserActions from '../../states/user/user.action';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isFormSubmited: boolean = false;
  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);
  user$ = this.store.select(selectUser);
  constructor(private userServices: UserService, private route: Router, private store: Store<any>) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/)]),
      password: new FormControl('', [Validators.required]),
    })
  }
  onSubmit(): void {
    if (!this.loginForm.valid || this.isFormSubmited) {
      return this.loginForm.markAllAsTouched();
    }

    this.isFormSubmited = true;
    const userData: UserLogin = this.loginForm.value;
    
    this.store.dispatch(UserActions.login({ formData: userData }));

    this.user$.subscribe((res) => {
      if (res) {
        this.isFormSubmited = false;
      }
    });

    this.error$.subscribe((res) => {
      if (res?.error) {
        this.isFormSubmited = false;
        const errFieldObj: { [key: string]: boolean } = {};
        const fieldName = res.error.errOpt as string;
        errFieldObj[fieldName] = true;
        this.loginForm.get(res.error.err)?.setErrors(errFieldObj);
      }
    });
  }

  // const response$ = this.userServices.loginUser(userData);

  // response$.pipe(
  //   tap((res)=>{
  //     this.isFormSubmited = false;
  //     localStorage.setItem('token', res.token);
  //     this.route.navigate(['/']);
  //   }),
  //   catchError((err: any)=>{
  //     this.isFormSubmited = false;
  //     this.loginForm.get('email')?.setErrors({ alreadyTaken: true});
  //     return [];
  //   })
  // ).subscribe();
}

