import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";

import * as firebase from 'firebase/app';
import {BaseProvider} from "../base/base.provider";

@Injectable()
export class AuthProvider extends BaseProvider {

  constructor(public http: HttpClient,
              public afAuth: AngularFireAuth) {
    super();
  }

  createAuthUser(user: { email: string, password: string }): Promise<firebase.User> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .catch(this.handlePromiseError);
  }

  signinWithEmail(user: { email: string, password: string }): Promise<boolean> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then((authUser: firebase.User) => {
        return authUser != null;
      }).catch(this.handlePromiseError);
  }

  logout(): Promise<void>{
    return this.afAuth.auth.signOut();
  }

  get authenticated(): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) =>{
      this.afAuth.authState
        .first()
        .subscribe((authUser: firebase.User) => {
          (authUser) ? resolve(true) : reject(false);
        });
    });
  }

}
