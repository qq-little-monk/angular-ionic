import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab, ModalController, ActionSheetController, Events } from 'ionic-angular';
// import { Tabs } from '../../../../model/tabs';
// import { TabsArea } from '../../../../model/tabsArea';
import { TableService } from '../../../../service/tableService';
import { WebSocketService } from '../../../../service/webSocketService';
import { AppShopping } from '../../../../app/app.shopping';
import { WoShopService } from '../../../../service/wo.shop.service';
import { UtilProvider } from '../../../../providers/util/util';
import { HttpProvider } from '../../../../providers/http';
import { PrintService } from '../../../../service/printService';
import { WoShopDetailPage } from '../../shop/wo-shop-detail/wo-shop-detail';

/**
 * Generated class for the HangOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-main-order',
  templateUrl: 'main-order.html',
})
export class MainOrderPage {
  public tabAreaList: Array<any> = [];
  public allTabList: Array<any> = [];
  chackedArea: any = {};
  tabList: any[] = [];
  isShowTableDetail: boolean = false;
  callback: (data: any) => Promise<any>;
  checkedTab: any = {};
  isTakeOrder: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public tableService: TableService,
    public webSocketService: WebSocketService,
    public appShopping: AppShopping,
    public woShopService: WoShopService,
    public utilProvider: UtilProvider,
    public actionSheetCtrl: ActionSheetController,
    public http: HttpProvider,
    public events: Events,
    public printService: PrintService,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HangOrderPage');
    this.tabAreaList = this.appShopping.areaList;
    this.allTabList = this.appShopping.tableList;
    this.selectArea(this.tabAreaList[0]);
    // console.log(this.tabAreaList);
    console.log(this.allTabList);

  }
  ionViewWillEnter() {
    this.woShopService.clearToCartSilent();
    /**取单 */
    if (this.navParams.get('isTakeOrder')) {
      this.isTakeOrder = true;
    }
    //监听区域更新事件 */
    this.tableService.alertCtrlShow = false;
    this.events.subscribe('area:refresh', (EventData) => {
      // this.tabAreaList.length=0;
      this.tabAreaList = this.appShopping.areaList;
    });
    //监听餐桌更新事件 */
    this.tableService.alertCtrlShow = false;
    this.events.subscribe('table:refresh', (EventData) => {
      this.ionViewDidLoad()
    });
  }
  ionViewDidLeave() {
    this.events.unsubscribe('area:refresh');
    this.events.unsubscribe('table:refresh');
  }
  selectArea(item) {
    this.chackedArea = item;
    // this.tabList=this.allTabList;
    this.selectTab(item);
  }


  selectTab(area) {
    let tmpList = [];
    if (area.id == "") {
      tmpList = this.allTabList;
    } else {
      this.allTabList.forEach(tab => {
        if (tab.areaId == area.id) {
          tmpList.push(tab);
        }
      });
    }
    this.tabList = tmpList;
  }


  /**选择有单餐桌
   * 
   */
  checkedSalesTabFan(tab) {
    this.checkedTab = tab;
    // if (this.isTakeOrder) {
    // if (tab.tmpSalesTableList.length > 1) {
    //   this.isShowTableDetail = true;
    // } else {
    // this.clickSalesTable(tab.tmpSalesTableList[0]);
    this.moreOperations(tab);
    // }

    // } else {
    //   this.moreOperations(tab);
    // }
  }
  moreOperations(tab) {
    let con = [];
    // if (true) {
    //   con.push(
    //     {
    //       text: '加菜',
    //       handler: () => {
    //         // this.checkedTab = tab;
    //         // this.isShowTableDetail = true;
    //         if (tab.tmpSalesTableList.length > 1) {
    //           this.isShowTableDetail = true;
    //         } else {
    //           this.clickSalesTable(tab.tmpSalesTableList[0]);
    //         }

    //       }
    //     }
    //   );
    // }
    if (true) {
      con.push(
        {
          text: '取单',
          handler: () => {
            this.isTakeOrder = true;
            if (tab.tmpSalesTableList.length > 1) {
              this.isShowTableDetail = true;
            } else {
              this.takeOrder(tab.tmpSalesTableList[0]);
              // this.clickSalesTable(tab.tmpSalesTableList[0]);
            }

          }
        }
      );
    }
    // if (true) {
    //   con.push(
    //     {
    //       text: '留台',
    //       handler: () => {
    //         this.selectManNubmer(this.checkedTab);
    //       }
    //     }
    //   );
    // }
    if (true) {
      con.push(
        {
          text: '拼桌',
          handler: () => {
            this.selectManNubmer(this.checkedTab);
          }
        }
      );
    }
    // if (true) {
    //   con.push(
    //     {
    //       text: '改单',
    //       handler: () => {
    //         this.selectManNubmer(this.checkedTab);
    //       }
    //     }
    //   );
    // }

    // if (true) {
    //   con.push(
    //     {
    //       text: '撤台',
    //       handler: () => {
    //         this.selectManNubmer(this.checkedTab);
    //       }
    //     }
    //   );
    // }
    // if (true) {
    //   con.push(
    //     {
    //       text: '转台',
    //       handler: () => {
    //         this.selectManNubmer(this.checkedTab);
    //       }
    //     }
    //   );
    // }

    con.push(
      {
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    );

    let actionSheet = this.actionSheetCtrl.create({
      buttons: con
    });

    actionSheet.present();
  }

  cancel() {
    this.isShowTableDetail = false;
  }
  clickSalesTable(salesTable) {
    if (this.isTakeOrder) {
      this.takeOrder(salesTable);
    } else {
      this.addItemOfOrder(salesTable);
    }
  }
  /**加菜 */
  addItemOfOrder(salesTable) {
    let salesh: any = {};
    let loadingData = { isShow: false }
    this.webSocketService.getSalesDataByTableId({id: salesTable.salesId}, loadingData).subscribe(res => {
      if (res.success) {
        salesh = res.data.pos_salesh;
        let datas = this.tableService.addItemBySalesTable(salesTable, salesh);
        let me = this;
        me.webSocketService.sendObserveMessage("UPDATEDATA", datas).subscribe(function (retData) {
          if (retData && retData.success) {
            me.woShopService.clearToCartSilent(); // 清空购物车
            setTimeout(() => {
              me.http.showToast('加菜成功');
            }, 500);
            let salesData = { topName: '【加菜单】', salesH: datas.salesH, salesTable: datas.salesTable, salesDetailList: datas.salesDetail, };
            salesData = JSON.parse(JSON.stringify(salesData));
            // 'DY_JCD'
            me.printService.printSales(salesData, this.navCtrl, 'DY_JCD');
            me.navCtrl.popToRoot();
          }
        });
      }
    });
  }


  /**取单 */
  takeOrder(salesTable) {
    this.isTakeOrder = false;
    this.webSocketService.getSalesDataByTableId({id: salesTable.salesId,isUnRefresh: true}).subscribe(res => {
      if (res.success) {
        this.appShopping.salesTable = salesTable;

        this.appShopping.salesCampaignList = res.data.pos_salescampaign;
        this.appShopping.salesDetailList = res.data.pos_salesdetail;
        this.appShopping.salesh = res.data.pos_salesh;

        let custom: any = null;
        if (res.data.pos_salescusts && res.data.pos_salescusts.length > 0) {
          custom = res.data.pos_salescusts[0];
        }
        console.log(res);
        console.log(res);
        // console.log(this.appShopping.salesTable);
        this.navCtrl.push('TakeOrderPage', { custom: custom });
      }
    });
  }


  /**选择空桌
   * 挂单
   */
  checkedTabFan(tab) {
    this.checkedTab = tab;
    let con = [];
    if (true) {
      con.push(
        {
          text: '开台',
          handler: () => {
            this.selectManNubmer(tab);
          }
        }
      );
    }
    if (true) {
      con.push(
        {
          text: '留台',
          handler: () => {
            this.selectManNubmer(tab);
          }
        }
      );
    }
    con.push(
      {
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    );

    let actionSheet = this.actionSheetCtrl.create({
      buttons: con
    });

    actionSheet.present();


    // debugger
    // this.checkedTab = tab;
    // this.selectManNubmer(tab);
  }

  selectManNubmer(tab) {

    let modal = this.modalCtrl.create("ManNumberPage", { tab: tab, salesType: '', area: this.chackedArea, }, {
      cssClass: 'custom-modal2'
    });

    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.flag) {
        let manNumber = data.number;
        let teaAmt = data.teaAmt;
        let deposit = data.deposit;
        let remaker = data.remaker;
        this.openTab(manNumber, teaAmt,deposit,remaker);
      } else {
        return;
      }
    });
  }
  /**
 * 
 * @param manNumber 开台
 * @param teaAmt 
 */
  openTab(manNumber, teaAmt,deposit,remaker) {
    this.appShopping.salesTable = this.tableService.buildStayTable(this.checkedTab, manNumber, teaAmt,deposit,remaker)
    this.navCtrl.push(WoShopDetailPage, { isOpenTable: true });
  }
  /**
 * 
 * @param manNumber 留台
 * @param teaAmt 
 */
  stayTab(manNumber, teaAmt, deposit) {
    // let remaker=null,
    let datas = this.tableService.entryOrders(this.chackedArea, this.checkedTab, manNumber, this.appShopping.salesh, teaAmt, deposit);
    let me = this;
    me.webSocketService.sendObserveMessage("UPDATEDATA", datas).subscribe(function (retData) {
      if (retData && retData.success) {
        me.appShopping.salesTable = datas.salesTable;
        me.navCtrl.push(WoShopDetailPage);
      }
    })
  }


  /**挂单 */
  entryOrders(manNumber, teaAmt, deposit) {
    let datas = this.tableService.entryOrders(this.chackedArea, this.checkedTab, manNumber, this.appShopping.salesh, teaAmt, deposit);

    let me = this;
    me.webSocketService.sendObserveMessage("UPDATEDATA", datas).subscribe(function (retData) {
      if (retData && retData.success) {

        let salesData = { topName: '【点菜客户单】', salesH: me.appShopping.salesh, salesTable: datas.salesTable, salesDetailList: me.appShopping.salesDetailList, salesCampaign: datas.salesCampaign };
        salesData = JSON.parse(JSON.stringify(salesData));
        me.woShopService.clearToCartSilent(); // 清空购物车 
        me.navCtrl.popToRoot();
        // console.log('111111111111111111111111111111');
        me.printService.printSales(salesData, this.navCtrl, 'DY_GKD');
        // setTimeout(() => {
        salesData = JSON.parse(JSON.stringify(salesData));
        salesData.topName = '【台单】';
        me.printService.printSales(salesData, this.navCtrl, 'DY_TD');
        salesData = null;
        // }, 100);
        setTimeout(() => {
          me.http.showToast('下单成功！');
        }, 500);
        // me.navCtrl.setRoot("WoShopDetailPage", {}, { animate: true, direction: "forward" }); // 跳转到点菜页面
        // me.close();
        // me.navCtrl.popToRoot();
        // me.callback();
      }
    });
  }



  showHour(time: string) {
    return time.substring(11, 19);
  }
}
