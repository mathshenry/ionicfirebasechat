import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {SigninPage} from "../pages/signin/signin";
import {User} from "../models/user.model";
import {AuthProvider} from "../providers/auth/auth.provider";
import {UserProvider} from "../providers/user/user.provider";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = SigninPage;
  currentUser: User;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              authProvider: AuthProvider,
              userProvider: UserProvider) {

    authProvider.afAuth.authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          this.rootPage = HomePage;
          userProvider.currentUser
            .valueChanges()
            .subscribe((user: User) => {
              this.currentUser = user;
            });
        }else{
          this.rootPage = SigninPage;
        }
      });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

