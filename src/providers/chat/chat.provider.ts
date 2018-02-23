import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseProvider} from "../base/base.provider";
import {Chat} from "../../models/chat.model";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ChatProvider extends BaseProvider {

  chats: Observable<Chat[]>;

  constructor(public http: HttpClient,
              public afDb: AngularFireDatabase,
              public afAuth: AngularFireAuth) {
    super();
    this.setChats();
  }

  private setChats(): void {


    this.afAuth.authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          this.chats = this.mapListKeys<Chat>(
            this.afDb.list<Chat>(`chats/${authUser.uid}`,
              (ref: firebase.database.Reference) => ref.orderByChild(`timestamp`)
            )
          );
        }
      });
  }

  create(chat: Chat, userId1: string, userId2: string): Promise<void> {
    console.log('uid1:', userId1);
    console.log('uid2:', userId2);

    return this.afDb.object(`/chats/${userId1}/${userId2}`)
      .update(chat)
      .catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string): AngularFireObject<Chat> {
    return this.afDb.object(`/chats/${userId1}/${userId2}`);
    // .valueChanges()
    // .catch(this.handleObservableError);
  }

}
