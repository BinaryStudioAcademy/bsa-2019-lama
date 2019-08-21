import { Component } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'lama';

  constructor(private afAuth: AngularFireAuth, private authService: AuthService) { }
}


