import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController } from 'ionic-angular';
import { WoOrderService } from '../../../../service/wo.order.service';
import { WoShopService } from '../../../../service/wo.shop.service';
import { WoShopDetailPage } from '../../shop/wo-shop-detail/wo-shop-detail';
// import { payMent } from '../../../../model/payMent';


/**
 * Generated class for the WoOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wo-order-detail',
  templateUrl: 'wo-order-detail.html',
})
export class WoOrderDetailPage {
  priceMap = { allSalesPrice: 0, allDisCountPrice: 0, allUndisCountPrice: 0 };
  retalTotalMoney: number;
  totalQty: number;
  nav: any;
  public payMentList: Array<any> = [];
  public salesPayList: any[] = [];

  constructor(public navCtrl: NavController,
    public orderSer: WoOrderService,
    public app: App,
    public woShopService: WoShopService,
    public modalCtrl: ModalController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    this.priceMap = this.woShopService.getAllDiscountItemListpriceMap();
    this.retalTotalMoney = this.woShopService.getRetalTotalMoney();
    this.totalQty = this.woShopService.getTotalNum();
    // console.log(this.priceMap);

    
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 2000);

  }

  addOrder() {
    this.nav = this.app.getActiveNavs();
    this.nav[0].setRoot(WoShopDetailPage);
  }

  goToPayMent() {
    let modal = this.modalCtrl.create("PayMentkeyboardPage", { salesDetail: '' }, {
      cssClass: 'custom-modal2'
    });
    modal.present();
  }
}
