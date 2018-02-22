import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth.provider";
import {User} from "../../models/user.model";
import {UserProvider} from "../../providers/user/user.provider";

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  messages: string[] = [];
  pageTitle: string;
  sender: User;
  recipient: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public userProvider: UserProvider) {
  }

  ionCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    this.recipient = this.navParams.get('recipientUser');
    this.pageTitle = this.recipient.name;
    this.userProvider.currentUser
      .valueChanges()
      .first()
      .subscribe((currentUser: User) => {
        this.sender = currentUser;
      });
  }

  sendMessage(message: string): void {
    this.messages.push(message);
    console.log(this.messages);
  }

}
