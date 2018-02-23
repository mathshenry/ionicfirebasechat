import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {AngularFireDatabase, AngularFireObject} from "angularfire2/database";
import {User} from "../../models/user.model";
import {BaseProvider} from "../base/base.provider";

import * as firebase from 'firebase/app';
import {AngularFireAuth} from "angularfire2/auth";
import {FirebaseObjectObservable} from "angularfire2/database-deprecated";

@Injectable()
export class UserProvider extends BaseProvider {

  users: Observable<User[]>;
  currentUser: AngularFireObject<User>;

  constructor(public http: HttpClient,
              public afDb: AngularFireDatabase,
              public afAuth: AngularFireAuth) {
    super();

    this.listenAuthState();

    // this.users = this.afDb.list<User>('users');

  }

  create(user: User): Promise<void> {
    return this.afDb.object(`/users/${user.key}`)
      .set(user)
      .catch(this.handlePromiseError);
  }

  getUserById(userId: string): AngularFireObject<User>{
    return this.afDb.object<User>(`/users/${userId}`);
  }

  userExists(username: string): Observable<boolean> {
    return this.afDb
      .list('/users',
        (ref: firebase.database.Reference) => ref.orderByChild('username').equalTo(username)
      )
      .valueChanges()
      .map((users: User[]) => {
        return users.length > 0;
      }).catch(this.handlePromiseError);
  }

  private listenAuthState(): void {
    this.afAuth
      .authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          console.log('Auth state alterado!');
          this.currentUser = this.afDb.object(`/users/${authUser.uid}`);
          this.setUsers(authUser.uid);
        }
      });
  }

  private setUsers(uidToExclude: string): void {
    this.users = this.mapListKeys<User>(
      this.afDb.list<User>('/users',
        (ref: firebase.database.Reference) => ref.orderByChild('name')
      )
    ).map((users: User[]) => {
      return users.filter((user: User) => user.key !== uidToExclude);
    });
  }

}
