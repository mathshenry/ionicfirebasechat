import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SignupPage} from "../signup/signup";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {BasePage} from "../base/base";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage extends BasePage{

  private signinForm: FormGroup;
  private emailRegex: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public authProvider: AuthProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    super(alertCtrl, loadingCtrl);

    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  onSignup(): void {
    this.navCtrl.push(SignupPage);
  }

  onSubmit(): void {
    let loading = this.showLoading();
    this.authProvider.signinWithEmail(this.signinForm.value)
      .then((signedIn: boolean)=>{
        if(signedIn){
          this.navCtrl.setRoot(HomePage);
          loading.dismiss();
        }else{
          loading.dismiss();
          this.showAlert('Sign in failed!');
        }
      }).catch((error: any) => {
      loading.dismiss();
      this.showAlert(error);
    })
  }

}
