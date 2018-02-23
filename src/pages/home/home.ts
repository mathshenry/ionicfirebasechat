import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SignupPage} from "../signup/signup";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {Observable} from "rxjs/Observable";
import {User} from "../../models/user.model";
import {UserProvider} from "../../providers/user/user.provider";
import {ChatPage} from "../chat/chat";
import {ChatProvider} from "../../providers/chat/chat.provider";
import {Chat} from "../../models/chat.model";

import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: Observable<User[]>;
  chats: Observable<Chat[]>;
  view = 'chats';

  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider,
              public chatProvider: ChatProvider,
              public userProvider: UserProvider) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    this.users = this.userProvider.users;
    this.chats = this.chatProvider.chats;
  }

  onSignup(): void {
    this.navCtrl.push(SignupPage);
  }

  onChatOpen(chat: Chat): void{
    let recipientUserId = chat.otherUid;

    this.userProvider.getUserById(recipientUserId)
      .valueChanges()
      .first()
      .subscribe((user: User) => {
        console.log(user);
        this.navCtrl.push(ChatPage, {
          recipientUser: user
        })
      });
  }

  onChatCreate(recipientUser: User): void {

    this.userProvider
      .mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {
        this.chatProvider
          .mapObjectKey<Chat>(this.chatProvider.getDeepChat(currentUser.key, recipientUser.key))
          .first()
          .subscribe((chat: Chat) => {
            if(!chat.title){

              let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

              let chat1 = new Chat('', timestamp, recipientUser.name, (recipientUser.photo || ''), recipientUser.key);
              // console.log('chat1:',chat1);
              // console.log('currentUser:',currentUser);
              // console.log('recipientUser:',recipientUser);
              this.chatProvider.create(chat1, currentUser.key, recipientUser.key);
              let chat2 = new Chat('', timestamp, currentUser.name, (currentUser.photo || ''), currentUser.key);
              this.chatProvider.create(chat2, recipientUser.key, currentUser.key);
            }
          });
      });
    this.navCtrl.push(ChatPage, {
      recipientUser: recipientUser
    });
  }

}
