import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App } from 'ionic-angular';
import { WoShopService } from '../../../../service/wo.shop.service';
import { AppShopping } from '../../../../app/app.shopping';


/**
 * Generated class for the WoPlaceOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wo-place-order',
  templateUrl: 'wo-place-order.html',
})
export class WoPlaceOrderPage {

  remark: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public app: App,
    public appShopping: AppShopping,
    public woShopService: WoShopService,
    public shopSer: WoShopService) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WoPlaceOrderPage');
    this.appShopping.salesDetailList;
  }

  //备注模态框
  toRemark() {

    let profileModal = this.modalCtrl.create('PlaceOrderRemarkPage', { remark: this.remark }, {
      // cssClass: 'custom-modal'
    });
    profileModal.onDidDismiss(data => {
      this.remark = data;
    });
    profileModal.present();
  }
  pop() {
    this.app.getActiveNav().pop();
    // this.navCtrl.pop();
  }

  /** 
   * 立即下单
   * 
   * 流程： 提交订单至后台，判断是桌码还是店码
   * 店码： 提交订单后支付，支付成功跳转到订单详情
   * 桌码： 提交订单后不需要立马支付，直接跳转到订单详情，可支付可加菜
   * 
  */
  placeOrder() {
    this.navCtrl.push('TakeOrderPage')
  }
}
