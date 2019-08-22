import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { UserCreate } from '../models/User/userCreate';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  user: UserCreate;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  isUserExisted = true;

  constructor(
    public afAuth: AngularFireAuth,
    private httpClient: HttpClient,
    private userService: UserService,
    private shared: SharedService
  ) {
    this.afAuth.idToken.subscribe(token => {
      this.token = token;
      localStorage.setItem('idKey', this.token);
    });
    this.userService
      .getCurrentUserFirebase()
      .then(() => (this.isUserExisted = true))
      .catch(() => (this.isUserExisted = false));
  }

  public loginWithFacebook() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(
        res => {
          this.saveCreadeatins(res.user);
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public loginWithGoogle() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth.signInWithPopup(provider).then(res => {
        this.saveCreadeatins(res.user);
        resolve(res);
      });
    });
  }

  public loginWithTwitter() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(
        res => {
          this.saveCreadeatins(res.user);
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }

  public getLoggedUserId() {
    return Number(localStorage.getItem('userId'));
  }

  public getToken() {
    return localStorage.getItem('idKey');
  }

  public async saveCreadeatins(user: firebase.User) {
    localStorage.setItem('email', user.email);
    localStorage.setItem('photoUrl', user.photoURL);
    const names = user.displayName.split(' ');
    let fN;
    let lN;
    if (names.length !== 2) {
      fN = user.displayName;
      lN = '';
    } else {
      fN = names[0];
      lN = names[1];
    }
    this.user = {
      firstName: fN,
      lastName: lN,
      email: user.email,
      photo: { imageUrl: user.photoURL }
    };
    this.toDataUrl(user.photoURL, img => {
      localStorage.setItem('firstName', fN);
      localStorage.setItem('lastName', lN);
      this.user = {
        firstName: fN,
        lastName: lN,
        email: user.email,
        photo: { imageUrl: img }
      };

      this.registerUser(this.user).subscribe(id => {
        console.log(id);
        localStorage.setItem('userId', id.toString());
      });
    });
  }

  public toDataUrl(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  public registerUser(user: UserCreate): Observable<any> {
    return this.httpClient.post<number>(
      `${environment.lamaApiUrl}/api/users`,
      user,
      this.httpOptions
    );
  }
}
