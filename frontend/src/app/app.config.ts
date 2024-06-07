import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { userReducer } from './states/user/user.reducer';
import { provideEffects } from '@ngrx/effects';
import { UserEffect } from './states/user/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideHttpClient(), 
    provideStore(),
    provideStore({user: userReducer}),
    provideState({name: 'user', reducer: userReducer}),
    provideEffects(UserEffect)],
};
