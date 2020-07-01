import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { WoShopService } from '../../../../service/wo.shop.service';
import { SalesCampaign } from '../../../../domain/sales-campaign';
import { UtilProvider } from '../../../../providers/util/util';
import { AppShopping } from '../../../../app/app.shopping';
import { SalesDetail } from '../../../../domain/salesDetail';
import { HttpProvider } from '../../../../providers/http';
import { AppPermission } from '../../../../app/app.permission';

/**
 * Generated class for the KeyboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-allPreferential',
  templateUrl: 'allPreferential.html',
})
/**整单优惠 */
export class AllPreferentialPage {
  str: string = '';
  discount: any = { number: '100', isClear: false };
  price: any = { number: '0', isClear: false };
  salesDetail: any;
  campaign: SalesCampaign;
  priceMap: any = { allSalesPrice: 0, allDisCountPrice: 0, allUndisCountPrice: 0 }
  // 活动类型 （1活动 2 赠送 3 自定义折扣 4 改价 5 会员优惠 （整单表示会员折扣，单品表示会员价） 6 套餐）
  campaignType: string = '3';
  //抹零金额预设
  budgetList: any = [];

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public woShopService: WoShopService,
    public utilProvider: UtilProvider,
    public appShopping: AppShopping,
    public http: HttpProvider,
    public appPer: AppPermission,
    public changeDetectorRef: ChangeDetectorRef,
    public navParams: NavParams) {
  }
  ionViewWillEnter() {
    this.priceMap = this.woShopService.getAllDiscountItemListpriceMap();
    // this.doLog('11111111111111111', true);
    this.getCampaignType();
    // this.doLog('7777777777777', true);
    this.changeDetectorRef.detectChanges();
    this.getBudgetList();
  }
  getBudgetList() {
    this.budgetList.length = 0;
    let price = String(this.priceMap.allSalesPrice);
    let number = 0;
    if (price.indexOf('.') > -1) {
      number = price.indexOf('.');
    } else {
      number = price.length;

    }
    //抹零、角
    let price1 = price.substring(0, number);
    this.budgetList.push(price1);
    let price2 = price.substring(0, number - 1) + '0';
    if (Number(price1) > 10 && Number(price1) > Number(price2)) {
      //抹零、元
      this.budgetList.push(price2);
    }
    let price3 = Number(price.substring(0, number - 2)) + '00';
    if (Number(price1) > 100&& Number(price2) > Number(price3)) {
      //抹零、10元
      this.budgetList.push(price3);
    }
  }
  doLog(flag, isShow: boolean = false) {
    if (!isShow) return;
    console.log(flag);
    console.log(this.discount);
    console.log(this.price);
    console.log(this.campaignType);
    console.log(this.campaignType == '3' ? '折扣' : '改价');

  }
  getCampaignType() {
    let campaign = this.woShopService.getAllCampaign();
    if (campaign && campaign.campaignType && campaign.campaignType == '3' || campaign.campaignType == '5') {//整单自定义折扣 会员折扣
      // this.doLog('2222222222222', true);
      this.campaignType = '3';
      this.discount.number = campaign.discountRule;
      this.discount.isClear = true;
    } else if (campaign.campaignType == '4') {//整单改价
      // this.doLog('333333333333333333', true);
      this.campaignType = '4';
      // this.price.number = this.utilProvider.accAdd(campaign.discountRule, this.priceMap.allUndisCountPrice);
      this.price.number = campaign.discountRule;
      this.price.isClear = true;
    } else {
      // this.doLog('444444444444444444', true);
      if (this.appPer.staffPermission('1503')) {//整单折扣权限
        // this.doLog('55555555555555555', true);
        this.campaignType = '3';
        // this.discount.isClear = true;
        this.discount.isClear = true;
      } else { //整单改价权限
        // this.doLog('6666666666666666', true);
        this.campaignType = '4';
        this.price.number = this.priceMap.allSalesPrice;
        this.price.isClear = true;
      }
    }
  }
  ionViewDidEnter() {

    // this.getOffsetTops();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad KeyboardPage');
  }

  close() {
    this.viewCtrl.dismiss(true);
  }
  setPrice(number){
    this.price.number=number;
    this.confirm();
  }
  confirm() {
    if (this.price.number > this.priceMap.allSalesPrice) {
      this.http.showToast('优惠金额不可大于原价金额！');
      return;
    }
    if (this.discount.number > 100) {
      this.http.showToast('折扣不可大于100！');
      return;
    }

    if (this.discount.number == '' || this.discount.number == null) {
      this.discount.number = 100;
    }
    if (this.campaignType == '3') {//打折
      if (this.discount.number < this.appShopping.staff.minDiscount) {
        this.http.showToast('权限不足');
        return;
      }
      let campaignData = {
        campaignName: '整单自定义折扣',
        campaignType: '3',
        discountRule: this.discount.number,
        discountType: '0',
      }
      this.woShopService.allDiscountSalescampaign(this.discount.number, campaignData);
      // this.woShopService.doLog();
    } else {//改价
      if (this.price.number < this.priceMap.unDiscountPrice) {
        this.http.showToast('改价金额不能小于不可优惠金额');
        return;
      }
      let campaignData = {
        campaignName: '整单改价',
        campaignType: '4',
        // discountRule: this.utilProvider.accSub(this.price.number, this.priceMap.allUndisCountPrice),
        discountRule: this.price.number,
        discountType: '0',
      }
      this.woShopService.allChangerMoneySalescampaign(this.price.number, campaignData);
      this.woShopService.doLog();
    }

    this.close();
  }



  /**改价商品优惠单头 */
  doOneChargeMoney(discountRule, salesDetail, totalDiscountRule?) {
    let campaignData = {
      campaignName: '改价',
      campaignType: '4',
      discountRule: totalDiscountRule ? totalDiscountRule : discountRule,
      discountType: '1',
    }

    this.woShopService.doOneChargeMoney(salesDetail, discountRule, campaignData);
  }

  changer(campaignType) {
    // this.campaignType = campaignType;
    // if (campaignType == '3') {
    //   this.discount.isClear = true;
    //   this.price.isClear = false;
    // } else {
    //   this.discount.isClear = false;
    //   this.price.isClear = true;
    // }
    // this.doLog('888888888888', true);
    if (campaignType == '3') {
      // this.doLog('9999999999999', true);
      if (!this.appPer.staffPermission('1503')) {
        this.http.showToast('无【整单折扣】权限');
        return;
      }
      this.campaignType = campaignType;
      this.discount.isClear = true;
      this.price.isClear = false;
      // this.doLog('10 10 10 10 10 10', true);
    } else {
      // this.doLog('11 11 11 11 11', true);
      if (!this.appPer.staffPermission('1504')) {
        this.http.showToast('无【整单改价】权限');
        // this.doLog('11 11 11 11 11', true);
        return;
      }

      this.campaignType = campaignType;
      this.discount.isClear = false;
      this.price.isClear = true;
      // this.doLog('12 12 12 12 12', true);
    }
    this.changeDetectorRef.detectChanges();
  }


  doDisCount() {
    let number = this.utilProvider.accMul(this.priceMap.allDisCountPrice, this.utilProvider.accDiv(this.discount.number, 100));
    number = this.utilProvider.accAdd(number, this.priceMap.allUndisCountPrice);
    this.price.number = number;
    return number;
  }

  doChargeMoney() {
    let discount = 0
    discount = this.utilProvider.accDiv(this.utilProvider.accSub(this.price.number, this.priceMap.allUndisCountPrice), this.priceMap.allDisCountPrice) * 100;
    this.discount.number = discount;
    return discount;
  }

  // /**单条商品销售总价 */
  // getSalesAmt(salesDetail: SalesDetail) {
  //   let price = 0;//总金额
  //   let DiscountPrice = 0;//可打折金额
  //   let unDiscountPrice = 0;//不可打折金额
  //   price = salesDetail.salesPrice;
  //   if (salesDetail.itemType == 'G') {
  //   } else {//规格商品需要加上加料商品价格
  //     let flag = false;
  //     if (this.woShopService.selectSpuBySpuId(salesDetail.spuId).isAdditionDiscount == '0')//配菜不可打折
  //     {
  //       flag = true;
  //     }
  //     this.appShopping.salesDetailList.forEach(com => {
  //       if (com.parentId == salesDetail.id) {
  //         price = this.utilProvider.accAdd(price, com.orgSalesPrice);
  //         if (flag) {
  //           unDiscountPrice = this.utilProvider.accAdd(unDiscountPrice, com.orgSalesPrice);
  //         }
  //         // salesDetail.salesAmt = price;
  //       }
  //     });
  //   }
  //   DiscountPrice = this.utilProvider.accSub(price, unDiscountPrice);
  //   let data = { price: price, discountPrice: DiscountPrice, unDiscountPrice: unDiscountPrice };
  //   return data;
  // }
  refresh() {
    this.changeDetectorRef.detectChanges();
  }
}
