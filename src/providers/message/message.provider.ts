import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {Message} from "../../models/message.model";
import {BaseProvider} from "../base/base.provider";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class MessageProvider extends BaseProvider {

  private limit: BehaviorSubject<number> = new BehaviorSubject<number>(30);

  constructor(public http: HttpClient,
              public afDb: AngularFireDatabase) {
    super();
    console.log('Hello MessageProvider Provider');
  }

  create(message: Message, listMessages: AngularFireList<Message>): Promise<void> {
    return Promise.resolve(listMessages.push(message)).catch(this.handlePromiseError);
  }

  incrementLimit(){
    this.limit.next(this.limit.getValue()+30);
  }

  getMessages(userId1: string, userId2: string): AngularFireList<Message> {
    let messageId: string[] = [userId1, userId2].sort();
    let id1 = messageId[0];
    let id2 = messageId[1];
    let path = id1 + id2;

    return this.afDb.list<Message>(`/messages/${path}`,
      (ref: firebase.database.Reference) => ref.limitToLast(this.limit.getValue()).orderByChild('timestamp')
    );
  }

}
