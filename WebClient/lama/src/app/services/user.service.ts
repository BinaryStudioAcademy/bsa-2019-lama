import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';
import { GetUserDTO, User } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private client: HttpClient,
    private httpService: HttpService
  ) {}

  // methods
  public getUser(userId: number): Observable<User> {
    return this.client.get<User>(
      `${environment.lamaApiUrl}/api/users/${userId}`
    );
  }

  public getCurrentUserFromServer(): Observable<GetUserDTO> {
    return this.client.get<GetUserDTO>(
      `${environment.lamaApiUrl}/api/users/current`
    );
  }

  public getCurrentUserFirebase(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().onAuthStateChanged(e => {
        if (e) {
          resolve(e);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  public updateCurrentUser(value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user
        .updateProfile({
          displayName: value.name,
          photoURL: user.photoURL
        })
        .then(
          res => {
            resolve(res);
          },
          err => reject(err)
        );
    });
  }
  public getUserByEmail(email: string): Observable<User> {
    return this.httpService.getDataWithHeader(`users/email`, { email: data });
  }
}
