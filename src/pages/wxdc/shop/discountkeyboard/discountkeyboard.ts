import { Component } from '@angular/core';
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

// @IonicPage()
@Component({
  selector: 'page-discountkeyboard',
  templateUrl: 'discountkeyboard.html',
})
export class DiscountKeyboardPage {
  str: string = '';
  discount: any = { number: '100', isClear: false };
  price: any = { number: '100', isClear: false };
  salesDetail: any;
  campaign: SalesCampaign;
  priceMap: any = { price: 0, discountPrice: 0, unDiscountPrice: 0 }
  // 活动类型 （1活动 2 赠送 3 自定义折扣 4 改价 5 会员优惠 （整单表示会员折扣，单品表示会员价） 6 套餐）
  campaignType: string = '3';

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public woShopService: WoShopService,
    public utilProvider: UtilProvider,
    public appShopping: AppShopping,
    public http: HttpProvider,
    public appPer: AppPermission,
    public navParams: NavParams) {
  }
  ionViewWillEnter() {
    this.salesDetail = this.navParams.get('salesDetail');
    this.priceMap = this.woShopService.getOneSalesAmt(this.salesDetail);
    this.getCampaignType();
  }

  getCampaignType() {
    if (this.salesDetail.id) {//单品优惠
      this.campaign = this.woShopService.getOneCampaignBySalesId(this.salesDetail.id);
      if (this.campaign.campaignType == '3') {//单品折扣
        this.campaignType = '3';
        this.discount.isClear = true;
        this.discount.number = this.campaign.discountRule;
      } else if (this.campaign.campaignType == '4') {//单品改价
        this.campaignType = '4';
        this.price.isClear = true;
        this.price.number = this.utilProvider.accAdd(this.campaign.discountRule, this.priceMap.unDiscountPrice);
      }
      else if (this.campaign.campaignType == '2') {//赠送
        this.discount.number = 0;
        this.campaignType = '3';
        this.discount.isClear = true;
      } else {
        if (this.appPer.staffPermission('1502')) {//折扣权限
          this.campaignType = '3';
          this.discount.isClear = true;
        } else {//改价权限
          this.campaignType = '4';
          this.price.isClear = true;
          this.price.number = this.priceMap.price;

        }

      }
    }
  }
  ionViewDidEnter() {

    // this.getOffsetTops();
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad KeyboardPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  confirm() {
    if (this.discount.number == '' || this.discount.number == null) {
      this.discount.number = 100;
    }
    if (this.campaignType == '3') {//打折
      if (this.discount.number > 100 || this.discount.number < 0) {
        this.http.showToast('请输入0~100内折扣！');
        return;
      }
      if (this.discount.number == 100) {
        this.woShopService.resutOneCampaign(this.salesDetail,true);
        this.close();
        return;
      } else {
        if (this.discount.number < this.appShopping.staff.minDiscount) {
          this.http.showToast('权限不足！');
          return;
        }
        this.woShopService.doOneDiscounts(this.salesDetail, this.discount.number);
      }
    } else {//改价
      if (this.price.number > this.priceMap.price) {
        this.http.showToast('改价不可大于原价！');
        return;
      }
      if (this.price.number < 0) {
        this.http.showToast('改价不可小于0！');
        return;
      }
      if (this.price.number < this.priceMap.unDiscountPrice) {
        this.http.showToast('改价金额不能小于不可优惠金额');
        return;
      } else if (this.price.number == this.priceMap.price) {//还原
        this.woShopService.resutOneCampaign(this.salesDetail);
        this.close();
        return;
      }
      if (this.salesDetail.relatedType == 'M') {
        let list = this.woShopService.getGroupOrAdditionList(this.salesDetail).additionList;
        if (list.length > 0) {//有加料
          list.push(this.salesDetail);

          let discount = this.utilProvider.accDiv(this.price.number, this.priceMap.price);
          if (this.discount.number < this.appShopping.staff.minDiscount) {
            this.http.showToast('权限不足');
            return;
          }
          let discountPrice = this.price.number;
          // let alldiscount = 1;
          if (this.woShopService.isAdditionDiscount(this.salesDetail)) {//加料可优惠
            list.forEach(element => {
              let discountRule = 0;
              if (list[list.length - 1].id == element.id) {//最后一条分剩下的
                discountRule = discountPrice;
                // discountRule = this.utilProvider.accMul(element.retailPrice, alldiscount);
              } else {

                discountRule = this.utilProvider.accMul(element.retailPrice, discount);
                // alldiscount = this.utilProvider.accSub(alldiscount, discount);
                discountPrice = this.utilProvider.accSub(discountPrice, this.utilProvider.accMul(discountRule, element.salesQty));
              }
              if (this.salesDetail.id != element.id) {
                discountRule = this.utilProvider.accMul(discountRule, this.salesDetail.salesQty);
              }
              this.doOneChargeMoney(discountRule, element, this.price.number);//加料商品改价规则为主商品和加料商品总改价
            });
          } else {//加料不优惠
            let discountRule = this.utilProvider.accSub(this.price.number, this.priceMap.unDiscountPrice);
            // discountRule = this.utilProvider.accMul(discountRule, this.salesDetail.salesQty);
            this.doOneChargeMoney(discountRule, this.salesDetail);
          }

        } else {//没有加料
          this.doOneChargeMoney(this.price.number, this.salesDetail);
        }
      }

    }
    this.woShopService.doLog();
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
    this.woShopService.doLog();
  }

  changer(campaignType) {

    if (campaignType == '3') {
      if (!this.appPer.staffPermission('1502')) {
        this.http.showToast('无【打折】权限');
        return;
      }
      this.campaignType = campaignType;
      this.discount.isClear = true;
      this.price.isClear = false;
    } else {
      if (!this.appPer.staffPermission('1501')) {
        this.http.showToast('无【改价】权限');
        return;
      }
      this.campaignType = campaignType;
      this.discount.isClear = false;
      this.price.isClear = true;
    }
  }


  doDisCount() {
    let number = this.utilProvider.accMul(this.priceMap.discountPrice, this.utilProvider.accDiv(this.discount.number, 100, 4));
    number = this.utilProvider.accAdd(number, this.priceMap.unDiscountPrice);
    this.price.number = number;
    return number;
  }

  doChargeMoney() {
    let discount = 0
    discount = this.utilProvider.accDiv(this.utilProvider.accSub(this.price.number, this.priceMap.unDiscountPrice), this.priceMap.discountPrice) * 100;
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
}
