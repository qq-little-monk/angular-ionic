import { Injectable } from "@angular/core";
import { SalesDetail } from "../domain/salesDetail";
import { Salesh } from "../domain/salesh";
import { Staff } from "../domain/staff";
import { SalesCampaign } from "../domain/sales-campaign";
import { SalesPay } from "../domain/salesPay";
// import { DISHES } from "../model/dishes";
// import { ComType } from "../model/comType";
// import { ComSpu } from "../model/comSpu";
// import { ComSku } from "../model/ComSku";
// import { ComSpuExt } from "../model/comSpuExt";
// import { ComAdditionGroup } from "../model/comAdditionGroup";
// import { ComAddition } from "../model/comAddition";
// import { ComBoGroup } from "../model/comBoGroup";
// import { ComBo } from "../model/comBo";
// import { Customer } from "../model/customer";
// import { CustGrade } from "../model/custgrade";
// import { Handoverh } from "../model/handoverh";


@Injectable()
//点餐相关数据缓存
export class AppShopping {
    dataCache: any;


    /**所有商品备用map，包含spulist和skulist;点菜宝在需要刷新商品资料的时候使用*/
    comOriginalMap: any = { spuList: [], skuList: [] };

    /**所有商品map，包含spulist和skulist；用于页面显示*/
    comMap: any = { spuList: [], skuList: [] };

    /** 所有分类*/
    typeList: any[] = [];

    /**
   * 商品分类
    */
    public comTypeList: Array<any> = [];

    /**
      * 商品spu
      * hasAddition 0-没有 1-有
      * itemType  N:normall普通商品, G: Group组合商品,套餐, S:Service服务
      */
    public comSpuList: Array<any> = [];

    /**
      * 商品sku
      */
    public comSkuList: Array<any> = [];

    /**
     * 商品扩展表数据
     * 通过spu表id与comSpuExt表id关联
     */
    public comSpuExtList: Array<any> = [];

    /**
      * 附加商品组
      * refSpuId 主商品spuId
      */
    public comAdditionGroupList: Array<any> = [];

    /**
      * 附加商品组明细
      * refSpuId 主商品spuId
      * groupId  附加商品组id
      */
    public comAdditionList: Array<any> = [];

    /**
    * 商品公共口味
    */
    public dynamicAttrList: Array<any> = [];

    /**组合、套餐商品组*/
    public comBoGroupList: Array<any> = [];

    /**组合、套餐商品组明细*/
    public comBoList: Array<any> = [];

    /**区域*/
    public areaList: any = [];

    /**餐桌*/
    public tableList: any = [];


    /** 会员*/
    public customerList: Array<any> = [];

    /** 会员级别*/
    public custGradeList: Array<any> = [];

    /** 交接班*/
    public handoverhList: Array<any> = [];

    /** 加入购物车商品*/
    salesDetailList: SalesDetail[] = [];

    /**
    * 分类对应的购物车商品数量Map
    * cateId:num
    */
    typeOfCarComMap: {} = {};

    /**
    * spu商品对应的购物车商品数量Map
    * cateId:num
    */
    spuOfCarComMap: {} = {};

    /**
    * 单个spu商品对应的购物车商品数量Map
    * spuId:num
    */
    ComOfCarComMap: {} = {};

    /**销售单 Salesh */
    salesh: Salesh = new Salesh();

    /**优惠单 */
    salesCampaign: SalesCampaign = new SalesCampaign();

    /**当登录点菜宝员  Staff*/
    staff: any = null;

    /**  值班收银员*/
    cashier: any = null;

    /**当前交接班单据  Handoverh*/
    handoverh: any = null;

    /** 选中会员*/
    customer: any = null;
    salesCusts: any = null;

    /** 优惠记录*/
    salesCampaignList: any[] = [];

    /** 整单折扣*/
    discount: number = 100;

    /**支付单list */
    salesPayList: SalesPay[] = [];
    /**下单桌台 */
    salesTableList: any = [];
    /**取单桌台 如果不为空就是取单单据 */
    salesTable: any = {};
    table: any = {};
    /**支付方式 */
    payMentList: any[] = [];
    initData() {

    }

    //切换店铺须清除缓存
    changStoreResetData() {
        this.salesDetailList = [];
        this.typeOfCarComMap = {};
        this.salesh = null;
        this.cashier = null;

    }

    /**
    * 下单清除缓存
    */
    clearOdear() {
        this.salesDetailList = [];
        this.typeOfCarComMap = {};
        this.spuOfCarComMap = {};
        this.salesh = new Salesh();
        this.salesCampaign = new SalesCampaign();
        this.customer = null;
        this.salesCusts = null;
        this.salesCampaignList = [];
        this.discount = 100;
        this.salesPayList = [];
        this.salesTable = {};
        this.table = {};

    }
    /**清除商品数据 */
    resetItemData() {
        this.typeList = [];
        this.comMap = {};
        this.typeOfCarComMap = {};
        this.spuOfCarComMap = {};
        this.comTypeList = [];
        this.comSpuList = [];
        this.comSkuList = [];
        this.comSpuExtList = [];
        this.comAdditionGroupList = [];
        this.comAdditionList = [];
        this.comBoGroupList = [];
        this.comBoList = [];
        this.customerList = [];
        this.custGradeList = [];
        this.salesDetailList = [];
        this.tableList = [];
        this.salesTableList = [];
        this.payMentList = [];
        this.cashier = null;
    };

    /**
    * 清除所有缓存
    */
    resetData() {
        this.comOriginalMap = {};
        this.comMap = {};
        this.typeOfCarComMap = {};
        this.spuOfCarComMap = {};
        this.typeList = [];
        this.comMap = {};
        this.comTypeList = [];
        this.comSpuList = [];
        this.comSkuList = [];
        this.comSpuExtList = [];
        this.comAdditionGroupList = [];
        this.comAdditionList = [];
        this.comBoGroupList = [];
        this.comBoList = [];
        this.customerList = [];
        this.custGradeList = [];
        this.handoverhList = [];
        this.salesDetailList = [];
        this.typeOfCarComMap = {};
        this.ComOfCarComMap = {};
        this.salesh = new Salesh();
        this.salesCampaign = new SalesCampaign();
        this.customer = null;
        this.salesCusts = null;
        this.staff = null;
        this.handoverh = null;
        this.salesCampaignList = [];
        this.discount = 100;
        this.salesPayList = [];
        this.salesTable = {};
        this.table = {};
        this.payMentList = [];
        this.cashier = null;
    };




    addDataCache(key: string, value: any) {
        let createdTime = new Date().getTime();
        let data = { data: value, createdTime: createdTime };
        this.dataCache.set(key, data);
    }

    getDataCache(key: string): any {
        let data = this.dataCache.get(key);
        let expireTime = new Date().getTime() - 1 * 60 * 60 * 1000;
        if (data) {
            let value = data.data;
            if (value.createdTime < expireTime) {
                this.dataCache.delete(key);
                return null;
            } else {
                return value;
            }
        } else {
            return data;
        }
    }

    delDataCache(key: string) {
        this.dataCache.delete(key);
    }


}