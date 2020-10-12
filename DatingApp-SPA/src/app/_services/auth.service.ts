import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable(); //will use this observable to update user photo in different components

  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string){
    this.photoUrl.next(photoUrl);
  } 

  login(model: any){
    //kur kerkesa post behet drejt /api/auth/login, ne Angular, kjo kthen nje Observable te response-it, me response
    //body qe eshte JSON Object
    return this.http.post(this.baseUrl+ 'login',model)
    .pipe(
      map((response: any)=>{
        const user = response;
        if(user){
           localStorage.setItem('token',user.token);
           localStorage.setItem('user',JSON.stringify(user.user));
           this.decodedToken = this.jwtHelper.decodeToken(user.token);
           this.currentUser = user.user;
           this.changeMemberPhoto(this.currentUser.photoUrl);
        }

      })
    )
  }

  register(user: User){
    return this.http.post(this.baseUrl + 'register',user);
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
