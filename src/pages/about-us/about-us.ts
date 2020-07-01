import {Component, Inject} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {APP_CONFIG, AppConfig} from "../../app/app.config";

/**
 * Generated class for the AboutUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUSPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(APP_CONFIG) private config: AppConfig) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AboutUsPage');
  }
  swipeEvent(e) {
    this.navCtrl.pop();
  }

  // get navCtrl(): NavController {
  //   return this.app.getRootNav();
  // }
}
