import {AlertController, Loading, LoadingController} from 'ionic-angular';

export abstract class BasePage {

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {}

  protected showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    return loading;

  }

  protected showAlert(message: string): void {

    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();

  }

}
