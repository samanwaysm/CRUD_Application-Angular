import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import user from '../models/user.interface'
import { UpdateUserData } from '../states/models/user.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api : string = 'http://localhost:3001/api'

  constructor(private http: HttpClient) { }

  loginUser(userData: {email: string, password: string}): Observable<any>{
    console.log('l--------------------------------');
    
    const url: string = `${this.api}/login`;
    return this.http.post(
      url,
      userData,
      this.httpOptions()
    );
  }

  registerUser(userData: user): Observable<any>{
    const url : string = `${this.api}/register`;    
    return this.http.post(
      url,
      userData,
      this.httpOptions()
    );
  }

  getUserDetails(): Observable<any> {
    const url: string = `${this.api}/getUser`;
    return this.http.get(
      url,
      this.httpOptions()
    );
   }

   updateUser(newUserData: UpdateUserData): Observable<any> {
    const url: string = `${this.api}/updateUser`;
    return this.http.put(
      url,
      newUserData,
      this.httpOptions()
    );
   }

  verifyToken(): Observable<any> {
    const url: string = `${this.api}/verifyToken`
    return this.http.get(
      url,
      this.httpOptions()
    );
  }

  httpOptions(){
    const tocken: string = localStorage.getItem('token')?? "";

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': tocken
      })
    }
  }
}
