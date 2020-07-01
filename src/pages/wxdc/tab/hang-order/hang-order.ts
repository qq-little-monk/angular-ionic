import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, Events, } from 'ionic-angular';
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
import { AppPermission } from '../../../../app/app.permission';

/**
 * Generated class for the HangOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hang-order',
  templateUrl: 'hang-order.html',
})
export class HangOrderPage {
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
    public appPer:AppPermission,
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
    console.log(this.appShopping.tableList);
    
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
    if (this.isTakeOrder) {
      if (tab.tmpSalesTableList.length > 1) {
        this.isShowTableDetail = true;
      } else {
        this.clickSalesTable(tab.tmpSalesTableList[0]);
      }

    } else {
      this.moreOperations(tab);
    }
  }
  moreOperations(tab) {
    let con = [];
    if (true) {
      con.push(
        {
          text: '加菜',
          handler: () => {
            // this.checkedTab = tab;
            // this.isShowTableDetail = true;
            if (tab.tmpSalesTableList.length > 1) {
              this.isShowTableDetail = true;
            } else {
              this.clickSalesTable(tab.tmpSalesTableList[0]);
            }

          }
        }
      );
    }
    if (this.appPer.staffPermission('6003')) {
      con.push(
        {
          text: '拼桌',
          handler: () => {
            this.utilProvider.getAlert({title:'确认拼桌！'}).subscribe(res => {
              if (res == 'yes') {
                this.selectManNubmer(this.checkedTab);
              }
            })
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
  }
  cancel() {
    this.isShowTableDetail = false;
  }
  clickSalesTable(salesTable) {
    if (this.isTakeOrder) {
      this.takeOrder(salesTable);
    } else {
      this.utilProvider.getAlert({title:'确认加菜！'}).subscribe(res => {
        if (res == 'yes') {
          this.addItemOfOrder(salesTable);
        }
      })
     
    }
  }
  /**加菜 */
  addItemOfOrder(salesTable) {
    let salesh: any = {};
    let loadingData = { isShow: false }
    this.webSocketService.getSalesDataByTableId({id: salesTable.salesId,isUnRefresh: true}, loadingData).subscribe(res => {
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
    this.webSocketService.getSalesDataByTableId({id: salesTable.salesId,isUnRefresh: true}).subscribe(res => {
      if (res.success) {
        this.appShopping.salesTable = salesTable;

        this.appShopping.salesCampaignList = res.data.pos_salescampaign;
        this.appShopping.salesDetailList = res.data.pos_salesdetail;
        this.appShopping.salesh = res.data.pos_salesh;
        this.appShopping.table = this.getTable(salesTable);

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
  getTable(salesTable){
    for (let ti = 0, tlen = this.appShopping.tableList.length; ti < tlen; ti++) {
      if (salesTable.tableId == this.appShopping.tableList[ti].id) {
        return this.appShopping.tableList[ti];
      }
    }
  }

  /**选择空桌
   * 挂单
   */
  checkedTabFan(tab) {
    // debugger
    this.checkedTab = tab;
    this.selectManNubmer(tab);
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
        let remark = data.remark;
        let deposit = data.deposit;
        // this.openTab(manNumber, teaAmt);
        this.entryOrders(manNumber, teaAmt, remark, deposit);
      } else {
        return;
      }
      // console.log(data)
    });
  }

  /**
   * 
   * @param manNumber 开桌
   * @param teaAmt 
   * @param deposit
   */
  openTab(manNumber, teaAmt,deposit) {
    let datas = this.tableService.entryOrders(this.chackedArea, this.checkedTab, manNumber, this.appShopping.salesh, teaAmt, deposit);
    let me = this;
    me.webSocketService.sendObserveMessage("UPDATEDATA", datas).subscribe(function (retData) {
      if (retData && retData.success) {
        me.appShopping.salesTable = datas.salesTable;
        me.navCtrl.push(WoShopDetailPage);
      }

    })
  }

  /** */
  entryOrders(manNumber, teaAmt, remark,deposit) {
    let me = this;
    var resultData = {
      tableData: this.checkedTab,
      optType: 'SHARE'
    };
    let datas = this.tableService.entryOrders(this.chackedArea, this.checkedTab, manNumber, this.appShopping.salesh, teaAmt, deposit, remark);
    datas['optType'] = 'SHARE';
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
