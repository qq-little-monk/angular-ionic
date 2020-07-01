import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PlaceOrderRemarkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-place-order-remark',
  templateUrl: 'place-order-remark.html',
})
export class PlaceOrderRemarkPage {
  remark: string;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
    this.remark = this.navParams.get("remark");
  }

  ionViewDidLoad() {
  }
  ionViewDidLeave() {
    // this.close();
  }
  close() {
    this.viewCtrl.dismiss({ remark: this.remark, flag: false });
  }
  submit() {
    this.viewCtrl.dismiss({ remark: this.remark, flag: true });
  }
}
