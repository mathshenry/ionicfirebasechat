import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth.provider";
import {User} from "../../models/user.model";
import {UserProvider} from "../../providers/user/user.provider";

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  currentUser: User;
  canEdit: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public userProvider: UserProvider) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {

    this.userProvider.currentUser
      .valueChanges()
      .subscribe((user: User) => {
        this.currentUser = user;
      });

  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.editUser();
  }

  private editUser(photoUrl?: string): void{
    this.userProvider.edit({
      name: this.currentUser.name,
      username: this.currentUser.username,
      photo: photoUrl || this.currentUser.photo
    })
      .then(()=>{
      this.canEdit = false;
    });
  }

}
