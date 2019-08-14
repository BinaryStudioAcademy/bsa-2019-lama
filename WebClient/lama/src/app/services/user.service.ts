import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';
import { GetUserDTO, User } from '../models';
import { Observable } from 'rxjs/Rx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private client: HttpClient
  ) { }


  // methods
  public getUser(userId: number): Observable<User>
  {
    return this.client.get<User>(`${environment.lamaApiUrl}/api/users/${userId}`);
  }
  
  public getCurrentUserFromServer(): Observable<GetUserDTO>
  {
    return this.client.get<GetUserDTO>(`${environment.lamaApiUrl}/api/users/current`);
  }
  
  public getCurrentUserFirebase(): Promise<any>{
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
}
