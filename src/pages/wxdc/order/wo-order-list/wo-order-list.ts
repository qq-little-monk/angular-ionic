import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WoOrderService } from '../../../../service/wo.order.service';


/**
 * Generated class for the WoOrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wo-order-list',
  templateUrl: 'wo-order-list.html',
})
export class WoOrderListPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public orderSer:WoOrderService) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WoOrderListPage');
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

  toDetail(){
    this.navCtrl.push('WoOrderDetailPage')
  }

}
