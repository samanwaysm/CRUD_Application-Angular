import { Injectable } from "@angular/core";
import { Actions,createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/user.service";
import * as UserActions from './user.action'
import { catchError, map, of, switchMap } from "rxjs";
import { UserLogin } from "../models/user.interface";
import { Router } from "@angular/router";

@Injectable()
export class UserEffect {
    constructor(private actions$: Actions, private userService: UserService, private router: Router) {}

    login$ = createEffect(() => {
        console.log('log');
        
        return this.actions$.pipe(
            ofType(UserActions.login),
            switchMap((action: { formData: UserLogin }) => {
                return this.userService.loginUser(action.formData).pipe(
                    map((res) => {
                        localStorage.setItem('token', res.token);
                        this.router.navigate(['/']);
                        return UserActions.loginSuccess({user: res.userData, token: res.token})
                    }),
                    catchError((error) => of(UserActions.loginFailure({ error })))
                )
            })
        )   
    });

    getUserData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(UserActions.getUserData),
            switchMap((action) => {
                return this.userService.getUserDetails().pipe(
                    map((res) => UserActions.getUserDataSuccess({user: res.userData})),
                    catchError((error) => of(UserActions.getUserDataFailure({error})))
                )
            })
        )
    );
}
