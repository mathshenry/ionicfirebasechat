import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import { map } from 'rxjs/operators/map';

import {AngularFireDatabase} from "angularfire2/database";
import {User} from "../../models/user.model";
import {BaseProvider} from "../base/base.provider";

import * as firebase from 'firebase/app';

@Injectable()
export class UserProvider extends BaseProvider {

  // private users: Observable<User[]>;

  constructor(public http: HttpClient,
              public afDb: AngularFireDatabase) {
    super();

    // this.users = this.afDb.list<User>('users');

  }

  create(user: User, uuid: string): Promise<void> {
    return this.afDb.object(`/users/${uuid}`)
      .set(user)
      .catch(this.handlePromiseError);
  }

  userExists(username: string): Observable<boolean> {
    return this.afDb
      .list('/users',
        (ref: firebase.database.Reference) => ref.orderByChild('username').equalTo(username)
      )
      .valueChanges()
      .map((users: User[]) =>{
        return users.length>0;
      }).catch(this.handlePromiseError);
  }

}
