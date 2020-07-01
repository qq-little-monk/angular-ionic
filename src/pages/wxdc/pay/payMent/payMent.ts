import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController, AlertController, Events, ViewController } from 'ionic-angular';
import { WoOrderService } from '../../../../service/wo.order.service';
import { WoShopService } from '../../../../service/wo.shop.service';
// import { payMent } from '../../../../model/payMent';
import { AppShopping } from '../../../../app/app.shopping';
import { UtilProvider } from '../../../../providers/util/util';
import { HelperService } from '../../../../providers/Helper';
import { WebSocketService } from '../../../../service/webSocketService';
import { HttpProvider } from '../../../../providers/http';
import { AppPermission } from '../../../../app/app.permission';
import { TableService } from '../../../../service/tableService';
import { SalesCusts } from '../../../../domain/sales-custs';
import { AppCache } from '../../../../app/app.cache';
import { PrintService } from '../../../../service/printService';
import { WoShopDetailPage } from '../../shop/wo-shop-detail/wo-shop-detail';
import { InputNumberKeyboardPage } from '../../../inputNumberKeyboard/inputNumberKeyboard';
import { Md5 } from 'ts-md5';


/**
 * Generated class for the WoOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payMent',
  templateUrl: 'payMent.html',
})


export class PayMentPage {
  priceMap = { allSalesPrice: 0, allDisCountPrice: 0, allUndisCountPrice: 0 };
  retalTotalMoney: number;
  totalQty: number;
  nav: any;
  payMentList: Array<any> = [];
  salesPayList: any[] = [];
  TotalOneCampaignPrice = 0;
  changePrice: number = 0;
  retailPrice: number = 0;

  isCanPop: boolean = false;
  isBack: boolean = true;
  resultData: any = {};
  modal: any;
  payOffInfo: any = {}; //优惠券编号

  barCode: string;//扫描后的信息
  payWay: any;
  payName: any;
  payNum: any;
  orderNo: any;
  updateOrderNo: any;

  constructor(public navCtrl: NavController,
    public orderSer: WoOrderService,
    public app: App,
    public woShopService: WoShopService,
    public appShopping: AppShopping,
    public utilProvider: UtilProvider,
    public modalCtrl: ModalController,
    public helper: HelperService,
    public webSocketService: WebSocketService,
    public http: HttpProvider,
    public appPer: AppPermission,
    public alertCtrl: AlertController,
    public events: Events,
    public tableService: TableService,
    public appCache: AppCache,
    public printService: PrintService,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }


  ngOnInit() {
    console.log(this.navCtrl.getActive());
    console.log(this.appShopping)
    //初始化localStorage
    for (let i in localStorage) {
      if (i !== 'QMAPI_2485_convertor') {
        localStorage.removeItem(i)
      }
    }

    this.payMentList = this.appShopping.payMentList;
    this.isBack = true;
    this.isCanPop = false;
    this.priceMap = this.woShopService.getAllDiscountItemListpriceMap();
    this.retalTotalMoney = this.woShopService.getRetalTotalMoney();
    this.totalQty = this.woShopService.getTotalNum();
    this.TotalOneCampaignPrice = this.getTotalOneCampaignPrice();
    this.payOffInfo = {
      couponInfo: { couponNo: null },
      isCustomerPayed: false
    };
    // console.log(this.priceMap);

    //监听订单更新事件 */
    // this.tableService.alertCtrlShow = false;
    // this.events.subscribe('order:refresh', (EventData) => {
    //   console.log('EventData');
    //   console.log('Welcome');
    //   this.isBack = false;
    //   this.isCanPop = true;
    //   if (this.modal) {
    //     this.modal.dismiss();
    //   }
    //   this.tableService.doConfirmByOrder(null, () => { this.navCtrl.popToRoot() });
    // });

    // //监听订单数据更新事件 */
    // this.tableService.alertCtrlShow = false;
    // this.events.subscribe('order:refresh-data', (EventData) => {
    //   this.isBack = false;
    //   this.isCanPop = true;
    //   if (this.modal) {
    //     this.modal.dismiss();
    //   }
    //   this.tableService.doConfirmByOrder(null, () => { this.navCtrl.popToRoot() });
    //   // this.tableService.doConfirmByData().subscribe(res => {
    //   //   if (res) {
    //   //     this.tableService.doConfirmByOrder();
    //   //   }
    //   // });
    // });


    // if (localStorage.getItem(this.payWay)) {
    //   this.isBack = false;
    // }
    // if (localStorage.getItem('isSm') == 'n') {
    //   let p: any = localStorage.getItem('orderNo');
    //   let salesPay = this.appShopping.salesPayList[p - 1]
    //   this.delToPayList(salesPay);
    //   localStorage.removeItem('orderNo');
    //   localStorage.removeItem('isSm');
    // }
  }

  ionViewDidLoad() {
    if (this.navParams.get('salesCust')) {
      // this.woShopService.checkedCustomer(this.navParams.get('salesCust'));
      this.appShopping.customer = this.navParams.get("customerInfo") || this.navParams.get('salesCust');
      this.appShopping.salesCusts = this.navParams.get('salesCust');
      console.log(this.navParams.get('salesCust'));

    }
    this.resultData = {
      salesTable: JSON.parse(JSON.stringify(this.appShopping.salesTable)),
      salesCampaignList: JSON.parse(JSON.stringify(this.appShopping.salesCampaignList)),
      salesDetailList: JSON.parse(JSON.stringify(this.appShopping.salesDetailList)),
      salesh: JSON.parse(JSON.stringify(this.appShopping.salesh)),
    };

  }

  ionViewWillEnter() {
    // console.log('11111111111111111');
    // console.log(this.resultData);
    this.payMentList = JSON.parse(JSON.stringify(this.appShopping.payMentList));
    this.isHavePayMent();
    // this.isBack = true;
    this.isCanPop = false;
    this.priceMap = this.woShopService.getAllDiscountItemListpriceMap();
    this.retalTotalMoney = this.woShopService.getRetalTotalMoney();
    this.totalQty = this.woShopService.getTotalNum();
    this.TotalOneCampaignPrice = this.getTotalOneCampaignPrice();
    this.payOffInfo = {
      couponInfo: { couponNo: null },
      isCustomerPayed: false
    };
    // // console.log(this.priceMap);

    //监听订单更新事件 */
    this.tableService.alertCtrlShow = false;
    this.events.subscribe('order:refresh', (EventData) => {
      console.log('EventData');
      console.log('Welcome');
      this.isBack = false;
      this.isCanPop = true;
      if (this.modal) {
        this.modal.dismiss();
      }
      this.tableService.doConfirmByOrder(null, () => { this.navCtrl.popToRoot() });
    });

    //监听订单数据更新事件 */
    this.tableService.alertCtrlShow = false;
    this.events.subscribe('order:refresh-data', (EventData) => {
      this.isBack = false;
      this.isCanPop = true;
      if (this.modal) {
        this.modal.dismiss();
      }
      this.tableService.doConfirmByOrder(null, () => { this.navCtrl.popToRoot() });
      // this.tableService.doConfirmByData().subscribe(res => {
      //   if (res) {
      //     this.tableService.doConfirmByOrder();
      //   }
      // });
    });


    // if(localStorage.getItem(this.payWay)){
    //   this.isBack = false;
    // }
    if (localStorage.getItem('isSm') == 'n') {
      let p: any = localStorage.getItem('orderNo');
      let salesPay = this.appShopping.salesPayList[p - 1]
      this.delToPayList(salesPay);
      localStorage.removeItem('orderNo');
      localStorage.removeItem('isSm');
    }
  }
  // /**取单 更新数据*/
  // takeOrder(salesTable) {
  //   this.webSocketService.getSalesDataByTableId(salesTable.salesId).subscribe(res => {
  //     if (res.success) {
  //       // this.appShopping.salesTable = res.data.pos_salesTable;
  //       this.appShopping.salesCampaignList = res.data.pos_salescampaign;
  //       this.appShopping.salesDetailList = res.data.pos_salesdetail;
  //       this.appShopping.salesh = res.data.pos_salesh;

  //       let custom: any = null;
  //       if (res.data.pos_salescusts && res.data.pos_salescusts.length > 0) {
  //         custom = res.data.pos_salescusts[0];
  //       }
  //       this.woShopService.getDetailList();

  //     }
  //   });
  // }
  ionViewWillLeave() {
    this.events.unsubscribe('order:refresh');
    this.events.unsubscribe('order:refresh-data');
  }
  // ionViewDidLeave() {
  //   if(this.isBack){
  //     console.log(999);

  //   }
  //   // this.events.unsubscribe('order:refresh');
  // }
  ionViewCanLeave() {
    if (!this.isCanPop && this.isBack) {
      let alertCtrl = this.alertCtrl.create({
        title: '放弃收款？',
        // message: res['data'].verDesc,
        cssClass: 'alert-log',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
              console.log('取消');
            }
          },
          {
            text: '确认',
            handler: () => {
              if (this.payOffInfo && this.payOffInfo.isCustomerPayed) {
                this.http.showToast("会员储值卡/赊账已支付成功,不允许终止收款");
                return;
              }
              for (let i in localStorage) {
                console.log(i);
                if (i !== 'length' && localStorage[i] == '1') {
                  this.http.showToast("已有支付成功的方式，不允许终止收款");
                  return;
                }
              }

              this.isCanPop = true;
              this.payOffInfo = {
                couponInfo: { couponNo: null },
                isCustomerPayed: false
              };
              if (this.appShopping.salesTable && this.appShopping.salesTable.salesId) {//取单
                // debugger
                this.appShopping.clearOdear();
                this.appShopping.salesTable = this.resultData.salesTable;
                this.appShopping.salesCampaignList = this.resultData.salesCampaignList;
                this.appShopping.salesDetailList = this.resultData.salesDetailList;
                this.appShopping.salesh = this.resultData.salesh;
                this.appShopping.table = this.getTable(this.appShopping.salesTable);
                var salesData = {
                  salesTable: this.appShopping.salesTable,
                  salesCampaignList: this.appShopping.salesCampaignList,
                  salesDetailList: this.appShopping.salesDetailList,
                  salesh: this.appShopping.salesh,
                  table: this.appShopping.table,
                };
                //通知前端把内存收银状态还原
                this.webSocketService.sendObserveMessage("UPDATEDDRDATA", salesData, { content: '正在返回', isShowing: false }).subscribe(function () { });
              } else {//直接结账
                this.woShopService.resutAllCampaign();
                this.woShopService.resultCustomer();
              }
              this.appShopping.salesPayList.length = 0;
              this.navCtrl.pop();
              // this.appShopping.clearOdear();
            }
          }
        ]
      });
      alertCtrl.present();

      return false;
      // console.log('22222222222222222222222222222222222222222222222222');
      // this.helper.alert('确认放弃收款？', '', () => {
      //   this.isCanPop = true;
      //   this.navCtrl.pop();
      //   // this.appShopping.clearOdear();
      //   this.woShopService.resutAllCampaign();
      // }, (err) => {
      //   // this.isCanPop = false;
      //   console.log(err);
      //   this.isCanPop = true;
      //   this.navCtrl.pop();
      //   this.woShopService.resutAllCampaign();
      //   return true;
      //   // return;
      // },);
      // // this.isCanPop = false;
      // // return;
      // return false;
    } else {
      this.isBack = true;
      return true;
    }
  }
  getTable(salesTable) {
    for (let ti = 0, tlen = this.appShopping.tableList.length; ti < tlen; ti++) {
      if (salesTable.tableId == this.appShopping.tableList[ti].id) {
        return this.appShopping.tableList[ti];
      }
    }
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

  selectCust() {
    if (this.isHasYHJPay()) return; //存在优惠券支付方式不允许选择会员
    // if(localStorage.getItem('WX'?'WX':'ZFB') == '1') return;//已经支付不允许选择会员
    for (let i in localStorage) {
      if (i !== 'length' && localStorage[i] == '1') {
        this.http.showToast("支付已开始,该功能不能使用！");
        return;
      };
    }
    this.isCanPop = true;
    this.isBack = false;
    if (this.appShopping.customer) {
      this.navCtrl.push('CustomerInfoPage', { customer: this.appShopping.customer })
    } else {
      this.navCtrl.push('CustomerSearchPage', { customer: this.appShopping.customer })

    }
  }

  //单优惠金额
  getTotalOneCampaignPrice() {
    let price = 0;
    this.appShopping.salesCampaignList.forEach(salesCampaign => {
      if (salesCampaign.discountType == '0' || salesCampaign.isDelete == '1') {
        return;
      }
      price = this.utilProvider.accAdd(price, salesCampaign.discountAmt);
    });
    return price;
  }

  //整单优惠金额
  getAllCampaignPrice() {
    let allCampaign = this.woShopService.getAllCampaign();
    let price = 0;
    if (allCampaign && allCampaign.id) {
      price = allCampaign.discountAmt;
    }
    return price;
  }
  /**应收收金额 */
  getAllSalesPrice() {
    let price = this.woShopService.getSalesTotalMoney();
    price = this.utilProvider.accAdd(price, this.appShopping.salesh.ttlTeaAmt); // 茶位费
    price = this.getMakeUpConsumeAmt(price); // 最低消费补齐金额
    price = this.getServerFeeAmt(price); // 服务费
    return price;
  }
  // 最低消费补齐金额
  getMakeUpConsumeAmt(salesAmt) {
    if (this.appShopping.table && this.appShopping.table.minConsumeAmt > 0) {
      let minConsumeAmt = this.appShopping.table.minConsumeAmt;
      this.appShopping.salesh['minConsumeAmt'] = minConsumeAmt;
      if (salesAmt < minConsumeAmt) {
        let makeUpConsumeAmt = this.utilProvider.accSub(minConsumeAmt, salesAmt);
        this.appShopping.salesh['makeUpConsumeAmt'] = makeUpConsumeAmt;
        salesAmt = minConsumeAmt;
      }
    }
    return salesAmt;
  }
  // 服务费
  getServerFeeAmt(salesAmt) {
    if (this.appShopping.table && this.appShopping.table.serverFeeAmt > 0) {
      let serverFeeAmt = this.appShopping.table.serverFeeAmt;
      let serverFeeType = this.appShopping.table.serverFeeType;
      this.appShopping.salesh['serverFeeType'] = serverFeeType;
      if (serverFeeType == 'R') {
        let serverFeeInfo = this.appPer.findByParamKey('serverFeeType');
        let computeAmt = this.retalTotalMoney;
        if (serverFeeInfo && serverFeeInfo.paramValue == '2') {
          computeAmt = this.woShopService.getSalesTotalMoney();
        }
        serverFeeAmt = this.utilProvider.accDiv(this.utilProvider.accMul(computeAmt, serverFeeAmt), 100);
      }
      this.appShopping.salesh['serverFeeAmt'] = serverFeeAmt;
      salesAmt = this.utilProvider.accAdd(salesAmt, serverFeeAmt);
    }
    return salesAmt;
  }
  /**还需收金额 */
  getReceivablePrice() {
    let price = this.getAllSalesPrice();
    if (this.appShopping.salesPayList.length > 0) {
      this.appShopping.salesPayList.forEach(salesPay => {
        price = this.utilProvider.accSub(price, salesPay.payAmt);
      });
    }
    if (price < 0) {
      price = 0;
    }
    // price = this.utilProvider.accAdd(price, this.appShopping.salesh.ttlTeaAmt);
    return price;
  }

  /**实收金额 */
  getRetailPrice() {
    let price = 0;
    if (this.appShopping.salesPayList.length > 0) {
      this.appShopping.salesPayList.forEach(salesPay => {
        price = this.utilProvider.accAdd(price, salesPay.payAmt);
      });
    }
    return price;
  }

  /**找零金额 */
  getChangePrice() {
    let price = 0;
    price = this.utilProvider.accSub(this.getRetailPrice(), this.getAllSalesPrice());
    // this.changePrice = price;
    if (price < 0) {
      price = 0;
    }
    return price;
  }
  delToPayList(salesPay) {
    // console.log(localStorage.getItem(salesPay.payCode));
    if (localStorage.getItem(salesPay.payCode) == '0' || localStorage.getItem(salesPay.payCode) == null) {
      this.appShopping.salesPayList = this.appShopping.salesPayList.filter(item => item.id != salesPay.id);
      localStorage.removeItem(salesPay.payCode);
    } else if (salesPay.payCode == 'RB') {
      this.appShopping.salesPayList = this.appShopping.salesPayList.filter(item => item.id != salesPay.id);
    } else {
      this.http.showToast("该支付已成功不可删除!");
    }

  }
  // 是否允许会员支付
  isAllowCustPay(payMent) {
    if (payMent.payCode === "AD" && (!this.appShopping.customer || !this.appShopping.customer.id || !this.appShopping.customer.custCode)) {
      this.http.showToast("请先选择会员!");
      return false;
    } else if (payMent.payCode === "SZ" && (!this.appShopping.customer || !this.appShopping.customer.id || !this.appShopping.customer.custCode)) {
      this.http.showToast("请先选择会员!");
      return false;
    } else if (payMent.payCode === "SZ" && this.appShopping.customer.chargeAccount == '0') {
      console.log(this.appShopping.customer);
      this.http.showToast("该会员没有赊账的权限！");
      return false;
    }
    return true;
  }
  // 是否允许自定义减免
  isREPay(payMent) {
    if (payMent.payCode === "RE" && !this.appPer.staffPermission('4016')) {
      this.http.showToast('无【自定义减免】权限');
      return false;
    }
    return true;
  }
  goToPayMentkeyboardPage(item) {
    let payMent = JSON.parse(JSON.stringify(item));
    var price = this.getReceivablePrice();
    var page = "PayMentkeyboardPage";
    if (!payMent) { this.http.showToast("传入支付信息有误!"); return; }
    if (!this.isAllowCustPay(payMent)) return;
    if (!this.isREPay(payMent)) return; //自定义减免无权限
    if (payMent.payCode === "YHJ") {
      //let ttlAmt = this.woShopService.getSalesTotalMoney();
      //this.woShopService.beforSubmitBuildData(this.retalTotalMoney, ttlAmt, 0, 0, false);
      page = "PayCouponQueryPage";  //查询优惠券页面
      //price = this.getAllSalesPrice();
    }
    // 现金支付,支付宝,微信
    if (payMent.payCode) {
      let modal = this.modalCtrl.create(page, {
        payMent: payMent, price: price + '', payOffInfo: this.payOffInfo, call: (parm) => {
          console.log(parm);
          this.payWay = parm.salesPay.payCode;
          this.payName = parm.salesPay.payName;
          this.payNum = parm.salesPay.payAmt;
          this.orderNo = parm.salesPay.lineNo;
          this.updateOrderNo = parm.tmpIsUpdateOrderNo;
          this.isBack = false;
          this.navCtrl.push(parm.page, { orderNo: this.orderNo, QRcallback: this.QRcallback });
        }
      }, {
        cssClass: 'custom-modal2'
      });
      this.modal = modal;
      modal.present();
      modal.onDidDismiss(res => {
        this.isHavePayMent();
        console.log(res);
      })
    }
  }

  QRcallback: (param: any) => Promise<any> = (params) => new Promise(resolve => {
    localStorage.removeItem('isSm');
    if (this.isNumber(params.code)) {
      this.callPayMent(params.code);
    } else {
      this.http.showToast('该二维码不是支付二维码，请重新扫描');
      let p: any = localStorage.getItem('orderNo');
      let salesPay = this.appShopping.salesPayList[p - 1]
      this.delToPayList(salesPay);
      localStorage.removeItem('orderNo');
      console.log(typeof (params.code));
    }

  });
  callPayMent(param) {
    this.isBack = false;
    localStorage.setItem(this.payWay, '1');
    let codePage = "QrCodePayPage";
    this.navCtrl.push(codePage, {
      qrcode: param,
      payWay: this.payWay,
      payName: this.payName,
      payNum: this.payNum,
      orderNo: this.orderNo,
      updateOrderNo: this.updateOrderNo,
      call: (p) => {
        let salesPay = this.appShopping.salesPayList[p - 1]
        this.delToPayList(salesPay);
        // this.isBack = true;
      }
    }).then(() => {
      const startIndex = this.navCtrl.getActive().index - 1;
      this.navCtrl.remove(startIndex, 0);
    });
  }

  goToAllPreferentialPage() {
    if (this.isHasYHJPay()) return; //存在优惠券支付方式不允许整单优惠
    // if(localStorage.getItem('WX'?'WX':'ZFB') == '1') return;
    for (let i in localStorage) {
      if (i !== 'length' && localStorage[i] == '1') {
        this.http.showToast("支付已开始,该功能不能使用！");
        return;
      };
    }//已经支付不允许整单优惠
    if (!this.appPer.staffPermission('1503') && !this.appPer.staffPermission('1504')) {
      this.http.showToast('无【整单优惠】权限');
      return;
    }
    // this.isBack=false;
    console.log(this.isBack);
    let modal = this.modalCtrl.create("AllPreferentialPage", { salesDetail: '' }, {
      cssClass: 'custom-modal2'
    });
    this.modal = modal;
    // 重置支付方式(非在线支付)
    this.modal.onDidDismiss(data => {
      if (data) { // 已经修改过优惠(只要操作了优惠就算修改，不管是否与原来优惠相同)
        this.salesPayList.length = 0;
        this.appShopping.salesPayList.length = 0;
      }
    });
    modal.present();
  }
  printPrestatement() {
    let me = this;
    // let salesTotalMoney = this.getAllSalesPrice();
    let price = this.woShopService.getSalesTotalMoney();
    // let salesCusts = this.buildSalesCusts(this.appShopping.customer);
    let salesCusts = this.appShopping.salesCusts;
    let data: any = {
      notifyType: "PRE_PRINT_PAYOFF",
      salesH: this.appShopping.salesh,
      salesDetail: this.appShopping.salesDetailList,
      salesCampaign: this.appShopping.salesCampaignList
    }
    if (salesCusts) {
      data.salesCusts = salesCusts;
    }
    if (this.appShopping.salesTable && this.appShopping.salesTable.id) {
      data['salesTable'] = this.appShopping.salesTable;
    }
    this.woShopService.beforSubmitBuildData(this.retalTotalMoney, price, 0, 0, false);
    me.webSocketService.sendObserveMessage("PRINTNOTIFY", data).subscribe(function (res) {
      if (res.success) me.http.showToast("发送成功！");
    });
    let salesData = {
      topName: '【预结单】', salesH: data.salesH, salesTable: data.salesTable, salesDetailList: data.salesDetail,
      salesCampaign: data.salesCampaign, customer: me.appShopping.customer,
    };
    salesData = JSON.parse(JSON.stringify(salesData));
    me.printService.printSales(salesData, this.navCtrl, 'DY_YJD');
    salesData = null;

  }
  // 最后结账逻辑
  doAccountsAfter() {
    let salesTotalMoney = this.getAllSalesPrice();
    let price = this.woShopService.getSalesTotalMoney();
    let retailPrice = this.getRetailPrice();

    let changePrice = this.getChangePrice();
    this.woShopService.beforSubmitBuildData(this.retalTotalMoney, price, retailPrice, changePrice, true);
    let salesCampaignList = JSON.parse(JSON.stringify(this.appShopping.salesCampaignList));
    let salesPayList = JSON.parse(JSON.stringify(this.appShopping.salesPayList));
    if (changePrice && changePrice > 0) {
      let payMent = this.getRBPayment(this.appShopping.payMentList);
      let changeSalesCampaign = this.woShopService.buildSalesPay(payMent, -changePrice, 1);
      salesPayList.push(changeSalesCampaign);``
    }
    // console.log('111111111111111111111111111111');
    // console.log(this.appShopping.salesh);
    let payInfo = '';
    // console.log('11111111111111');
    // console.log(this.appShopping.salesPayList);
    salesPayList.forEach(payMent => {
      if (!payInfo || payInfo.length == 0) {
        payInfo = payMent.payName + ':' + payMent.payAmt;
      } else {
        if (payMent.changeFlag == '1') {
          let money = -payMent.payAmt;
          payInfo = payInfo + ',' + '找零：' + money;
        } else {
          payInfo = payInfo + ',' + payMent.payName + ':' + payMent.payAmt;
        }

      }
    });
    this.appShopping.salesh.payInfo = payInfo;
    this.appShopping.salesh.salesTime = this.utilProvider.getNowTime();
    // let salesCusts = this.buildSalesCusts(this.appShopping.customer);
    let salesCusts = this.appShopping.salesCusts;
    // 销售/销售明细/销售优惠/销售支付
    let datas: any = {
      salesH: this.appShopping.salesh,
      salesDetail: this.appShopping.salesDetailList,
      salesCampaign: salesCampaignList,
      salesPay: salesPayList
    }
    console.log(datas);
    if (salesCusts) {
      datas.salesCusts = salesCusts;
    }
    if (this.appShopping.salesTable && this.appShopping.salesTable.id) {
      datas['salesTable'] = JSON.parse(JSON.stringify(this.appShopping.salesTable));
      datas['salesTable'].status = '1';
    }
    let me = this;
    //判断是否存在优惠券
    if (me.payOffInfo && me.payOffInfo.couponInfo.couponNo) {
      datas.payOffInfo = me.payOffInfo;
    }
    this.webSocketService.sendObserveMessage("UPDATEDATA", datas).subscribe(function (retData) {
      console.log(retData);
      var resultData = retData && retData.data && retData.data.payOffInfo;
      if (resultData) me.payOffInfo = resultData;
      if (retData && retData.success) {
        let salesData = {
          topName: '【结账单】', salesH: me.appShopping.salesh, salesTable: datas.salesTable, customer: me.appShopping.customer,
          salesDetailList: datas.salesDetail, salesCampaign: datas.salesCampaign, salesPayList: salesPayList
        };
        salesData = JSON.parse(JSON.stringify(salesData));
        me.woShopService.clearToCartSilent(); // 清空购物车
        me.isBack = false;
        me.isCanPop = true;
        setTimeout(() => {
          setTimeout(() => {
            me.http.showToast('收款成功！');
          }, 500);
          me.navCtrl.popToRoot();
        }, 300);
        // me.navCtrl.setRoot("WoShopDetailPage", {}, { animate: true, direction: "forward" }); // 跳转到点菜页面

        me.printService.printSales(salesData, this.navCtrl, 'DY_JZD');
        salesData = null;
      }
    });
  }
  // 进入结账流程
  doAccounts() {
    if (!this.appPer.staffPermission('1201')) {
      this.http.showToast('无【结账】权限');
      return;
    }
    let salesTotalMoney = this.getAllSalesPrice();
    let price = this.woShopService.getSalesTotalMoney();
    let retailPrice = this.getRetailPrice();
    if (this.appShopping.salesPayList.length == 0) {
      this.http.showToast("选择支付方式");
      return;
    }
    if (retailPrice < salesTotalMoney) {
      this.http.showToast("实收金额不能小于应收金额");
      return;
    }

    this.doCustInputPwd(() => {
      this.doAccountsAfter();
    });
  }
  // 输入会员密码
  doCustInputPwd(callback) {
    let isUseCustPay = false;
    this.appShopping.salesPayList.forEach(payData => {
      if (payData.payCode === "AD") {
        isUseCustPay = true;
      } else if (payData.payCode === 'SZ') {
        isUseCustPay = true;
      }
    });
    // 无会员支付
    if (!isUseCustPay) { callback && callback(true); return; }
    // 无密码
    if (!(this.appShopping && this.appShopping.customer &&
      this.appShopping.customer.password && 
      this.appShopping.customer.password.length > 1 && 
      Md5.hashStr(this.appShopping.customer.password) == 'd41d8cd98f00b204e9800998ecf8427e')) {
      callback && callback(true);
      return;
    }
    // 弹出密码输入框
    let modalNumPage = this.modalCtrl.create("InputNumberKeyboardPage", { number: { isClear: true, isPwd: true }, top: { title: '会员密码', placeHolder: '请输入会员密码!' } }, {
      cssClass: 'custom-modal2'
    });
    modalNumPage.present();
    modalNumPage.onDidDismiss(data => {
      //console.log(Md5.hashStr(data.data) + "__" + this.appShopping.customer.password);
      if (data && data.flag) {
        if (!(Md5.hashStr(data.data) == this.appShopping.customer.password)) this.http.showToast("密码错误!");
        else {
          callback && callback(true);
        }
      } else {
        this.http.showToast("请输入会员密码或密码错误!");
      }
    });
  }

  isHavePayMent() {
    this.payMentList.forEach(payMent => {
      payMent.disabled = false;
      for (let pay of this.appShopping.salesPayList) {
        if (payMent.id == pay.payId) {
          payMent.disabled = true;
        }
      }
    })
    // let payMent = item;

  }

  getRBPayment(list) {
    for (let payment of list) {
      if (payment.payCode == 'RB') {
        return payment;
      }
    }
  }

  isHasYHJPay() {
    var isEixtYHJPay = false;
    if (this.appShopping.salesPayList.length > 0) {
      this.appShopping.salesPayList.forEach(salesPay => {
        if (salesPay.payCode === "YHJ") isEixtYHJPay = true;
      });
    }
    if (isEixtYHJPay) {
      this.http.showToast("已选择优惠券抵扣,不允许改操作");
    }
    return isEixtYHJPay;
  }
  isNumber(str) {
    let num: any = Number(str);
    let flag = /^[0-9]*$/;
    if (flag.test(num)) {
      return true;
    } else {
      return false;
    }
  }
}
