import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab, ModalController, App, ViewController } from 'ionic-angular';
import { AppShopping } from '../../../../app/app.shopping';
import { WebSocketService } from '../../../../service/webSocketService';

/**
 * Generated class for the HangOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-order-tab',
  templateUrl: 'change-order-tab.html',
})
export class ChangeOrderTabPage {

  tabList: any[] = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appShopping: AppShopping,
    public webSocketService: WebSocketService,
    public app: App,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  }
  ionViewWillEnter() {
 //   this.tabList = this.appShopping.tableList.filter(item => item.tmpSalesTableList.length > 0)
    this.tabList = this.appShopping.tableList.filter(item => item.tmpSalesTableList.length <= 0)
  }
  selectArea(item) {

    this.selectTab(item);
  }

  selectTab(table) {
    this.viewCtrl.dismiss({ data: table, flag: true });
  }

}
