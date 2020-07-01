import { Injectable } from '@angular/core';
import { AppShopping } from '../app/app.shopping';
import { UtilProvider } from '../providers/util/util';
import { SalesDetail } from "../domain/salesDetail";
import { AppCache } from '../app/app.cache';
import { SalesCampaign } from '../domain/sales-campaign';
import { HttpProvider } from '../providers/http';
import { HelperService } from '../providers/Helper';
import { SalesDetailDao } from '../dao/salesDeailDao';
import { SalesPay } from '../domain/salesPay';
import { LogService } from './logService';
import { Events, App } from 'ionic-angular';
import { AppPermission } from '../app/app.permission';
import { SalesCusts } from '../domain/sales-custs';
// import { ShopCarService } from './shopCar.service';
import { WoShopService } from './wo.shop.service';


/*
  Generated class for the WoShopProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
/**
 * 
 * 重构优惠服务
 * 新加，单品优惠后价，单品优惠合计价，整单优惠后价，整单优惠后合计价
 * 
 */
export class SalesCampaignService {
  public shopInfo: any = {};  //商店信息
  public diners: any = {
    dinersNum: 1,
  }

  constructor(public salesDetailDao: SalesDetailDao,
    public appShopping: AppShopping,
    public utilProvider: UtilProvider,
    public appCache: AppCache,
    public http: HttpProvider,
    public helper: HelperService,
    public events: Events,
    public appPer: AppPermission,
    public app: App,
    public woShopService: WoShopService,
    // public shopCarService: ShopCarService,
    public logService: LogService,
  ) {
    // this.appCache.store = Store;
    this.appShopping.handoverh = this.appShopping.handoverhList[0];

  }


  /**优惠相关
   * 特价
   * 会员
   * 单品
   * 整单折扣
   */

  /**商品是否参与打折
    * isResut 是否刷新
    */
  isSalesDetailDiscount(salesDetail, isResut: boolean = false) {
    let flag = '0';
    if (!salesDetail) {
      return;
    }
    if (salesDetail && salesDetail.tmpIsDiscount && !isResut) {
      flag = salesDetail.tmpIsDiscount;
    } else if (salesDetail && salesDetail.relatedType == 'M' && this.woShopService.selectSpuBySpuId(salesDetail.spuId) && this.woShopService.selectSpuBySpuId(salesDetail.spuId).isDiscount == '1') {
      flag = '1';
    } else if (salesDetail && salesDetail.relatedType == 'G') {//套餐明细

    } else if (salesDetail && salesDetail.relatedType == 'A' && this.woShopService.selectSpuBySpuId(salesDetail.parentSpuId) && this.woShopService.selectSpuBySpuId(salesDetail.parentSpuId).isAdditionDiscount == '1') {//加料明细
      flag = '1'
    }
    salesDetail['tmpIsDiscount'] = flag;
    return flag == '1' ? true : false;
  }

  /**配料是否参与打折
   * salesDetail 主商品
   * isResut 是否刷新
   */
  isAdditionDiscount(salesDetail, isResut: boolean = false) {
    let flag = '0';
    if (salesDetail.tmpIsAdditionDiscount && !isResut) {
      flag = salesDetail.tmpIsAdditionDiscount;
    } else if (salesDetail.relatedType == 'M' && this.woShopService.selectSpuBySpuId(salesDetail.spuId) && this.woShopService.selectSpuBySpuId(salesDetail.spuId).isAdditionDiscount == '1') {
      flag = '1';
    }
    salesDetail.tmpIsAdditionDiscount = flag;
    return flag == '1' ? true : false;
  }


  /**判断商品是否可以执行优惠 */
  isDiscount(salesDetail) {
    if (salesDetail.parentId) {//加料明细，套餐明细先不管
      return false;
    }
    let spu = this.woShopService.selectSpuBySpuId(salesDetail.spuId);
    // console.log(spu);
    if (spu && spu['isDiscount'] == '1') {
      return true;
    } else {
      return false;
    }
  }
  /**判断商品是否是套餐明细*/
  isGrupuCom(salesDetail) {
    if (salesDetail.parentId && salesDetail.itemType != 'A') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 选择会员
   * 
   */
  checkedCustomer(customer) {
    this.appShopping.customer = customer;
    this.appShopping.salesCusts = this.buildSalesCusts(customer);
    this.allCustomerDiscounts();
  }
  buildSalesCusts(customer) {
    if (!customer || !customer.id) {
      return
    }
    let salesCusts = new SalesCusts();
    if (this.appShopping.salesCusts && this.appShopping.salesCusts.id) {
      salesCusts.id = this.appShopping.salesCusts.id
    } else {
      salesCusts.id = this.appShopping.salesh.id;
    }
    salesCusts.channel = 'MB';
    salesCusts.custAddr = customer.addr;
    salesCusts.custCode = customer.custCode;
    salesCusts.custId = customer.id;
    salesCusts.custName = customer.custName;
    salesCusts.custPhone = customer.custMobile || null;
    salesCusts.custSysCode = customer.custSysCode;
    salesCusts.storeId = this.appCache.store.id;
    salesCusts.storeName = this.appCache.store.storeName;
    salesCusts.storeSysCode = this.appCache.store.storeSysCode;
    salesCusts.balance = customer.ttlRecharge || 0;
    salesCusts.beforeTTLPoint = customer.ttlPoints;
    salesCusts.birthDay = customer.birthDay;
    salesCusts.discountRate = customer.discountRate;
    salesCusts.discountType = customer.discountType;
    salesCusts.discountTypeName = customer.discountTypeName;
    salesCusts.gradeCode = customer.gradeCode;
    salesCusts.gradeId = customer.gradeId;
    salesCusts.gradeName = customer.gradeName;
    salesCusts.handoverDate = this.appShopping.handoverh.handoverDate;
    salesCusts.handoverId = this.appShopping.handoverh.id;
    salesCusts.isPoint = customer.isPoint;
    salesCusts.custStoreId = customer.storeId;
    salesCusts.custStoreName = customer.storeName;
    salesCusts.custStoreSysCode = customer.storeSysCode;
    salesCusts.isDelete = '0';
    return salesCusts;
  }

  /**购物车所有商品会员优惠 */
  allCustomerDiscounts() {
    let list = this.appShopping.salesCampaignList;
    let salesDetailList = this.appShopping.salesDetailList;
    salesDetailList.forEach(salesDetail => {
      this.doOneCustomerDiscounts(salesDetail);
    });

  }


  /**单个商品执行会员优惠 */
  doOneCustomerDiscounts(salesDetail) {
    let list = this.appShopping.salesCampaignList;
    if (this.appShopping.customer) {//执行会员优惠
      if (this.appShopping.customer.discountType == '0') {//不优惠
        return;

      } else if (this.appShopping.customer.discountType == '1' || this.appShopping.customer.discountType == '2' || this.appShopping.customer.discountType == '3'
        || this.appShopping.customer.discountType == '4' || this.appShopping.customer.discountType == '5') {//会员价1,2,3,4,5
        if (this.getAllCampaign().campaignType == '5') {
          this.resutAllCampaign();
        }

        if (this.isSalesDetailDiscount(salesDetail) && salesDetail.relatedType == 'M') {
          let oneCampaign = this.getOneCampaignBySalesId(salesDetail.id)
          if (oneCampaign && (oneCampaign.campaignType == '3' || oneCampaign.campaignType == '4' || oneCampaign.campaignType == '2')) {
            return;
          }
          let sku = this.woShopService.selectSkuBySkuId(salesDetail.itemId);
          let vipString = 'vipPrice' + this.appShopping.customer.discountType;

          let vipPrice = sku[vipString] ? sku[vipString] : salesDetail.orgSalesPrice;
          vipPrice = this.utilProvider.accMul(vipPrice, this.appShopping.discount / 100);

          salesDetail.vipPrice = vipPrice;
          let campaignData = {
            campaignName: '会员价',
            campaignType: '5',
            discountRule: vipPrice,
            discountType: '1',
          }

          this.doOneChargeMoney(salesDetail, vipPrice, campaignData);
          // salesDetail.salesPrice = vipPrice;
          // this.shareGrupuCom(salesDetail);
        }
      } else if (this.appShopping.customer.discountType == '99') {//会员折扣
        this.appShopping.discount = this.appShopping.customer.discountRate;
        // this.allDiscounts();
        let campaignData = {
          campaignName: '会员折扣',
          campaignType: '5',
          discountRule: this.appShopping.discount,
          discountType: '0',
        }

        this.allDiscountSalescampaign(campaignData.discountRule, campaignData);
        // this.addOrEiditSalesAllCampaign(campaignData);
      }

    } else {//取消会员优惠

    }
  }
  // /**购物车商品执行'整单折扣'优惠 */
  // allDiscounts() {
  //   this.appShopping.salesDetailList.forEach(salesDetail => {
  //     if (this.isDiscount(salesDetail)) {
  //       this.doOneDiscounts(salesDetail, this.appShopping.discount, true);

  //     }

  //   });
  // }
  /**执行'单品折扣'优惠
   * @isAll 是否整单折扣
   */
  doOneDiscounts(salesDetail, discount, isAll: boolean = false) {
    let price = 0;
    price = this.utilProvider.accMul(salesDetail.orgSalesPrice, this.utilProvider.accDiv(discount, 100));
    // price = this.doOneComByDiscount(price);
    salesDetail.salesPrice = price;

    if (salesDetail.salesAmt && salesDetail.salesAmt > 0) {
      salesDetail.salesAmt = this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty);
    }
    if (!isAll) {//如果是单品的打折 生成单品优惠单
      let campaignData = {
        campaignName: '折扣',
        campaignType: '3',
        discountRule: discount,
        discountType: '1',
      }
      if (discount == '0') {//赠送
        campaignData.campaignName = '赠送';
        campaignData.campaignType = '2';
      }
      if (discount == '100') {//还原
        this.subOneSalesCampaign(salesDetail);
      } else {
        this.addOrEiditSalesOneCampaign(salesDetail, campaignData);
      }
      //单品折扣后
      salesDetail.itemDiscSalesPrice = price;
    }
    if (salesDetail.relatedType == 'M') {//主商品
      if (salesDetail.itemType == 'G') {
        this.shareGrupuCom(salesDetail);
      } else {
        this.shareAdditionComByDiscount(salesDetail, discount, isAll);
      }
    }
    // console.log(this.appShopping.salesDetailList);

    // console.log('12112121212221');
    //执行整单优惠
    if (!isAll) {
      this.doOrNotAllSalescampaign();
    }
  }

  // /**购物车商品'整单改价' */
  // allChargeMoney(orgPrice, price) {
  //   this.appShopping.salesDetailList.forEach(salesDetail => {
  //     let price = this.utilProvider.accMul(salesDetail.salesPrice, this.utilProvider.accDiv(this.appShopping.discount, 100));
  //     salesDetail.salesPrice = price;
  //   });
  // }
  /**执行'单品改价'优惠
   * 改价商品不分摊加料
   * 在外层循环执行加料改价
   * isAll 是否是整单优惠
   * salesDetail
   * price
   * campaignData
   * isCountAmt
   * 
   */
  doOneChargeMoney(salesDetail, price, campaignData?, isAll: boolean = false, isCountAmt: boolean = false) {
    // salesDetail.salesAmt = price;
    // salesDetail.salesPrice = this.utilProvider.accDiv(price, salesDetail.salesQty);
    salesDetail.salesPrice = price;

    if (salesDetail.salesAmt && salesDetail.salesAmt != 0 && !isCountAmt) {
      salesDetail.salesAmt = this.utilProvider.accMul(salesDetail.salesQty, price);
    }

    if (!isAll) {
      if (campaignData) {
        if (price == '0') {//赠送
          campaignData.campaignName = '赠送';
          campaignData.campaignType = '2';
        }
        this.addOrEiditSalesOneCampaign(salesDetail, campaignData);
      }
      //单品折扣后
      salesDetail.itemDiscSalesPrice = price;
    }
    // price = this.doOneComByDiscount(price);
    if (salesDetail.itemType == 'G') {
      this.shareGrupuCom(salesDetail);
    }

    //执行整单优惠
    if (!isAll) {
      this.doOrNotAllSalescampaign();
    }
  }

  // /**对单个商品执行'整单'优惠 */
  // doOneComByDiscount(price) {
  //   if (this.appShopping.discount) {//有整单优惠需要再执行整单优惠
  //     return this.utilProvider.accMul(price, this.utilProvider.accDiv(this.appShopping.discount, 100));
  //   } else {
  //     return price;
  //   }
  // }


  /**套餐优惠分摊 
   将套餐价 按比例摊到该套餐商品明细中
   */
  shareGrupuCom(salesDetail: SalesDetail) {
    let totalOrgTotalPrice = 0;//套餐商品明细原价总金额
    // let totalSalesPrice = this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty);
    let totalSalesPrice = 0
    let surplus = 0;
    if (salesDetail.salesAmt && salesDetail.salesAmt != 0) {
      totalSalesPrice = salesDetail.salesAmt;
    } else {
      totalSalesPrice = this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty);
    }
    surplus = totalSalesPrice;
    let grupList = [];
    // this.appShopping.salesDetailList.forEach(item => {
    //   if (item.parentId == salesDetail.id) {
    //     totalOrgTotalPrice = this.utilProvider.accAdd(totalOrgTotalPrice, this.utilProvider.accMul(item.orgSalesPrice, item.salesQty));
    //     grupList.push(item);
    //   }
    // });
    grupList = salesDetail['grupList'];
    let disCount = this.utilProvider.accDiv(totalSalesPrice, totalOrgTotalPrice, 4);
    grupList.forEach(grupuCom => {
      if (grupList[grupList.length - 1].id == grupuCom.id) {//最后一条
        grupuCom.salesAmt = surplus;
        grupuCom.salesPrice = this.utilProvider.accDiv(grupuCom.salesAmt, grupuCom.salesQty);
        //单品折扣后
        grupuCom.itemDiscSalesPrice = grupuCom.salesPrice;
        // grupuCom.orgSalesPrice=grupuCom.salesPrice;
      } else {
        let price = this.utilProvider.accMul(grupuCom.orgSalesPrice, grupuCom.salesQty);//单个商品原价总金额
        grupuCom.salesAmt = this.utilProvider.accMul(price, disCount);
        // grupuCom.salesAmt = this.utilProvider.accMul(totalSalesPrice, disCount);
        grupuCom.salesPrice = this.utilProvider.accDiv(grupuCom.salesAmt, grupuCom.salesQty);
        //单品折扣后
        grupuCom.itemDiscSalesPrice = grupuCom.salesPrice;
        // grupuCom.orgSalesPrice=grupuCom.salesPrice;
        surplus = this.utilProvider.accSub(surplus, grupuCom.salesAmt);
      }
    });
  }

  /**折扣
  * 加料优惠分摊
  * orgTotalPrice 原销售总金额
  * 
  */
  shareAdditionComByDiscount(salesDetail: SalesDetail, discount, isAll: boolean = false) {
    if (this.isAdditionDiscount(salesDetail)) {//配料参与打折
      let list = salesDetail['additionList'];
      list.forEach(element => {
        this.doOneDiscounts(element, discount, isAll);
      });
    } else {
      return;
    }
  }



  // /**加料优惠分摊
  //  * orgTotalPrice 原销售总金额
  //  * 改价总金额
  //  */
  // shareAdditionCom(salesDetail: SalesDetail, campaignData?) {
  //   if (this.selectSpuBySpuId(salesDetail.spuId).isAdditionDiscount == '0') {//配料不参与打折
  //     return;
  //   } else {
  //     let orgTotalPrice = this.utilProvider.accMul(salesDetail.orgSalesPrice, salesDetail.salesQty);
  //     let totalSalesPrice = this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty);
  //     let additionList = [];
  //     additionList.push(salesDetail);
  //     this.appShopping.salesDetailList.forEach(item => {
  //       if (item.parentId == salesDetail.id) {
  //         orgTotalPrice = this.utilProvider.accAdd(orgTotalPrice, this.utilProvider.accMul(salesDetail.orgSalesPrice, salesDetail.salesQty));
  //         totalSalesPrice = this.utilProvider.accAdd(totalSalesPrice, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
  //         additionList.push(item);
  //       }
  //     });
  //     if (additionList.length <= 1) return;
  //     additionList.forEach(addition => {
  //       let price = this.utilProvider.accMul(addition.orgSalesPrice, addition.salesQty);
  //       addition.salesAmt = this.utilProvider.accMul(totalSalesPrice, this.utilProvider.accDiv(price, orgTotalPrice));
  //       addition.salesPrice = this.utilProvider.accDiv(addition.salesAmt, addition.salesQty);

  //       // if (campaignData) {
  //       //   this.addSalescampaign(salesDetail, campaignData);
  //       // }

  //     });
  //   }
  // }




  /**套餐商品明细总数量 */
  getGroupItemQty(salesDetail) {
    let qty = 0;
    let grupList = salesDetail['groupList'];
    grupList.forEach(element => {
      qty = this.utilProvider.accAdd(qty, element.salesQty, 0)
    });
    return qty;
  }


  /**
   * 新增，编辑，删除单个商品都要执行
   */
  doOrNotAllSalescampaign() {
    let allSalescampaign = new SalesCampaign();
    allSalescampaign = this.getAllCampaign();
    if (allSalescampaign.id) {//要执行整单优惠
      let campaignData = {
        campaignName: allSalescampaign.campaignName,
        campaignType: allSalescampaign.campaignType,
        discountRule: allSalescampaign.discountRule,
        discountType: allSalescampaign.discountType,
      }
      if (campaignData.campaignType == '3') {//整单自定义折扣
        this.allDiscountSalescampaign(campaignData.discountRule, campaignData);
      } else if (campaignData.campaignType == '4') {//整单自定义改价
        this.allChangerMoneySalescampaign(campaignData.discountRule, campaignData);

      } else if (campaignData.campaignType == '5') {//会员折扣
        // debugger
        this.allDiscountSalescampaign(campaignData.discountRule, campaignData);
      }
    } else {
      return;
    }
  }

  /**
    * 整单优惠前先执行单品优惠
    * 购物车所有可优惠商品
    */
  doFirstOneCampain(salesDetail) {
    let campaign = new SalesCampaign();
    campaign = this.getOneCampaignBySalesId(salesDetail.id);
    if (campaign.id) {//有单品优惠
      if (campaign.campaignType == '3') {//单品折扣
        if (salesDetail.parentId) {//排除明细商品 因为明细商品在打折时会自动分摊
          return;
        }
        this.doOneDiscounts(salesDetail, campaign.discountRule, true);
      } else if (campaign.campaignType == '4' || campaign.campaignType == '5') {//单品改价
        if (salesDetail.relatedType == 'G') {   //加料明细会走 套餐明细排除
          return;
        }
        this.doOneChargeMoney(salesDetail, campaign.discountRule, '', true);
      }
      else if (campaign.campaignType == '2') {//赠送
        if (salesDetail.parentId) {//排除明细商品 因为明细商品在打折时会自动分摊
          return;
        }
        this.doOneDiscounts(salesDetail, campaign.discountRule, true);
      }
    } else {//还原
      this.resutOneCampaign(salesDetail);
      return;
    }
  }



  /**整单'折扣'优惠单据 计算
   * discount 整单折扣
   * isEdilt  是否编辑
   */
  allDiscountSalescampaign(discount, campaignData: { campaignName, campaignType, discountRule, discountType?}, isEdilt: boolean = false) {

    let discountAmt = 0;
    let originalAmt = 0;
    let retailAmt = 0;
    let itemRetailAmt = 0;
    let salesAmt = 0;
    let itemSalesAmt = 0;
    let salesQty = 0;
    let itemQty = 0;

    let discountList = [];//可优惠列表
    this.appShopping.salesDetailList.forEach(salesDetail => {
      if (salesDetail.relatedType == 'G') {//套餐明细不生成优惠
        return;
      }

      if (this.isSalesDetailDiscount(salesDetail)) {//可优惠商品 主商品和加料商品
        // this.doFirstOneCampain(salesDetail);

        originalAmt = this.utilProvider.accAdd(originalAmt, this.utilProvider.accMul(salesDetail.itemDiscSalesPrice, salesDetail.salesQty));
        itemQty = this.utilProvider.accAdd(itemQty, this.getGroupQty(salesDetail));
        let orgPrice = salesDetail.itemDiscSalesPrice;
        salesDetail.salesPrice = this.utilProvider.accMul(orgPrice, this.utilProvider.accDiv(discount, 100));
        // salesDetail.salesAmt = this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty);
        if (salesDetail.salesAmt && salesDetail.salesAmt != 0) {
          salesDetail.salesAmt = this.utilProvider.accMul(salesDetail.salesQty, salesDetail.salesPrice);
        }
        if (salesDetail.itemType == 'G') {
          this.shareGrupuCom(salesDetail);
        }
        itemRetailAmt = this.utilProvider.accAdd(itemRetailAmt, this.utilProvider.accMul(salesDetail.retailPrice, salesDetail.salesQty));

      } else {
        originalAmt = this.utilProvider.accAdd(originalAmt, this.utilProvider.accMul(salesDetail.itemDiscSalesPrice, salesDetail.salesQty));
      }

      //购物车所有商品原价总金额
      retailAmt = this.utilProvider.accAdd(retailAmt, this.utilProvider.accMul(salesDetail.retailPrice, salesDetail.salesQty));
      //购物车所有商品销售价总金额
      salesAmt = this.utilProvider.accAdd(salesAmt, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
      salesQty = this.utilProvider.accAdd(salesQty, this.getGroupQty(salesDetail));
      discountAmt = this.utilProvider.accSub(originalAmt, salesAmt);

    });



    let data = {
      lineNo: this.appShopping.salesCampaignList.length + 1,
      campaignName: campaignData.campaignName,
      campaignType: campaignData.campaignType,
      discountRule: campaignData.discountRule,
      discountType: campaignData.discountType,
      discountAmt: discountAmt,
      originalAmt: originalAmt,
      retailAmt: retailAmt,
      itemRetailAmt: itemRetailAmt,
      salesAmt: salesAmt,
      itemSalesAmt: itemSalesAmt,
      salesQty: salesQty,
      itemQty: itemQty,
    }
    let salesCampaign = this.getAllCampaign();
    if (salesCampaign && salesCampaign.id) {//编辑
      this.ediltSalesCampaign(salesCampaign, data);
    } else {//新增
      this.appShopping.salesCampaignList.push(this.buildSalesCampaign(data));
    }

    this.doLog();

  }

  /**整单'改价'优惠单据 计算
   * price 整单改价价格
   * campaignData 单据类型相关数据
  */
  allChangerMoneySalescampaign(price, campaignData: { campaignName, campaignType, discountRule, discountType?}) {

    let discountAmt = 0;
    let originalAmt = 0;
    let retailAmt = 0;
    let itemRetailAmt = 0;
    let salesAmt = 0;
    let itemSalesAmt = 0;
    let salesQty = 0;
    let itemQty = 0;

    let discountItemList = [];
    // let priceMap = this.getAllDiscountItemListpriceMap()

    this.appShopping.salesDetailList.forEach(salesDetail => {
      if (salesDetail.relatedType == 'G') {//套餐明细排除
        return;
      }
      //原价总金额
      retailAmt = this.utilProvider.accAdd(retailAmt, this.utilProvider.accMul(salesDetail.retailPrice, salesDetail.salesQty));
      //购物车所有商品销售价总金额
      originalAmt = this.utilProvider.accAdd(salesAmt, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
      salesQty = this.utilProvider.accAdd(salesQty, this.getGroupQty(salesDetail));

      if (this.isSalesDetailDiscount(salesDetail)) {
        // this.doFirstOneCampain(salesDetail);//先执行单品优惠 itemDiscSalesPrice
        discountItemList.push(salesDetail);
        //销售价总金额
        salesAmt = this.utilProvider.accAdd(salesAmt, this.utilProvider.accMul(salesDetail.itemDiscSalesPrice, salesDetail.salesQty));
        //优惠商品原价总金额
        itemRetailAmt = this.utilProvider.accAdd(itemRetailAmt, this.utilProvider.accMul(salesDetail.retailPrice, salesDetail.salesQty));
        //优惠商品销售价总金额 可优惠金额
        itemSalesAmt = this.utilProvider.accAdd(itemSalesAmt, this.utilProvider.accMul(salesDetail.itemDiscSalesPrice, salesDetail.salesQty));
        //优惠商品数量
        itemQty = this.utilProvider.accAdd(itemQty, this.getGroupQty(salesDetail));
      } else {
        // //销售价总金额
        salesAmt = this.utilProvider.accAdd(salesAmt, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
      }
      salesQty = this.utilProvider.accAdd(salesQty, this.getGroupQty(salesDetail));
    });

    let priceMap = {
      allSalesPrice: salesAmt,
      allUndisCountPrice: this.utilProvider.accSub(salesAmt, itemSalesAmt),
      allDisCountPrice: itemSalesAmt,
    }

    if (price < priceMap.allUndisCountPrice) {
      this.http.showToast('改价不能小于不可改价金额');//此时商品销售价为单品优惠后的价钱
      this.subAllSalesCampaign();//删除整单优惠单
      return;
    } else {//执行整单改价优惠
      let discount = this.utilProvider.accDiv(this.utilProvider.accSub(price, priceMap.allUndisCountPrice), priceMap.allDisCountPrice);
      if (discount < this.appShopping.staff.minDiscount) {
        this.http.showToast('权限不足');
        return;
      }
      // discount=this.utilProvider.accMul(discount,100);
      // let surplusValue = priceMap.allDisCountPrice;
      let surplusValue = this.utilProvider.accSub(price, priceMap.allUndisCountPrice);

      //整单改价
      discountItemList.forEach(salesDetail => {
        let orgPrice = salesDetail.salesPrice;
        let chanrgePriceAmt = 0
        if (discountItemList[discountItemList.length - 1].id == salesDetail.id) {//最后一条分剩下的
          chanrgePriceAmt = surplusValue;//单条总价
          salesDetail.salesAmt = chanrgePriceAmt;
          let chanrgePrice = 0;
          chanrgePrice = this.utilProvider.accDiv(chanrgePriceAmt, salesDetail.salesQty);
          this.doOneChargeMoney(salesDetail, chanrgePrice, '', true, true);
          // console.log(salesDetail);

        } else {
          chanrgePriceAmt = this.utilProvider.accMul(this.utilProvider.accMul(orgPrice, discount), salesDetail.salesQty);//单条总价
          salesDetail.salesAmt = chanrgePriceAmt;
          surplusValue = this.utilProvider.accSub(surplusValue, chanrgePriceAmt);
          let chanrgePrice = 0;
          chanrgePrice = this.utilProvider.accDiv(chanrgePriceAmt, salesDetail.salesQty);
          this.doOneChargeMoney(salesDetail, chanrgePrice, '', true);
        }


        discountAmt = this.utilProvider.accAdd(discountAmt, this.utilProvider.accSub(this.utilProvider.accMul(orgPrice, salesDetail.salesQty), salesDetail.salesAmt));
      });
      originalAmt = salesAmt;//单品优惠后 整单打折前销售价
      salesAmt = this.utilProvider.accSub(salesAmt, discountAmt);

      // discountAmt = this.utilProvider.accSub(originalAmt, salesAmt);
      // console.log('1213333333333333333');
      // console.log(discountAmt);

      let data = {
        lineNo: this.appShopping.salesCampaignList.length + 1,
        campaignName: campaignData.campaignName,
        campaignType: campaignData.campaignType,
        discountRule: campaignData.discountRule,
        discountType: campaignData.discountType,
        discountAmt: discountAmt, //优惠金额
        originalAmt: originalAmt,//整单折前金额
        retailAmt: retailAmt,//整单原价金额
        itemRetailAmt: itemRetailAmt,//优惠商品原价金额
        salesAmt: salesAmt,//折后金额
        itemSalesAmt: itemSalesAmt,//优惠商品折后金额
        salesQty: salesQty,
        itemQty: itemQty,
      }
      console.log(data);
      let salesCampaign = this.getAllCampaign();
      if (salesCampaign && salesCampaign.id) {//编辑
        this.ediltSalesCampaign(salesCampaign, data);
      } else {//新增
        this.appShopping.salesCampaignList.push(this.buildSalesCampaign(data));
      }

    }


    // let data = {
    //   lineNo: '2',
    //   campaignName: campaignData.campaignName,
    //   campaignType: campaignData.campaignType,
    //   discountRule: campaignData.discountRule,
    //   discountType: campaignData.discountType,
    //   discountAmt: discountAmt,
    //   originalAmt: originalAmt,
    //   retailAmt: retailAmt,
    //   itemRetailAmt: itemRetailAmt,
    //   salesAmt: salesAmt,
    //   itemSalesAmt: itemSalesAmt,
    //   salesQty: salesQty,
    //   itemQty: itemQty,
    // }
    // let salesCampaign = this.getAllCampaign();
    // if (salesCampaign && salesCampaign.id) {//编辑
    //   this.ediltSalesCampaign(salesCampaign, data);
    // } else {//新增
    //   this.appShopping.salesCampaignList.push(this.buildSalesCampaign(data));
    // }
  }



  /**可优惠商品销售总价，总可整单改价金额，总不可整单改价金额
   * 按销售价分摊
   */
  getAllDiscountItemListpriceMap() {
    let allSalesPrice = 0;
    let allDisCountPrice = 0;
    let allUndisCountPrice = 0;
    this.appShopping.salesDetailList.forEach(salesDetail => {
      if (salesDetail.relatedType == 'G') {
        return;
      }

      allSalesPrice = this.utilProvider.accAdd(allSalesPrice, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
      if (this.isSalesDetailDiscount(salesDetail)) {
        // this.doFirstOneCampain(salesDetail);
        allDisCountPrice = this.utilProvider.accAdd(allDisCountPrice, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
      }
    });
    /**如果有整单优惠 要加上整单优惠金额 */
    let allCampaign = this.getAllCampaign();
    if (allCampaign && allCampaign.id) {
      allSalesPrice = this.utilProvider.accAdd(allSalesPrice, allCampaign.discountAmt);
      allDisCountPrice = this.utilProvider.accAdd(allDisCountPrice, allCampaign.discountAmt);
    }
    allUndisCountPrice = this.utilProvider.accSub(allSalesPrice, allDisCountPrice);
    let priceMap = { allSalesPrice: allSalesPrice, allDisCountPrice: allDisCountPrice, allUndisCountPrice: allUndisCountPrice };
    return priceMap;
  }



  /**套餐明细总数量
   * 普通商品和加料商品取salesQty
   */
  getGroupQty(salesDetail) {
    let qty = 0;
    if (salesDetail.itemType == 'G') {
      let groupList = salesDetail.groupList;
      groupList.forEach(group => {
        qty = this.utilProvider.accAdd(qty, group.salesQty)
      });
    } else {
      qty = salesDetail.salesQty;
    }
    return qty;
  }


  /**查询 整单折扣优惠单 */
  getAllCampaign() {
    let salesCampaign = new SalesCampaign();
    for (let cam of this.appShopping.salesCampaignList) {
      if (cam.discountType == '0' && cam.isDelete != '1') {
        salesCampaign = cam;
        return salesCampaign;
      }
    }
    // this.appShopping.salesCampaignList.forEach(element => {
    //   if (element.discountType == '0' && element.isDelete != '1') {
    //     salesCampaign = element;
    //     return;
    //   }
    // });
    // return salesCampaign;
  }
  /**拿到对应的单品折扣优惠单 */
  getOneCampaignBySalesId(id) {
    let salesCampaign = new SalesCampaign();
    for (let cam of this.appShopping.salesCampaignList) {
      if (cam.salesDetailId == id && cam.isDelete == '0') {
        salesCampaign = cam;
        return salesCampaign;
      }
    }
    // this.appShopping.salesCampaignList.forEach(element => {
    //   if (element.salesDetailId == id && element.isDelete == '0') {
    //     salesCampaign = element;
    //     return;
    //   }
    // });
    // return salesCampaign;
  }




  /**
   * 新增或更新优惠单 
   * @param salesDetail 
   * @param  campaignName '活动名称 （<活动名称>/赠送/自定义折扣/改价/会员优惠/套餐名称)',
   * @param campaignType 活动类型 （1活动 2 赠送 3 自定义折扣 4 改价 5 会员优惠 （整单表示会员折扣，单品表示会员价） 6 套餐）',
   *@param  discountRule '折扣规则',
   */
  addOrEiditSalesOneCampaign(salesDetail, campaignData: { campaignName, campaignType, discountRule, discountType?}) {
    campaignData.discountType = 1;
    let salesCampaign = new SalesCampaign();
    salesCampaign = this.getOneCampaignBySalesId(salesDetail.id);
    let data = {
      lineNo: this.appShopping.salesCampaignList.length + 1,
      campaignName: campaignData.campaignName,
      campaignType: campaignData.campaignType,
      discountRule: campaignData.discountRule,
      discountType: campaignData.discountType,
      discountAmt: 0,
      originalAmt: 0,
      retailAmt: 0,
      itemRetailAmt: 0,
      salesAmt: 0,
      itemSalesAmt: 0,
      salesQty: 0,
      itemQty: 0,
    };
    let salesPrice = salesDetail.salesPrice;
    let salesQty = salesDetail.salesQty;
    let orgSalesPrice = salesDetail.orgSalesPrice;
    let retailPrice = salesDetail.retailPrice;
    data.discountAmt = this.utilProvider.accMul(this.utilProvider.accSub(orgSalesPrice, salesPrice), salesQty);
    data.originalAmt = this.utilProvider.accMul(orgSalesPrice, salesQty);
    data.retailAmt = 0;
    data.itemRetailAmt = this.utilProvider.accMul(retailPrice, salesQty);
    data.salesAmt = 0;
    // data.itemSalesAmt = this.utilProvider.accMul(salesPrice, salesQty);
    data.itemSalesAmt = salesDetail.salesAmt;
    if (salesDetail.itemType == 'G') {
      data.salesQty = this.getGroupItemQty(salesDetail)
    } else {
      data.salesQty = salesQty;
    }
    data.itemQty = data.salesQty;
    if (salesCampaign && salesCampaign.id) {//编辑
      this.ediltSalesCampaign(salesCampaign, data);
    } else {//新增
      this.appShopping.salesCampaignList.push(this.buildSalesCampaign(data, salesDetail));
      // console.log('1111111111111111');
      // console.log(this.appShopping.salesCampaignList);
    }
  }



  /**整单
   * 单品
   * 优惠单据数据构造
   * @param data 
   * @param salesDetail 
   */
  buildSalesCampaign(data: { lineNo, campaignName, campaignType, discountRule, discountType, discountAmt, originalAmt, retailAmt, itemRetailAmt, salesAmt, itemSalesAmt, salesQty, itemQty }, salesDetail?) {
    let salesCampaign = new SalesCampaign();
    salesCampaign.id = this.utilProvider.getUUID();
    salesCampaign.storeId = this.appCache.store.id;
    salesCampaign.storeName = this.appCache.store.storeName;
    salesCampaign.storeSysCode = this.appCache.store.storeSysCode;
    salesCampaign.salesId = this.appShopping.salesh.id;
    salesCampaign.lineNo = data.lineNo;
    salesCampaign.status = this.appShopping.salesh.status;
    // salesCampaign.campaignId = this.utilProvider.getUUID();
    salesCampaign.campaignName = data.campaignName;
    salesCampaign.campaignType = data.campaignType;
    salesCampaign.discountRule = data.discountRule;
    salesCampaign.discountType = data.discountType;


    salesCampaign.discountAmt = data.discountAmt;
    salesCampaign.originalAmt = data.originalAmt;
    salesCampaign.retailAmt = data.retailAmt;
    salesCampaign.itemRetailAmt = data.itemRetailAmt;
    salesCampaign.salesAmt = data.salesAmt;
    salesCampaign.itemSalesAmt = data.itemSalesAmt;
    salesCampaign.salesQty = data.salesQty;
    salesCampaign.itemQty = data.itemQty;

    if (salesDetail && salesDetail.id) {
      salesCampaign.salesDetailId = salesDetail.id;
      salesCampaign.spuId = salesDetail.spuId;
      salesCampaign.itemId = salesDetail.itemId;
      // salesCampaign.itemQty = salesDetail.salesQty;
      salesCampaign.itemCode = salesDetail.itemCode;
      salesCampaign.itemType = salesDetail.itemType;
      salesCampaign.itemName = salesDetail.itemName;
    }

    salesCampaign.handoverId = this.appShopping.handoverh.id;
    salesCampaign.handoverDate = this.appShopping.handoverh.handoverDate;
    salesCampaign.discountById = this.appShopping.staff.id;
    salesCampaign.discountByCode = this.appShopping.staff.staffCode;
    salesCampaign.discountByName = this.appShopping.staff.staffName;
    if (this.appShopping.customer && this.appShopping.customer.id) {
      salesCampaign.custId = this.appShopping.customer.id;
      salesCampaign.custCode = this.appShopping.customer.custCode;
      salesCampaign.custName = this.appShopping.customer.custName;
      salesCampaign.custSysCode = this.appShopping.customer.custSysCode;
    }

    salesCampaign.isDelete = '0';
    // salesCampaign.createdBy = this.appShopping.staff.staffName;
    salesCampaign.createdTime = this.utilProvider.getNowTime();

    return salesCampaign;
  }

  ediltSalesCampaign(salesCampaign: SalesCampaign, data: { lineNo, campaignName, campaignType, discountRule, discountType, discountAmt, originalAmt, retailAmt, itemRetailAmt, salesAmt, itemSalesAmt, salesQty, itemQty }) {
    salesCampaign.campaignName = data.campaignName;
    salesCampaign.campaignType = data.campaignType;
    salesCampaign.discountRule = data.discountRule;
    // salesCampaign.discountType = data.discountType;
    salesCampaign.discountAmt = data.discountAmt;
    salesCampaign.originalAmt = data.originalAmt;
    salesCampaign.itemRetailAmt = data.itemRetailAmt;
    salesCampaign.itemSalesAmt = data.itemSalesAmt;
    salesCampaign.salesQty = data.salesQty;
    salesCampaign.itemQty = data.itemQty;
  }

  /**
   * 
   * @param retailAmt 
   * @param salesAmt 
   * @param payAmt 
   * @param changeAmt 
   * @isAccounts 是否结账
   * @isAdd 是否加菜
   * 
   */
  beforSubmitBuildData(retailAmt, salesAmt, payAmt, changeAmt, isAccounts: boolean = false, isAdd: boolean = false) {
    let salesh = this.appShopping.salesh;
    salesh.retailAmt = retailAmt;
    salesh.salesAmt = salesAmt;
    salesh.payAmt = payAmt;
    salesh.changeAmt = changeAmt;
    salesh.ttlDiscAmt = this.utilProvider.accSub(retailAmt, salesAmt);
    salesh['itemQty'] = 0;
    salesh.itemDiscSalesAmt = 0;
    salesh.itemDiscAmt = 0;
    salesh.itemWholeDiscAmt = 0;
    if (salesh.remark == null || salesh.remark == 'null') {
      salesh.remark = null;
    }
    let salesTable = this.appShopping.salesTable;
    if (salesTable && salesTable.id) {
      salesTable.salesAmt = salesAmt;
      salesh.personNum = salesTable.personNum;
      salesTable.salesId = salesh.id;
    }
    if (this.appShopping.customer && this.appShopping.customer.id) {
      salesh.custCode = this.appShopping.customer.custCode;
      salesh.custId = this.appShopping.customer.id;
      salesh.custName = this.appShopping.customer.custName;
      salesh.custSysCode = this.appShopping.customer.custSysCode;
    }
    if (isAccounts) {
      salesh.payStatus = 3;
      salesh.status = '1';
      salesTable.status = '1';
      salesTable.isUpload = '0';
    }
    salesh.salesQty = 0;
    salesh.costAmt = 0;
    this.appShopping.salesDetailList.forEach(salesDetail => {
      if (!salesDetail.salesAmt || salesDetail.salesAmt == 0) {
        salesDetail.salesAmt = this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty);
      }
      let retailPriceAmt = this.utilProvider.accMul(salesDetail.retailPrice, salesDetail.salesQty);
      if (salesDetail.itemDiscSalesPrice) {
        //单品折后价合计
        salesDetail.itemDiscSalesAmt = this.utilProvider.accMul(salesDetail.itemDiscSalesPrice, salesDetail.salesQty);
        // console.log('单品折后价'+ salesDetail.itemDiscSalesPrice);
        // console.log('单品折后价合计'+ salesDetail.itemDiscSalesAmt);
        //单品优惠合计
        salesDetail.itemDiscAmt = this.utilProvider.accSub(retailPriceAmt, salesDetail.itemDiscSalesAmt);
      } else {
        salesDetail.itemDiscSalesAmt = 0;
        salesDetail.itemDiscAmt = 0;
      }

      // console.log('单品优惠合计'+ salesDetail.itemDiscAmt);
      // debugger
      if (salesDetail.itemDiscSalesAmt && salesDetail.itemDiscSalesAmt != 0) {
        //整单优惠合计
        salesDetail.itemWholeDiscAmt = this.utilProvider.accSub(salesDetail.itemDiscSalesAmt, salesDetail.salesAmt)
      } else {
        //整单优惠合计
        salesDetail.itemWholeDiscAmt = this.utilProvider.accSub(retailPriceAmt, salesDetail.salesAmt)
      }
      // console.log('整单优惠合计'+ salesDetail.itemWholeDiscAmt);
      if (salesDetail.itemType != 'G') {
        salesh['itemQty'] = this.utilProvider.accAdd(salesh['itemQty'], salesDetail.salesQty);
        salesh.itemDiscSalesAmt = this.utilProvider.accAdd(salesh.itemDiscSalesAmt, salesDetail.itemDiscSalesAmt);
        salesh.itemDiscAmt = this.utilProvider.accAdd(salesh.itemDiscAmt, salesDetail.itemDiscAmt);
        salesh.itemWholeDiscAmt = this.utilProvider.accAdd(salesh.itemWholeDiscAmt, salesDetail.itemWholeDiscAmt);
        console.log('itemDiscSalesAmt:' + salesh.itemDiscSalesAmt + 'itemDiscAmt:' + salesh.itemDiscAmt + 'itemWholeDiscAmt:' + salesh.itemWholeDiscAmt);

      }
      salesh.salesQty = this.utilProvider.accAdd(salesh.salesQty, salesDetail.salesQty);
      salesh.costAmt = this.utilProvider.accAdd(this.utilProvider.accMul(salesDetail.costPrice, salesDetail.salesQty), salesh.costAmt);
      if (salesDetail.relatedType != "G") {
        salesDetail.ttlDiscAmt = this.utilProvider.accSub(this.utilProvider.accMul(salesDetail.orgSalesPrice, salesDetail.salesQty), salesDetail.salesAmt);
      }
      //如果是套餐主商品，明细商品需分摊优惠金额
      if (salesDetail.itemType == 'G' && salesDetail.ttlDiscAmt && salesDetail.ttlDiscAmt != 0) {
        // let list = this.getGroupOrAdditionList(salesDetail).groupList;
        let disCount = this.utilProvider.accDiv(salesDetail.ttlDiscAmt, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty), 4);
        let surplus = salesDetail.ttlDiscAmt;
        let grupList = [];
        // grupList = this.getGroupOrAdditionList(salesDetail).groupList;
        this.appShopping.salesDetailList.forEach(item => {
          if (item.parentId == salesDetail.id) {
            grupList.push(item);
          }
        });
        grupList.forEach(grupuCom => {
          if (grupList[grupList.length - 1].id == grupuCom.id) {//最后一条
            grupuCom.ttlDiscAmt = surplus;
          } else {
            grupuCom.ttlDiscAmt = this.utilProvider.accMul(grupuCom.salesPrice, disCount)
            surplus = this.utilProvider.accSub(surplus, grupuCom.ttlDiscAmt);
          }
        });
      }
      // if (!salesDetail.parentId) {
      //   this.getGroupOrAdditionList(salesDetail);
      // }
      if (isAdd) {
        salesDetail.itemStatus = 1;
      }
      if (isAccounts) {
        salesDetail.status = 1;
      }
    });
    this.appShopping.salesCampaignList.forEach(salesCampaign => {
      salesCampaign.salesAmt = salesAmt;
      salesCampaign.retailAmt = retailAmt;
      if (isAccounts) {
        salesCampaign.status = 1;
      }
    });
  }
  /**
   * 添加一些新的优惠字段
   * itemDiscSalesPrice，itemDiscSalesAmt，itemDiscAmt，itemWholeDiscAmt
   * @param salesDetail 主商品
   * @param list 商品明细
   */
  addNewCampaignField(salesDetail, list) {

  }

  /**取消会员优惠 */
  resultCustomer() {
    let campaign = this.getAllCampaign();
    if (campaign && campaign.campaignType == '5') {//会员折扣
      this.resutAllCampaign();
    } else {//会员价
      this.appShopping.salesDetailList.forEach(salesDetail => {
        let oneCampaign = this.getOneCampaignBySalesId(salesDetail.id);
        if (oneCampaign.campaignType == '5') {
          this.resutOneCampaign(salesDetail);
        }

      });

    }
    this.appShopping.customer = null;
    if (this.appShopping.salesCusts && this.appShopping.salesCusts.id) {
      this.appShopping.salesCusts.isDelete = '1';
    }
  }

  /**取消单品优惠 */
  resutOneCampaign(salesDetail, needCyclic?) {
    if (salesDetail.relatedType == 'G') {//套餐明细排除
      return;
    }
    this.doOneChargeMoney(salesDetail, salesDetail.orgSalesPrice, false, true);
    if (needCyclic) {
      this.appShopping.salesDetailList.forEach(addtion => {
        if (addtion.parentId == salesDetail.id) {
          this.doOneChargeMoney(addtion, addtion.orgSalesPrice, false, true);
        }
      })
    }
    this.subOneSalesCampaign(salesDetail);
  }


  /**取消整单优惠 */
  resutAllCampaign() {
    this.appShopping.salesDetailList.forEach(salesDetail => {
      if (salesDetail.relatedType == 'G') {//套餐明细排除
        return;
      }
      if (this.isSalesDetailDiscount(salesDetail)) {
        this.doFirstOneCampain(salesDetail);//先执行单品优惠
      }
    });

    this.subAllSalesCampaign();
    this.appShopping.customer = null;
  }



  /**删除单品优惠单
   * @param salesDetail
   */
  subOneSalesCampaign(salesDetail) {
    if (this.appShopping.salesTable && this.appShopping.salesTable.id) {
      let cam = this.getOneCampaignBySalesId(salesDetail.id);
      if (cam && cam.id) {
        cam.isDelete = '1';
      }
    } else {
      this.appShopping.salesCampaignList = this.appShopping.salesCampaignList.filter(item => item.salesDetailId != salesDetail.id);
    }

    // console.log(this.appShopping.salesCampaignList);

  }
  /**删除整单优惠单 */
  subAllSalesCampaign() {
    if (this.appShopping.salesTable && this.appShopping.salesTable.id) {
      let cam = this.getAllCampaign();
      if (cam && cam.id) {
        cam.isDelete = '1';
      }
    } else {
      this.appShopping.salesCampaignList = this.appShopping.salesCampaignList.filter(item => item.discountType != '0');
      // console.log(this.appShopping.salesCampaignList);
    }
    // this.utilProvider.dedelArrayByListById(this.appShopping.salesCampaignList, this.getAllCampaign())
  }
  /**删除所有优惠单 */
  clearSalesCampaign() {
    this.appShopping.salesCampaignList.length = 0;
  }

  /**
   * 
   * @param payMent 
   * @param price 
   * @param changeFlag 
   */
  buildSalesPay(payMent, price, changeFlag: number = 0, ) {
    let salesPay = new SalesPay();
    salesPay.id = this.utilProvider.getUUID();
    salesPay.isDelete = 0;
    salesPay.lineNo = this.appShopping.salesPayList.length + 1;
    // salesPay.lklRemark = '';
    salesPay.payAmt = price;
    salesPay.payId = payMent.id;
    salesPay.payName = payMent.payName;
    salesPay.payCode = payMent.payCode;
    salesPay.payTime = this.utilProvider.getNowTime();
    salesPay.payMonth = this.utilProvider.getNowTime('yyyy-MM');
    salesPay.payYear = this.utilProvider.getNowTime('yyyy');
    salesPay.handoverId = this.appShopping.handoverh.id;
    salesPay.payDate = this.appShopping.handoverh.handoverDate;
    // salesPay.
    salesPay.payStatus = 3;
    // salesPay.payTransId = '';
    // salesPay.posId = null;
    // salesPay.remark='';
    salesPay.orderType = this.appShopping.salesh.orderType;
    salesPay.salesId = this.appShopping.salesh.id;
    salesPay.salesNo = this.appShopping.salesh.salesNo;
    salesPay.salesType = this.appShopping.salesh.salesType;
    salesPay.storeId = this.appCache.store.id;
    salesPay.storeName = this.appCache.store.storeName;
    salesPay.storeSysCode = this.appCache.store.storeSysCode;
    salesPay.changeFlag = changeFlag;
    salesPay.sysUpdateTime = this.utilProvider.getNowTime();
    salesPay.createdTime = this.utilProvider.getNowTime();
    salesPay.createdBy = this.appShopping.staff.staffName;
    salesPay.cashierName = this.appShopping.cashier.staffName;
    salesPay.cashierId = this.appShopping.cashier.id;
    salesPay.cashierCode = this.appShopping.cashier.staffCode;

    return salesPay;
  }

  // refreshData(dataName) {
  //   dataName = dataName || '*';
  //   let me = this;
  //   me.webSocketService.sendObserveMessage("LOADDATA", dataName, { content: '正在刷新数据...' }).subscribe(function (retData) {
  //     if (retData && retData.success) {
  //       me.assignmentData(retData);
  //       me.http.showToast('数据刷新成功!');
  //     }
  //   });
  // }
  countValue() {

  }

  doLog(data?: {}) {
    console.log('购物车详情:');
    console.log(this.appShopping.salesDetailList);
    console.log('优惠单详情:');
    console.log(this.appShopping.salesCampaignList);
    console.log(data);
  }
}
