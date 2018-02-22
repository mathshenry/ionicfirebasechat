import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {AngularFireModule, FirebaseAppConfig} from "angularfire2";
import {SignupPage} from "../pages/signup/signup";
import {UserProvider} from '../providers/user/user.provider';
import {AuthProvider} from '../providers/auth/auth.provider';
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {HttpClientModule} from "@angular/common/http";
import {SigninPage} from "../pages/signin/signin";

const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyAcXRiqUoTWS-_ONzSkeEWMqGvFAPhEW6g",
  authDomain: "ionic2-firebase-chat-289cc.firebaseapp.com",
  databaseURL: "https://ionic2-firebase-chat-289cc.firebaseio.com",
  projectId: "ionic2-firebase-chat-289cc",
  storageBucket: "ionic2-firebase-chat-289cc.appspot.com",
  messagingSenderId: "605116762085"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserProvider,
    AuthProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
