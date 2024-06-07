import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import user from '../models/user.interface';
import { AdminLogin } from '../states/models/admin.interface'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private api: string = 'http://localhost:3001/admin/api';
  constructor(private http: HttpClient) { 

  }
  login(adminData: AdminLogin): Observable<any> {
    const url: string = `${this.api}/login`;
    return this.http.post(
      url,
      adminData,
      this.httpOptions()
    );
  }
  getAllUsers(): Observable<any> {
    const url: string = `${this.api}/getAllUsers`;
    return this.http.get(
      url,
      this.httpOptions()
    );
  }
  addUser(userData: user): Observable<any>{    
    const url : string = `${this.api}/addUser`;    
    return this.http.post(
      url,
      userData,
      this.httpOptions()
    );
  }

  getUserDetails(userId: string): Observable<any> {
    const url: string = `${this.api}/getUserDetails/${userId}`;
    return this.http.get(
      url,
      this.httpOptions()
    );
  }

  updateUser(userId: string, data: user): Observable<any> {
    console.log('upd----',data);
    
    const url: string = `${this.api}/updateUser/${userId}`;
    return this.http.put(
      url,
      data,
      this.httpOptions()
    )
  }

  deleteUser(userId: string): Observable<any> {
    const url: string = `${this.api}/deleteUser/${userId}`;
    return this.http.delete(
      url,
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
