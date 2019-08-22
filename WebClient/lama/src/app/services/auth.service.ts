import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { UserCreate } from '../models/User/userCreate';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  user: UserCreate;
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  isUserExisted = true;
  
  constructor(public afAuth: AngularFireAuth,
              private httpClient: HttpClient,
              private userService: UserService) {
        this.afAuth.idToken.subscribe(token => {
          this.token =  token;
          localStorage.setItem('idKey', this.token); });
        this.userService.getCurrentUserFirebase().then(() => this.isUserExisted = true)
        .catch(() => this.isUserExisted = false);
   }

   loginWithFacebook() {
    return new Promise<any>((toResolve, toReject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        this.saveCredentials(res.user);
        toResolve(res);
      }, err => {
        console.log(err);
        toReject(err);
      });
    });
  }
  
  loginWithFacebookLinked() {
     let existingEmail = null;
     let pendingCredential = null;
     const facebookProvider = new firebase.auth.FacebookAuthProvider();
     return this.afAuth.auth.signInWithPopup(facebookProvider)
      .then(result => {
        if (result.user.email === null) {
          this.afAuth.auth.signOut().then(() => {
            console.log(`${result.user.email}`);
          });
        } else {
          console.log(`${result.user.email}`);
          this.saveCredentials(result.user);
        }
      })
      .catch(error => {
        if (error.code === 'auth/account-exists-with-different-credential') {
          existingEmail = error.email;
          pendingCredential = error.credential;
          return firebase.auth().fetchSignInMethodsForEmail(error.email)
            .then(providers => {
              if (providers.indexOf(firebase.auth.GoogleAuthProvider.PROVIDER_ID) !== -1) {
                const googleProvider = new firebase.auth.GoogleAuthProvider();
                googleProvider.setCustomParameters({login_hint: existingEmail});
                return firebase.auth().signInWithPopup(googleProvider).then(result => {
                  return result.user;
                });
              }
            })
            .then((user) => {
              return user.linkWithCredential(pendingCredential);
            });
        }
        throw error;
      });
   }

   loginWithGoogle() {
    return new Promise<any>((toResolve, toReject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        this.saveCredentials(res.user);
        toResolve(res);
      });
    });
  }

  doLogout() {
    return new Promise((toResolve, toReject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        toResolve();
      } else {
        toReject();
      }
    });
  }

  getLoggedUserId() {
    return Number(localStorage.getItem('userId'));
  }

  getToken() {
    return localStorage.getItem('idKey');
  }

  async saveCredentials(user: firebase.User) {

    localStorage.setItem('email', user.email);
    localStorage.setItem('photoUrl', user.photoURL);
    const names = user.displayName.split(' ');
    let firstName;
    let lastName;
    if (names.length !== 2) {
      firstName = user.displayName;
      lastName = '';
    } else {
      firstName = names[0];
      lastName = names[1];
    }
    this.user = {
      firstName,
      lastName,
      email: user.email,
      photo: {imageUrl: user.photoURL}
    };
    this.toDataUrl(user.photoURL, (img) => {
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        this.user = {
          firstName,
          lastName,
          email: user.email,
          photo: { imageUrl: img}
        };

        this.registerUser(this.user).subscribe(id => {
          console.log(id);
          localStorage.setItem('userId', id.toString());
        });
    });
  }

  toDataUrl(url, callback) {
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

  registerUser(user: UserCreate) {
    return this.httpClient.post<number>(`${environment.lamaApiUrl}/api/users`, user, this.httpOptions);
  }
}
