import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string;


  constructor(public afAuth: AngularFireAuth) {
        this.afAuth.idToken.subscribe(token => {this.token =  token});
   }

   public loginWithFacebook(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        res.user.getIdToken().then(token => {
          localStorage.setItem("idKey",token);
        })

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
        res.user.getIdToken().then(token => {
          localStorage.setItem("idKey",token);
        })

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
        res.user.getIdToken().then(token => {
          localStorage.setItem("idKey",token);
        })
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
    if(!this.token){
      this.afAuth.idToken.subscribe(token => {this.token =  token});
    }
    return this.token;
  }
}
