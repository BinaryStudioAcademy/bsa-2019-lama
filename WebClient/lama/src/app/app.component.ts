import { Component } from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AngularFireAuth} from '@angular/fire/auth'
import {AuthService} from './services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'lama';

  constructor(private afAuth: AngularFireAuth, private authService: AuthService) { }


  ngOnInit() {
    this.afAuth.user.subscribe((user) => {
      if (user){
        this.authService.saveCreadeatins(user);
      }
    })
  }
}


