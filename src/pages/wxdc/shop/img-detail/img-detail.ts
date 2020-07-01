import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

declare var funParabola: any;
@IonicPage()
@Component({
  selector: 'page-img-detail',
  templateUrl: 'img-detail.html',
})
export class ImgDetailPage {
  dish: any = {};
  tapNum = 0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.dish = JSON.parse(this.navParams.get('dish'));
    // console.log(this.dish)
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
