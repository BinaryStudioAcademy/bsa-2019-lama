import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { HttpService } from './http.service';
import { User } from '../models/User/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public httpService: HttpService
  ){  }


  public getCurrentUser(): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function(user){
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  public updateCurrentUser(value): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }
  
  public getUserByEmail(email: string) {
    let user: User;
    this.httpService.getData(`users/${email}`).subscribe((data:User) => user = data);
    return user;
  }
}
