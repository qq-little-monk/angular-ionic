import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CommonStatusEnum } from '../../../../providers/common.statusenum';
/**
 * Generated class for the PaymentResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-result',
  templateUrl: 'payment-result.html',
})
export class PaymentResultPage {
  // result: any = {};
  LogisticsType: number;
  payType: number;
  msg: string;
  pickUpNumber: string;
  pickUpTime: string;
  originalPrice: string;
  totalPrice: string;
  isPay: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.pickUpNumber = this.navParams.get('pickUpNumber');
    this.pickUpTime = this.navParams.get('pickUpTime');
    this.LogisticsType = this.navParams.get('LogisticsType');
    this.payType = this.navParams.get('payType');
    this.originalPrice = this.navParams.get('originalPrice');
    this.totalPrice = this.navParams.get('totalPrice')
    if (this.payType == CommonStatusEnum.PayWay.hy) {
      this.msg = '支付成功';
      this.isPay = true;
    } else if (this.payType == CommonStatusEnum.PayWay.dd) {
      this.msg = '下单成功';
      this.isPay = false;
    }
  }

  ionViewDidLoad() {
  }

  back(type) {
    this.viewCtrl.dismiss(type);
    // this.router.navigate(['/LoginTabs']);
  }
}
