import {Component} from '@angular/core';
import {AlertController, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserProvider} from "../../providers/user/user.provider";
import {AuthProvider} from "../../providers/auth/auth.provider";

import * as firebase from 'firebase/app';
import {HomePage} from "../home/home";
import {BasePage} from "../base/base";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage extends BasePage {

  private signupForm: FormGroup;
  private emailRegex: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public userProvider: UserProvider,
              public authProvider: AuthProvider) {
    super(alertCtrl, loadingCtrl);

    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

  }

  ionViewDidLoad() {}

  onSubmit(): void {

    let loading: Loading = this.showLoading();
    let formUser = this.signupForm.value;
    let username = formUser.username;

    this.userProvider.userExists(username)
      .first()
      .subscribe((userExists: boolean) => {

        if(!userExists){

          this.authProvider.createAuthUser({
            email: formUser.email,
            password: formUser.password
          }).then((authUser: firebase.User) => {

            delete formUser.password;
            formUser.uid = authUser.uid;

            this.userProvider.create(formUser, formUser.uid)
              .then(() => {
                loading.dismiss();
                this.showAlert('User signed up with success!');
                this.navCtrl.setRoot(HomePage);
              }).catch((error: any) => {
              console.log(error);
              loading.dismiss();
              this.showAlert(error);
            });
          }).catch((error: any) => {
            console.log(error);
            loading.dismiss();
            this.showAlert(error);
          });

        }else{
          this.showAlert(`The username ${username} already exists!`);
          loading.dismiss();
          return;
        }

      });
  }

}
