
import { WoOrderService } from '../../../../service/wo.order.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the WoOrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wo-mt-order-list',
  templateUrl: 'wo-mt-order-list.html',
})

export class WoMtOrderListPage {
  selectCode: string = 'a';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public orderSer: WoOrderService) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WoOrderListPage');
    this.selectCode='a';
  }

  //下拉刷新
  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();

    }, 2000);
  }

  //加载更多
  loadData(infiniteScroll) {

    setTimeout(() => {
      infiniteScroll.complete();
    }, 2000);
  }

  toDetail() {
    this.navCtrl.push('WoOrderDetailPage')
  }

}
