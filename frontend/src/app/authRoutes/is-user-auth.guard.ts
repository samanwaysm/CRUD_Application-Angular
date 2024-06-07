import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, of } from 'rxjs';

export const isUserAuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const token: string | null = localStorage.getItem('token');
  const router: Router = inject(Router);
  const routes: string[] = ['/login', '/register'];
  if(!token && !routes.includes(state.url)){
    router.navigate(['/login'])
    return false;
  }else if(token && routes.includes(state.url)){
    router.navigate(['/']);
    return false;
  }else if(!token && routes.includes(state.url)){
    return true;
  }
  
  return userService.verifyToken()
    .pipe(
      map(response => {
        if (!response.invalidToken) {
          return true;
        }

        localStorage.removeItem('token');
        router.navigate(['/login']);
        return false;
      }),
      catchError(error => {
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return of(false);
      })
    );
};
