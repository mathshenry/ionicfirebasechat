import {Component, ViewChild} from '@angular/core';
import {Content, NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth.provider";
import {User} from "../../models/user.model";
import {UserProvider} from "../../providers/user/user.provider";
import {AngularFireList, AngularFireObject} from "angularfire2/database";
import {Message} from "../../models/message.model";
import {MessageProvider} from "../../providers/message/message.provider";
import {Chat} from "../../models/chat.model";
import {ChatProvider} from "../../providers/chat/chat.provider";
import {Observable} from "rxjs/Observable";

import firebase from 'firebase';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  @ViewChild('txtMessage') txtMessage;
  messages: AngularFireList<Message>;
  viewMessages: Observable<Message[]>;
  pageTitle: string;
  sender: User;
  recipient: User;
  private chat1: AngularFireObject<Chat>;
  private chat2: AngularFireObject<Chat>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public userProvider: UserProvider,
              public messageProvider: MessageProvider,
              public chatProvider: ChatProvider) {
  }

  ionCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    this.recipient = this.navParams.get('recipientUser');
    this.pageTitle = this.recipient.name;

    this.userProvider
      .mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {
        this.sender = currentUser;

        this.chat1 = this.chatProvider.getDeepChat(this.sender.key, this.recipient.key);
        this.chat2 = this.chatProvider.getDeepChat(this.recipient.key, this.sender.key);

        this.messages = this.messageProvider.getMessages(this.recipient.key, this.sender.key);

        this.viewMessages = this.messageProvider.mapListKeys<Message>(this.messages);
        this.viewMessages
          .subscribe((messages: Message[]) => {
            this.scrollToBottom();
          });

      });
  }

  sendMessage(message: string): void {
    if (message) {
      let currentTimestamp = firebase.database.ServerValue.TIMESTAMP;

      this.messageProvider.create(
        new Message(this.sender.key, message, currentTimestamp),
        this.messages
      ).then(() => {
        this.chat1.update({
          timestamp: currentTimestamp,
          lastMessage: message
        });
        this.chat2.update({
          timestamp: currentTimestamp,
          lastMessage: message
        });
      });

      this.txtMessage.setFocus();

    }
  }

  private scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if (this.content._scroll) {
        this.content.scrollToBottom(duration || 150);
      }
    }, 50);
  }

}
