import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { WoShopService } from '../../../../service/wo.shop.service';
import { UtilProvider } from '../../../../providers/util/util';
import { AppShopping } from '../../../../app/app.shopping';
import { HttpProvider } from '../../../../providers/http';
import { AppPermission } from '../../../../app/app.permission';
import { WebSocketService } from '../../../../service/webSocketService';

/**
 * Generated class for the KeyboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payCouponQuery',
  templateUrl: 'payCouponQuery.html',
})
/**整单优惠 */
export class PayCouponQueryPage {
  coupon: any = { number: '0', isClear: true };
  needPrice: number = 0;
  couponList: any = [];
  payMent: any;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public woShopService: WoShopService,
    public utilProvider: UtilProvider,
    public appShopping: AppShopping,
    public http: HttpProvider,
    public navParams: NavParams,
    public webSocketService: WebSocketService) {
    this.coupon.isClear = true;
  }
  ionViewWillEnter() {
    this.needPrice = this.navParams.get('price');
    this.payMent = this.navParams.get('payMent');
  }
  selectCoupon(coupon){
    var me = this;
    let salesCampaignList = JSON.parse(JSON.stringify(this.appShopping.salesCampaignList));
    let salesData: any = {
      salesH: this.appShopping.salesh,
      salesDetail: this.appShopping.salesDetailList,
      salesCampaign: salesCampaignList,
      salesCusts: this.appShopping.salesCusts
    }
    console.log("开始获取优惠券抵扣价:" + this.utilProvider.getNowTime("yyyy-MM-dd HH:mm:ss"));
    me.webSocketService.sendObserveMessage("GETCOUPONAMT", {couponData: coupon,salesData: salesData,needPrice: this.needPrice}, { content: '正在获取优惠券抵扣金额', isShowing: false }).subscribe(function (res) {
      console.log("获取优惠券抵扣价返回:" + me.utilProvider.getNowTime("yyyy-MM-dd HH:mm:ss"));
      if(res && res.success && res.data && res.data.resultData){
        var resultData = res.data.resultData
        var remainAmt = me.needPrice > resultData.resultAmt?resultData.resultAmt:me.needPrice;
        me.utilProvider.getAlert({title:resultData.maxDeductionAmt?('优惠券最多抵扣:' + resultData.maxDeductionAmt + "元,本次抵扣:" + remainAmt + "元,是否确认使用？"):("本次抵扣:" + remainAmt + "元,是否确认使用？")}).subscribe(res => {
          if (res == 'yes') {
            coupon.isChecked = true;
            coupon.payAmt = remainAmt;
          }
        })
      }else{
        me.http.showToast((res && res.data) || "操作失败");
      }
    })
  }
  close() {
    this.viewCtrl.dismiss();
  }
  foucouce() {
    this.coupon.isClear = true;
  }
  queryCouponAmt(){
    var me = this;
    me.couponList.length = 0;
    var salesCusts = this.appShopping.salesCusts;
    console.log("开始查询优惠券:" + this.utilProvider.getNowTime("yyyy-MM-dd HH:mm:ss"));
    me.webSocketService.sendObserveMessage("QUERYCOUPON", {couponNo: this.coupon.number,salesCusts:salesCusts}, { content: '正在查询优惠券', isShowing: false }).subscribe(function (res) {
    console.log("查询优惠券返回:" + me.utilProvider.getNowTime("yyyy-MM-dd HH:mm:ss"));
      if (res && res.success && res.data && res.data.couponData) {
        var couponData = res.data.couponData;
        me.coupon.storeSysCode = couponData.storeSysCode;
        me.couponList.push(couponData);
      }else{
        me.http.showToast((res && res.data) || "优惠券查询失败");
      }
    });
  }
  isHaveCoupon(coupon) {
    //暂时考虑一份
    if(coupon.isChecked ) return true;
    return false;
  }
  confirm() {
    var me = this;
    var isSelectedCoupon = false;
    me.couponList.forEach(couponData => {
      if(couponData.isChecked){
        let salesPay = me.woShopService.buildSalesPay(me.payMent, couponData.payAmt);
        me.appShopping.salesPayList.push(salesPay);
        me.payMent.isChecked = true;
        //考虑单个券
        var payOffInfo = me.navParams.get('payOffInfo');
        payOffInfo.couponInfo.couponNo = me.coupon.number;
        payOffInfo.couponInfo.couponStoreSysCode = me.coupon.storeSysCode;
        isSelectedCoupon = true;
      }
    });
    if(isSelectedCoupon) me.close();
    else me.http.showToast("未选择优惠券");
  }
}
