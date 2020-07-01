import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab, ModalController, App } from 'ionic-angular';
// import { Tabs } from '../../../../model/tabs';
// import { TabsArea } from '../../../../model/tabsArea';
import { AppShopping } from '../../../../app/app.shopping';
import { Observable } from 'rxjs';
import { WebSocketService } from '../../../../service/webSocketService';

/**
 * Generated class for the HangOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-take-order-tab',
  templateUrl: 'take-order-tab.html',
})
export class TakeOrderTabPage {
  // public tabAreaList: Array<any> = TabsArea;
  // public allTabList: Array<any> = Tabs;
  tabAreaList: any = [];
  allTabList: any = [];
  chackedArea: any = {};
  tabList: any[] = [];
  salesTableList: any = [];
  isShowTableDetail: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appShopping: AppShopping,
    public webSocketService: WebSocketService,
    public app: App,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HangOrderPage');
  }
  ionViewWillEnter() {
    // console.log('1111111111111111111111111111111111111111111');
    // console.log(this.app.getActiveNavContainers());
    this.tabAreaList = this.appShopping.areaList;

    this.webSocketService.getSalesTable({ status: 0 }).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.salesTableList = res.data.pos_salestable;
        this.allTabList = res.data.pos_salestable;
        this.selectArea(this.tabAreaList[0]);
      }
    })

    console.log(this.salesTableList);
    // tabAreaList = this.appShopping.a
  }
  selectArea(item) {
    this.chackedArea = item;

    // this.tabList=this.allTabList;
    this.selectTab(item);
  }

  selectTab(area) {
    let temList = [];
    // this.tabList.length = 0;
    if (area.id == '') {
      temList = this.allTabList;
    } else {
      this.allTabList.forEach(tab => {
        if (tab.areaId == area.id) {
          temList.push(tab);
        }
      });
    }
    this.tabList = temList;
  }


  /**取单 */
  checkedTab(salesTable) {
    this.webSocketService.getSalesDataByTableId({id: salesTable.salesId,isUnRefresh: true}).subscribe(res => {
      if (res.success) {
        this.appShopping.salesTable = salesTable;
        
        this.appShopping.salesCampaignList = res.data.pos_salescampaign;
        this.appShopping.salesDetailList = res.data.pos_salesdetail;
        this.appShopping.salesh = res.data.pos_salesh;
        // console.log(res);
        // console.log(res);
        this.navCtrl.push('TakeOrderPage', {});
      }
    });
  }

  selectManNubmer(tab) {
    let modal = this.modalCtrl.create("ManNumberPage", { tab: tab, salesType: '', area: this.chackedArea }, {
      cssClass: 'custom-modal2'
    });
    modal.present();
  }



}
