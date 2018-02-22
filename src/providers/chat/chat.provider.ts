import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BaseProvider} from "../base/base.provider";
import {Chat} from "../../models/chat.model";
import {AngularFireDatabase, AngularFireObject} from "angularfire2/database";

@Injectable()
export class ChatProvider extends BaseProvider{

  constructor(
    public http: HttpClient,
    public afDb: AngularFireDatabase
  ) {
    super();
  }

  create(chat: Chat, userId1: string, userId2: string): Promise<void>{
    return this.afDb.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string): AngularFireObject<Chat>{
    return this.afDb.object(`/chats/${userId1}/${userId2}`);
      // .valueChanges()
      // .catch(this.handleObservableError);
  }

}
