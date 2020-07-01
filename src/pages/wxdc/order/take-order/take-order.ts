import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, ActionSheetController, Events, Thumbnail, AlertController } from 'ionic-angular';
import { WoShopService } from '../../../../service/wo.shop.service';
import { AppShopping } from '../../../../app/app.shopping';
import { UtilProvider } from '../../../../providers/util/util';
import { HttpProvider } from '../../../../providers/http';
import { WebSocketService } from '../../../../service/webSocketService';
import { AppPermission } from '../../../../app/app.permission';
import { MobileMessageService } from '../../../../service/mobile/MobileMessageService';
import { TableService } from '../../../../service/tableService';
import { PrintService } from '../../../../service/printService';
import { SetSalesDetailNumberPage } from '../../shop/setSalesDetailNumber/setSalesDetailNumber';
import { AppCache } from '../../../../app/app.cache';
import { WoShopDetailPage } from '../../shop/wo-shop-detail/wo-shop-detail';


/**
 * Generated class for the WoPlaceOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-take-order',
  templateUrl: 'take-order.html',
})
export class TakeOrderPage {

  remark: string;
  salesDetailList: any[] = [];
  checkedSalesDetail: any = {};
  salesh: any = {};
  isBack: boolean = true;
  isShow: boolean = true;
  salesTable: any = {};
  custom: any;
  normalItemList: any = [];//正常商品
  returnItemList: any = [];//退品
  finishItemList: any = [];//完成上菜
  notRefresh: boolean = false;
  isReturnSuccess: boolean = true;
  actionSheet: any;
  profileModal: any;
  modal: any;
  isSendCancel: boolean = true;
  backDishesId: any;//退菜id
  // backDishesNumber: any;//退菜数量
  dishesNumber: any;//菜品数量
  testCheckboxOpen:any;
  testCheckboxResult:any;
  returnReasonList:any;//退菜原因
  testRadioOpen:boolean;
  testRadioResult:any;
  isAppear:boolean = false;//临时菜
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public app: App,
    public appShopping: AppShopping,
    public woShopService: WoShopService,
    public actionSheetCtrl: ActionSheetController,
    public utilProvider: UtilProvider,
    public http: HttpProvider,
    public webSocketService: WebSocketService,
    public appPer: AppPermission,
    public events: Events,
    public mobileMessageService: MobileMessageService,
    public tableService: TableService,
    public alertCtrl: AlertController,
    public shopSer: WoShopService,
    public appCache: AppCache,
    public printService: PrintService) {
  }
  ngOnInit(){
    // //获取退菜原因
    this.webSocketService.getReturnReason({}).subscribe(res=>{
      console.log(res);
      this.returnReasonList = res.data.data;
    })
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad WoPlaceOrderPage');
    this.woShopService.getDetailList();
    this.salesDetailList = JSON.parse(JSON.stringify(this.appShopping.salesDetailList));
    console.log('cscscscscsc');
    console.log(this.salesDetailList);
    this.getItemList(this.salesDetailList);
    this.salesh = this.appShopping.salesh;
    this.salesTable = this.appShopping.salesTable;
    // console.log(this.salesh);
    // console.log(this.salesTable);
  }
  ionViewWillEnter() {
    this.isBack = true;
    // this.this.salesh = this.appShopping.salesh;

    // console.log(this.navParams);

    this.custom = this.navParams.get('custom');

    //监听订单状态更新事件 */
    this.tableService.alertCtrlShow = false;
    this.events.subscribe('order:refresh', (EventData) => {
      // if (this.notRefresh) return;
      if (this.actionSheet) {
        this.actionSheet.dismiss();
      }
      if (this.profileModal) {
        this.profileModal.dismiss();
      }
      if (this.modal) {
        this.modal.dismiss();
      }
      this.tableService.doConfirmByOrder(null,()=>{this.navCtrl.popToRoot()});
    });
    //监听订单数据更新事件 */
    this.tableService.alertCtrlShow = false;
    this.events.subscribe('order:refresh-data', (EventData) => {
      if (this.notRefresh) return;
      this.tableService.doConfirmByData().subscribe(res => {
        if (res) {
          this.takeOrder(this.salesTable);
        }
      });
    });
    //监听餐桌强制占用事件
     this.tableService.alertCtrlShow = false;
     this.events.subscribe('order:hold-pop-view', (EventData) => {
        this.isSendCancel = false;
        //返回当前操作界面
        this.navCtrl.pop();
     });
    this.canvas();
  }
  getItemList(list) {
    this.normalItemList = [];//正常商品
    this.returnItemList = [];//退品
    this.finishItemList = [];//完成上菜

    list.forEach(salesDetail => {
      if (salesDetail.salesQty < 0) {
        this.returnItemList.push(salesDetail);
      } else if (salesDetail.isCrossoutDish && salesDetail.isCrossoutDish == 'Y') {
        this.finishItemList.push(salesDetail);
      } else {
        this.normalItemList.push(salesDetail);
      }
    });
    // console.log('normalItemList');
    // console.log(this.normalItemList);
    // console.log(this.returnItemList);
    // console.log(this.finishItemList);
 
  }
  canvas() {
    let cs: any = document.getElementsByTagName("canvas");
    let width = window.innerWidth;
    let heigth = window.innerHeight;
    for (let c of cs) {
      var cxt = c.getContext("2d");
      cxt.beginPath();
      cxt.moveTo(0, 10);
      cxt.style = 'red';
      cxt.lineTo(200, 30);
      cxt.strokeStyle = "red";  //红色的线
      cxt.lineWidth = "2";   //设置线宽
      // cxt.lineTo(10,50);
      cxt.stroke();
    }

  }


  
  /**取单 更新数据*/
  takeOrder(salesTable) {
    this.webSocketService.getSalesDataByTableId({id: salesTable.salesId,isUnRefresh: true}).subscribe(res => {
      if (res.success) {
        // this.appShopping.salesTable = res.data.pos_salesTable;
        console.log('111111111');
        console.log(res);
        this.appShopping.salesCampaignList = res.data.pos_salescampaign;
        this.appShopping.salesDetailList = res.data.pos_salesdetail;
        this.appShopping.salesh = res.data.pos_salesh;
        // this.appShopping.salesTable = res.data.pos_salesTable;

        let custom: any = null;
        if (res.data.pos_salescusts && res.data.pos_salescusts.length > 0) {
          custom = res.data.pos_salescusts[0];
        }
        this.woShopService.getDetailList();
        this.salesDetailList = JSON.parse(JSON.stringify(this.appShopping.salesDetailList));
        this.getItemList(this.salesDetailList);
        this.salesh = this.appShopping.salesh;
        this.salesTable = this.appShopping.salesTable;
        this.custom = custom;
      }
    });
  }
  ionViewCanLeave() {

  }
  ionViewWillLeave() {
    this.events.unsubscribe('order:refresh');
    this.events.unsubscribe('order:refresh-data');
    this.events.unsubscribe('order:hold-pop-view');
  }
  /**退出页面触发方法
   * 回退清除 取单数据
   */
  ionViewDidLeave() {
    var me = this;
    var salesData = {
      salesTable:this.appShopping.salesTable,
      salesh:this.appShopping.salesh,
    };
    if (this.appShopping.salesTable.salesId && this.isBack) {
      if(this.isSendCancel) me.webSocketService.sendObserveMessage("RETURNTABLEVIEW", salesData, { content: '正在返回...', isShowing: false }).subscribe(function () {});
      this.appShopping.clearOdear();
    }
    console.log('界面销毁');

  }
  //备注模态框
  toRemark() {
    let profileModal = this.modalCtrl.create('PlaceOrderRemarkPage', { remark: this.salesh.remark }, {
      cssClass: 'custom-modal2'
    });
    profileModal.onDidDismiss(data => {
      if (data && data.flag) {
        this.salesh.remark = data.remark;
      }
    });
    this.profileModal = profileModal;
    profileModal.present();
  }
  /**换桌 */
  changeOrderTabPage() {
    let profileModal = this.modalCtrl.create('ChangeOrderTabPage', { remark: this.salesh.remark }, {
      cssClass: 'custom-modal2'
    });
    profileModal.onDidDismiss(data => {
      if (data && data.flag) {
        this.salesh.remark = data.remark;
        let me = this;
        me.webSocketService.sendObserveMessage("CHANGETABLE", { salesId: this.appShopping.salesh.id, targetTableData: data.data }).subscribe(function (res) {
          if (res.success) {
            me.http.showToast("转台成功!");
            me.pop();
          }
        });
      }
    });
    this.profileModal = profileModal;
    profileModal.present();
  }

  pop() {
    this.app.getActiveNav().pop();
    // this.navCtrl.pop();
  }

  addItem() {
    // this.navCtrl.push('WoShopDetailPage');
    this.isBack = false;
    this.appShopping.salesDetailList.length = 0;
    this.appShopping.salesCampaignList.length = 0;
    if (this.appCache.rootPage == 'WoShopDetailPage') {
      this.navCtrl.popToRoot();
    } else {
      this.navCtrl.push(WoShopDetailPage, { isAddItem: true })
    }
    // this.mobileMessageService.csyx();
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
    //先更新数据 在跳转到结账界面
    this.isBack = false;
    this.webSocketService.getSalesDataByTableId({id: this.salesTable.salesId,isTheCashier: true}).subscribe(res => {
      if (res.success) {
        // this.appShopping.salesTable = res.data.pos_salesTable;
        this.appShopping.salesCampaignList = res.data.pos_salescampaign;
        this.appShopping.salesDetailList = res.data.pos_salesdetail;
        this.appShopping.salesh = res.data.pos_salesh;
        let custom: any = null;
        if (res.data.pos_salescusts && res.data.pos_salescusts.length > 0) {
          custom = res.data.pos_salescusts[0];
        }
        let customerInfo:any = null;  // 会员信息
        if(custom) {  // 使用订单存在会员信息
          this.webSocketService.sendObserveMessage("QUERYCUSTOMER", { flag: true, keyword: custom.custCode }).subscribe(retData => {
            if (retData.success) {
              if (retData.data && retData.data.length <= 0) { this.http.showToast("未查询到会员!"); }
              else {
                //this.customerList = retData.data;
                retData.data.forEach(customerData => {
                  if(customerData.custCode === custom.custCode) { // 查询到与当前销售会员数据相符的会员数据
                    customerInfo = customerData;
                  }
                });
              }
              this.navCtrl.push('PayMentPage', { salesCust: custom, customerInfo:customerInfo });
            }
          });
        } else {
          this.navCtrl.push('PayMentPage', { salesCust: custom });
        }
      }
    });

  }

  selectItem(salesDetail) {
    this.checkedSalesDetail = salesDetail;
  }

  /**退菜 */
  retreatFood(salesDetail) {
    if (!this.appPer.staffPermission('1003')) {
      this.http.showToast('无【退菜】权限');
      return;
    }
    let item = { number: this.utilProvider.accSub(salesDetail.salesQty, salesDetail.returnQty), isClear: true }
    let modal = this.modalCtrl.create(SetSalesDetailNumberPage, { salesDetail: salesDetail, item: item, isRetreatFood: true }, {
      cssClass: 'custom-modal2'
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.flag) {
        if (data.data > salesDetail.salesQty) {
          this.http.showToast('退菜不能大于菜品数量');
          return;
        } else if (this.utilProvider.accAdd(data.data, salesDetail.returnQty) > salesDetail.salesQty) {
          this.http.showToast('商品可退数量不足！');
          return;
        }
        this.backDishesId = salesDetail.id;
        this.dishesNumber = salesDetail.salesQty;
        salesDetail.returnReason = data.reason
        console.log(salesDetail);  
        this.doRetreatFood(salesDetail, data.data);
      } else {
        return;
      }
    });
  }
  /* 全部退菜 */
  retreatAllFood(salesDetail){
    let alert = this.alertCtrl.create();
    alert.setTitle('请选择退菜原因');
    for(let i = 0; i < this.returnReasonList.length;i++){
      alert.addInput({
        type: 'radio',
        label: this.returnReasonList[i].bizReason,
        value: this.returnReasonList[i].bizReason,
      });
    }
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
        salesDetail.returnReason = data;
        this.backDishesId = salesDetail.id;
        this.dishesNumber = salesDetail.salesQty;
        console.log(salesDetail);  
        this.doRetreatFood(salesDetail, salesDetail.salesQty);
      }
    });
    alert.present();
  }

  doRetreatFood(salesDetail, number) {
    var me = this;
    let data = {
      salesId: this.appShopping.salesh.id,
      salesDetailId: salesDetail.id,
      lastUpdateBy:this.appCache.store.userName + ':' + this.appShopping.staff.staffCode,
      returnQty: number
    }
    this.notRefresh = true;
    this.webSocketService.doRetreatFood(data).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.appShopping.salesh = res.data.salesH;
        this.salesh= this.appShopping.salesh;
        this.appShopping.salesDetailList = res.data.salesDetail;
        this.getItemList(this.appShopping.salesDetailList);
        this.appShopping.salesCampaignList = res.data.salesCampaign;
        this.appShopping.customer = res.data.salesCusts;
        this.ionViewWillEnter();
        // this.woShopService.doLog();
        this.http.showToast('退菜成功！');
        //判断退菜数量及删除菜品
        if(number == this.dishesNumber){
          for(var i = 0;i < this.salesDetailList.length;i++){
              let id = this.backDishesId;
              if(this.salesDetailList[i].id === id){
                  console.log(i);
                  this.salesDetailList.splice(i,1);
              }
          }
        }else{
          for(var j = 0;j < this.salesDetailList.length;j++){
            let id = this.backDishesId;
            if(this.salesDetailList[j].id === id){
              console.log(this.dishesNumber);
              console.log(number);
              this.salesDetailList[j].salesQty = this.dishesNumber-number
            }
          }
        }
        console.log(this.salesDetailList);
        salesDetail = JSON.parse(JSON.stringify(salesDetail));
        salesDetail.returnQty = number;
        let salesData = { topName: '【退菜单】', salesH: res.data.salesH, salesTable: this.appShopping.salesTable, salesDetailList: [salesDetail], };
        salesData = JSON.parse(JSON.stringify(salesData));
        this.printService.printSales(salesData, this.navCtrl, 'DY_TCD');
        setTimeout(() => {
          this.notRefresh = false;
        }, 500);
      } else {
        if(res.returnData && res.returnData.isTimeOut) {
          setTimeout(() => {
            this.http.showToast('请求超时,请取单查看是否已退菜',false,5000);
          }, 500);
          me.pop();
        }
        else this.http.showToast('退菜失败！');
        setTimeout(() => {
          this.notRefresh = false;
        }, 500);
      }

    }, err => {
      setTimeout(() => {
        this.notRefresh = false;
      }, 500);
    });

  }



  /* 单个催菜 */
  doPushFood(item) {
    // console.log(item);
    let list = [];
    list.push(item);
    let additionList = this.woShopService.getGroupOrAdditionList(item).additionList;
    let groupList = this.woShopService.getGroupOrAdditionList(item).groupList;
    let me = this;
    if (additionList.length > 0) {
      list = list.concat(list, additionList)
    }
    if (groupList.length > 0) {
      list = list.concat(list, groupList)
    }
    let data = {
      notifyType: "DISH_URGING",
      salesDetail: list,
      salesH: me.salesh,
      salesTable: me.appShopping.salesTable,
    }
    me.webSocketService.sendObserveMessage("PRINTNOTIFY", data).subscribe(function (res) {
      if (res.success) {
        me.http.showToast("催菜成功！");
        item.isWaitingDish = 'N';
      }
    });
  }

  /**整单催菜 */
  doAllPushFood() {
    let list = [];
    this.salesDetailList.map(item => {
      // if (item.isWaitingDish == 'Y') {
        list.push(item);
      // }
    });
    console.log(list);
    let me = this;
    let data = {
      notifyType: "WHOLE_URGING",
      salesDetail: list,
      salesH: me.salesh,
      salesTable: me.appShopping.salesTable,
    }
    me.webSocketService.sendObserveMessage("PRINTNOTIFY", data).subscribe(function (res) {
      if (res.success) {
        me.http.showToast("催菜成功！");
        list.map(item => item.isWaitingDish = 'N');
      }
    });
  }

    
  /* 单个叫起 */
  callSingleFood(salesDetail){
    console.log(salesDetail);
    let list = [];
    list.push(salesDetail);
    let additionList = this.woShopService.getGroupOrAdditionList(salesDetail).additionList;
    let groupList = this.woShopService.getGroupOrAdditionList(salesDetail).groupList;
    let me = this;
    if (additionList.length > 0) {
      list = list.concat(list, additionList)
    }
    if (groupList.length > 0) {
      list = list.concat(list, groupList)
    }
    let data = {
      notifyType: "DISH_SERVING",
      salesDetail: list,
      salesH: me.salesh,
      salesTable: me.appShopping.salesTable,
    }
    me.webSocketService.sendObserveMessage("PRINTNOTIFY", data).subscribe(function (res) {
      if (res.success) {
        me.http.showToast("叫起成功！");
        salesDetail.isWaitingDish = 'N';
        console.log(res)
      }
    });
    // console.log('我是单个叫起');
  }
  /* 整单叫起 */
  callAllFood(){
    let list = [];
    this.salesDetailList.map(item => {
      list.push(item);
    })
    console.log(this.salesDetailList);
    let me = this;
    let data = {
      notifyType: "WHOLE_SERVING",
      salesDetail: list,
      salesH: me.salesh,
      salesTable: me.appShopping.salesTable
    }
    me.webSocketService.sendObserveMessage("PRINTNOTIFY",data).subscribe(function(res){
      if(res.success){
        console.log(res);
        me.http.showToast("叫起成功！");
        list.map(item => item.isWaitingDish = 'N');
      }
    })
    console.log('我是整单叫起');
  }

  selectOperation() {
    let me = this;
    let con = [];
    if (true) {
      con.push({
        text: '撤台', handler: () => {
          if (!this.appPer.staffPermission('6001')) {
            this.http.showToast('无【撤台】权限');
            return;
          }
          let alert = this.alertCtrl.create({
            title: '确认撤台!',
            // message: '该订单状态发生改变',
            // enableBackdropDismiss: false,
            buttons: [
              {
                text: '取消',
              },
              {
                text: '确定',
                handler: () => {
                  let salesId = me.appShopping.salesh.id || this.salesTable.salesId; //
                  me.webSocketService.sendObserveMessage("CANCELTABLE", { salesId: salesId, salesTable: this.salesTable }).subscribe(function (res) {
                    if (res.success) {
                      me.http.showToast("撤台成功!");
                      me.navCtrl.pop();
                    }
                  });
                }
              },
            ]
          });
          alert.present();

        }
      });
    }

    if (true) {
      con.push(
        {
          text: '改台',
          handler: () => {
            this.editSalesTable(this.appShopping.salesTable);
          }
        }
      );
    }
    // if (true) {
    //   con.push(
    //     {
    //       text: '转菜',
    //       handler: () => {

    //       }
    //     }
    //   );
    // }
    // if (true) {
    //   con.push(
    //     {
    //       text: '拼桌',
    //       handler: () => {

    //       }
    //     }
    //   );
    // }
    if (true) {
      con.push(
        {
          text: '转台',
          handler: () => {
            this.changeOrderTabPage();
          }
        }
      );
    }
    // if (true) {
    //   con.push(
    //     {
    //       text: '合桌',
    //       handler: () => {

    //       }
    //     }
    //   );
    // }
    if(true){
      con.push(
        {
          text: '整单叫起',
          handler: ()=>{
            console.log('我是整单叫起');
            this.callAllFood();
          }
        }
      )
    }
    if (true) {
      con.push(
        {
          text: '整单催菜',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: '确认整单催菜!',
              // message: '该订单状态发生改变',
              // enableBackdropDismiss: false,
              buttons: [
                {
                  text: '取消',
                },
                {
                  text: '确定',
                  handler: () => {
                    this.doAllPushFood();
                  }
                },
              ]
            });
            alert.present();
          }
        }
      );
    }
    /*if (true) {
      con.push(
        {
          text: '临时菜',
          handler: () => {
            this.isAppear = true;
          }
        }
      );
    }*/
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
    this.actionSheet = actionSheet;
    actionSheet.present();
  }

  editSalesTable(salesTable) {
    let modal = this.modalCtrl.create("ManNumberPage", { tab: salesTable, salesType: '' }, {
      cssClass: 'custom-modal2'
    });
    this.modal = modal;
    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.flag) {
        let manNumber = data.number;
        let teaAmt = data.teaAmt;
        let remark = data.remark;
        let tmpSalesTable = JSON.parse(JSON.stringify(this.appShopping.salesTable));
        let tmpSalesh = JSON.parse(JSON.stringify(this.appShopping.salesh));
        tmpSalesTable.personNum = manNumber;
        tmpSalesTable.teaAmt = teaAmt;
        tmpSalesTable.remark = remark;
        tmpSalesTable.ttlTeaAmt = this.utilProvider.accMul(manNumber, teaAmt);
        tmpSalesh.personNum = manNumber;
        tmpSalesh.ttlTeaAmt = this.utilProvider.accMul(manNumber, teaAmt);

        let me = this;
        me.notRefresh = true;
        me.webSocketService.sendObserveMessage("UPDATEDATA", { salesTable: tmpSalesTable, salesH: tmpSalesh, isAlterTable: true }).subscribe(function (retData) {
          if (retData && retData.success) {
            me.http.showToast('改台成功！');
            me.appShopping.salesTable = tmpSalesTable;
            me.appShopping.salesh = tmpSalesh;
            me.salesh = tmpSalesh;
            console.log(tmpSalesTable);
          }
          setTimeout(() => {
            me.notRefresh = false;
          }, 500);
        }, err => {
          setTimeout(() => {
            this.notRefresh = false;
          }, 500);
        });
      } else {
        return;
      }
    });
  }

  /**优惠方式 */
  preferentialType(salesDetail) {
    let Component = this.woShopService.getOneCampaignBySalesId(salesDetail.id)
    if (Component && Component.id) {
      if (Component.campaignType == '2') {
        return '赠';
      } else if (Component.campaignType == '3') {
        return '折';
      } else if (Component.campaignType == '4') {
        return '改';
      } else if (Component.campaignType == '5') {
        // let grade: any = {};
        // this.appShopping.custGradeList.forEach(gra => {
        //   if (gra.id == this.custom.gradeId) {
        //     grade = gra;
        //   }
        // });
        // if (grade.discountType == '1' || grade.discountType == '2' || grade.discountType == '3' || grade.discountType == '4' || grade.discountType == '5') {
        //   return 'V' + grade.discountType;
        // } else {
        //   return false
        // }
        if (this.custom && this.custom.id && this.custom.isDelet != "1") {
          return 'V' + this.custom.discountType;
        } else {
          return false;
        }
      }

    } else {
      return false
    }
  }

  toCancel(e){
    this.isAppear = e;
  }

}
