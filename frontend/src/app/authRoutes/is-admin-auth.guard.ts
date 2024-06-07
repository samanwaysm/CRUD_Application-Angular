import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const isAdminAuthGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminService);
  const token: string | null = localStorage.getItem('token');
  const router: Router = inject(Router);
  const routes: string[] = ['/adminlogin'];

  if(!token && !routes.includes(state.url)){
    router.navigate(['/adminlogin'])
    return false;
  }else if(token && routes.includes(state.url)){
    router.navigate(['/adminHome']);
    return false;
  }else if(!token && routes.includes(state.url)){
    return true;
  }
  return adminService.verifyToken()
  .pipe(
    map(response => {
      if (!response.invalidToken) {
        return true;
      }

      localStorage.removeItem('token');
      router.navigate(['/adminlogin']);
      return false;
    }),
    catchError(error => {
      localStorage.removeItem('token');
      router.navigate(['/adminlogin']);
      return of(false);
    })
  );
};
