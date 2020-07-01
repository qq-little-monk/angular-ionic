import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { WoShopService } from '../../../../service/wo.shop.service';
import { SalesCampaign } from '../../../../domain/sales-campaign';
import { UtilProvider } from '../../../../providers/util/util';
import { AppShopping } from '../../../../app/app.shopping';
import { SalesDetail } from '../../../../domain/salesDetail';
import { HttpProvider } from '../../../../providers/http';
import { SalesPay } from '../../../../domain/salesPay';
import { AppCache } from '../../../../app/app.cache';
import { timeInterval } from 'rxjs/operator/timeInterval';

/**
 * Generated class for the KeyboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payMentkeyboard',
  templateUrl: 'payMentkeyboard.html',
})
export class PayMentkeyboardPage {
  str: string = '';
  payPrice: any = { number: '0', isClear: true };
  salesDetail: any;
  campaign: SalesCampaign;
  priceMap: any = { price: 0, discountPrice: 0, unDiscountPrice: 0 };
  payMent: any;
  needPrice: number = 0;
  budgetList: any = [];
  barCode: string;//扫描后的信息
  payCodes: any;//支付方式
  callback:any;//回调函数
  payObj:Object;//


  // 活动类型 （1活动 2 赠送 3 自定义折扣 4 改价 5 会员优惠 （整单表示会员折扣，单品表示会员价） 6 套餐）
  campaignType: string = '3';

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public woShopService: WoShopService,
    public utilProvider: UtilProvider,
    public appShopping: AppShopping,
    public http: HttpProvider,
    public appCache: AppCache,
    public navParams: NavParams) {
    this.payPrice.isClear = true;
  }
  ionViewWillEnter() {
    this.needPrice = this.navParams.get('price');
    this.payPrice.number = this.needPrice;
    this.payMent = this.navParams.get('payMent');
    this.callback = this.navParams.get('call');
    if (this.payMent.payCode == "RB") {
      this.getBudgetList();
    }
    
  }


  getBudgetList() {
    this.budgetList.length = 0;
    let price = String(this.needPrice);
    let number = 0;
    if (price.indexOf('.') > -1) {
      number = price.indexOf('.');
    } else {
      number = price.length;
    }
    let unitsPrice = Number(price.substring(0, number));
    let priceLength = String(unitsPrice).length;
    let hundredsPlace = 0;
    if (priceLength <= 2) {
      if (this.utilProvider.accAdd(hundredsPlace, 10) >= unitsPrice) {
        this.budgetList.push(this.utilProvider.accAdd(hundredsPlace, 10));
      }
      if (this.utilProvider.accAdd(hundredsPlace, 50) >= unitsPrice) {
        this.budgetList.push(this.utilProvider.accAdd(hundredsPlace, 50));
      }
      if (this.utilProvider.accAdd(hundredsPlace, 100) >= unitsPrice) {
        this.budgetList.push(this.utilProvider.accAdd(hundredsPlace, 100));
      }
    } else {
      let str = price.substring(0, priceLength - 2);
      hundredsPlace = this.utilProvider.accMul(Number(str), 100, 0);
      if (this.utilProvider.accAdd(hundredsPlace, 10) >= unitsPrice) {
        this.budgetList.push(this.utilProvider.accAdd(hundredsPlace, 10));
      }
      if (this.utilProvider.accAdd(hundredsPlace, 50) >= unitsPrice) {
        this.budgetList.push(this.utilProvider.accAdd(hundredsPlace, 50));
      }
      if (this.utilProvider.accAdd(hundredsPlace, 100) >= unitsPrice) {
        this.budgetList.push(this.utilProvider.accAdd(hundredsPlace, 100));
      }
    }

  }
  getCampaignType() {

  }
  ionViewDidEnter() {

    // this.getOffsetTops();
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad KeyboardPage');
  }
  setPrice(price) {
    this.payPrice.number = price + '';
    this.payPrice.isClear = false;
    this.confirm();
  }
  close() {
    this.viewCtrl.dismiss();
  }
  foucouce() {
    this.payPrice.isClear = true;
  }
  confirm() {
    var smPage = "CommodityQrScanPage";
    let salesPay = this.woShopService.buildSalesPay(this.payMent, this.payPrice.number);
    // console.log(this.payMent.tmpIsUpdateOrderNO);
    if (!this.payPrice.number) {
      this.http.showToast('请输入支付金额');
      return;
    }
    if (this.payMent.payCode == 'RE') { // 自定义减免
      let maxReduceAmt = (this.appShopping.staff && this.appShopping.staff.maxReduceAmt) || 0;
      if (Number(this.payPrice.number) > Number(maxReduceAmt)) {
        this.http.showToast("支付金额不能大于员工最大减免金额【" + maxReduceAmt + "】");
        return;
      }
    }
    if (this.payMent.payCode == 'RB') {
    } else {
      if (this.utilProvider.checkDigital(this.payPrice.number) && Number(this.payPrice.number) <= 0) {
        this.http.showToast("支付金额必须大于零!");
        return;
      }
      if (Number(this.payPrice.number) > Number(this.needPrice)) {
        this.http.showToast('非现金支付不可大于还需收金额');
        this.payPrice.number = this.needPrice;
        return;
      }
    }
    if (this.payMent.payCode == 'ZFB' || this.payMent.payCode == 'WX' || this.payMent.payCode == 'SQB'||
        this.payMent.payCode == 'FY' || this.payMent.payCode == 'LFT' || this.payMent.payCode == 'LF'||
        this.payMent.payCode == 'SB' || this.payMent.payCode == 'XH' || this.payMent.payCode == 'NXH'||
        this.payMent.payCode == 'JL' || this.payMent.payCode == 'HD' || this.payMent.payCode == 'CJ'||
        this.payMent.payCode == 'TXY' || this.payMent.payCode == 'SXF' || this.payMent.payCode == 'LKL'||
        this.payMent.payCode == 'NLKL') {
          // console.log(this.payMent.tmpIsUpdateOrderNO);
          
          let data = {
            page: smPage,
            salesPay: salesPay,
            tmpIsUpdateOrderNo: this.payMent.tmpIsUpdateOrderNO
          }
          this.callback(data);  
    }

    this.appShopping.salesPayList.push(salesPay);
    this.payMent.isChecked = true;
    console.log(this.appShopping.salesPayList);
    this.close();
  }
}
