import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the WoCommodityDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wo-commodity-detail',
  templateUrl: 'wo-commodity-detail.html',
})
export class WoCommodityDetailPage {
  dish: any = {};
  tapNum = 0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.dish = JSON.parse(this.navParams.get('dish'));
    console.log(this.dish)
  }

  ionViewDidLoad() {
    // setTimeout(() => {
    //   document.getElementById('detailMask').className = 'show'
    // }, 100);
  }

  close() {
    this.viewCtrl.dismiss();
  }

  tap(e) {
    console.log(this.tapNum);
    if (this.tapNum == 0) {
      this.tapNum++;
      setTimeout(() => {
        this.tapNum = 0;
      }, 500);
    } else {
      this.close();
    }

  }

}
