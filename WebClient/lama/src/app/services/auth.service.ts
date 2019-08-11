import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User/user';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { UserCreate } from '../models/User/userCreate';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string;
  _user: UserCreate;
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  isUserExisted: boolean = true;

  constructor(public afAuth: AngularFireAuth, private httpClient: HttpClient,private userService: UserService) {
        this.afAuth.idToken.subscribe(token => {
          this.token =  token
          localStorage.setItem('idKey',this.token)});
        this.userService.getCurrentUser().then(() => this.isUserExisted = true)
        .catch(() => this.isUserExisted = false)
   }

   public loginWithFacebook(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        this.saveCreadeatins(res.user);
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    });
   }

   public loginWithGoogle(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        this.saveCreadeatins(res.user);
        resolve(res);
      })
    });
   }

   public loginWithTwitter(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        this.saveCreadeatins(res.user);
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }


  public doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.auth.signOut();
        resolve();
      }
      else{
        reject();
      }
    });
  }

  public getToken() {
    return localStorage.getItem("idKey");
  }

  public saveCreadeatins(user: firebase.User) {
    localStorage.setItem('email', user.email);
    localStorage.setItem('photoUrl', user.photoURL);
    let names = user.displayName.split(' ');
    let firstName;
    let lastName;
    if (names.length != 2) {
      firstName = user.displayName;
      lastName = ""
    }
    else {
      firstName = names[0];
      lastName = names[1];
    }
    this.toDataUrl(user.photoURL, (img) => {
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        this._user = {
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          photo: { imageUrl: img}
        }
      this.registerUser(this._user);
    })
  }  

  public toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }


  public registerUser(user: UserCreate) {
    this.httpClient.post<number>(`${environment.lamaApiUrl}/api/users`, user, this.httpOptions).subscribe(id => {
      console.log(id);
      localStorage.setItem('userId', id.toString());
    })
  }
  
}
