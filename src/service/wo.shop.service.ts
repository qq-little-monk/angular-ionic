import { Injectable } from '@angular/core';
import { AppShopping } from '../app/app.shopping';
import { UtilProvider } from '../providers/util/util';
import { SalesDetail } from "../domain/salesDetail";
import { AppCache } from '../app/app.cache';
import { Salesh } from '../domain/salesh';
import { ItemSpu } from '../domain/item-spu';
import { ItemSku } from '../domain/item-sku';
import { SpuExt } from '../domain/item-spu-ext';
import { ItemAddition } from '../domain/item-addition';
// import { Store } from '../model/store';
import { SalesCampaign } from '../domain/sales-campaign';
import { HttpProvider } from '../providers/http';
import { HelperService } from '../providers/Helper';
import { SalesDetailDao } from '../dao/salesDeailDao';
import { SalesPay } from '../domain/salesPay';
// import { TableService } from './tableService';
import { Observable } from 'rxjs';
import { LogService } from './logService';
// import { WebSocketService } from './webSocketService';
import { Events, NavController, App } from 'ionic-angular';
import { AppPermission } from '../app/app.permission';
import { SalesCusts } from '../domain/sales-custs';




/*
  Generated class for the WoShopProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
/**
* 点菜宝相关服务及逻辑运算
*/
export class WoShopService {
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
    public logService: LogService,
    // public tableService: TableService,
  ) {
    // this.appCache.store = Store;
    this.appShopping.handoverh = this.appShopping.handoverhList[0];

  }

  /**
    * 组装原始店铺相关数据
    */
  assignmentDataAboutStore(retData) {
    let me = this;
    if (retData.data && retData.data.pos_store) {
      me.appCache.store = retData.data.pos_store; // store店铺赋值
    }
    if (retData.data && retData.data.pos_cashier) {
      me.appShopping.cashier = retData.data.pos_cashier; // staff 员工赋值 
    }
    if (retData.data && retData.data.pos_staff) {
      me.appShopping.staff = retData.data.pos_staff; // staff 员工赋值 
      me.appPer.buildStaffPermissionArray(me.appShopping.staff);
    }
    if (retData.data && retData.data.pos_handoverh) {
      me.appShopping.handoverh = retData.data.pos_handoverh;  // handover 交班赋值
    }
    if (retData.data && retData.data.pos_storeparam) {
      me.appPer.storeParam = retData.data.pos_storeparam;  // 店铺配置信息
      me.appPer.buildstoreParamArray(retData.data.pos_storeparam);
    }
  }

  /**
    * 组装原始商品相关数据
    */
  assignmentData(retData) {
    let me = this;
    // 赋值数据
    //me.appShopping.resetItemData();
    // 商品SPU数据
    if (retData.data.pos_item_spu) {
      me.appShopping.comSpuList = me.appShopping.comOriginalMap.spuList = null;
      me.appShopping.comSpuList = me.appShopping.comOriginalMap.spuList = retData.data.pos_item_spu; // 
      this.orderData(me.appShopping.comSpuList);
      this.events.publish('spu:refresh');
    }
    // 商品SKU数据
    if (retData.data.pos_item_sku) {
      me.appShopping.comSkuList = me.appShopping.comOriginalMap.skuList = null;
      me.appShopping.comSkuList = me.appShopping.comOriginalMap.skuList = retData.data.pos_item_sku;
      this.orderData(me.appShopping.comSkuList);
      this.refreshItem();
      this.events.publish('spu:refresh');
    }
    // 商品分类数据
    if (retData.data.pos_category) {
      me.appShopping.comTypeList = null;
      me.appShopping.comTypeList = retData.data.pos_category;
      this.orderData(me.appShopping.comTypeList);
    }
    // 商品套餐数据
    if (retData.data.pos_item_combo) {
      me.appShopping.comBoList = [];
      me.appShopping.comBoList = retData.data.pos_item_combo;
      this.orderData(me.appShopping.comBoList);
    }
    // 商品套餐组数据
    if (retData.data.pos_item_combo_group) {
      me.appShopping.comBoGroupList = [];
      me.appShopping.comBoGroupList = retData.data.pos_item_combo_group;
      this.orderData(me.appShopping.comBoGroupList);
    }
    // 商品配料组数据
    if (retData.data.pos_item_addition) {
      me.appShopping.comAdditionGroupList = [];
      me.appShopping.comAdditionGroupList = retData.data.pos_item_addition;
      this.orderData(me.appShopping.comAdditionGroupList);
    }
    // 商品配料数据
    if (retData.data.pos_item_addition) {
      me.appShopping.comAdditionList = [];
      me.appShopping.comAdditionList = retData.data.pos_item_addition;
      this.orderData(me.appShopping.comAdditionList);
    }
    // 商品公共口味
    if (retData.data.pos_item_dynamic_attr) {
      me.appShopping.dynamicAttrList = [];
      if (retData.data.pos_item_dynamic_attr.length > 0) {
        retData.data.pos_item_dynamic_attr.forEach(element => {
          if (element.isDelete == '0') {
            me.appShopping.dynamicAttrList.push(element);
          }

        });
      }
      // me.appShopping.dynamicAttrList = retData.data.pos_item_dynamic_attr;
      this.orderData(me.appShopping.dynamicAttrList);
    }
    // 餐台区域数据
    if (retData.data.pos_store_area) {
      me.appShopping.areaList = [];
      me.appShopping.areaList = retData.data.pos_store_area;
      this.orderData(me.appShopping.areaList);
      this.events.publish('area:refresh');
    }
    // 餐台表数据
    if (retData.data.pos_store_table) {
      me.appShopping.tableList = [];
      me.appShopping.tableList = retData.data.pos_store_table;
      me.selectTableOnTable();
      this.events.publish('table:refresh');
    }
    // 餐桌销售数据
    if (retData.data.pos_salestable) {
      me.appShopping.salesTableList = [];
      me.appShopping.salesTableList = retData.data.pos_salestable;
      //初始化table
      me.selectTableOnTable();
      this.events.publish('table:refresh');
    }
    // 支付方式
    if (retData.data.pos_payment) {
      me.appShopping.payMentList = [];
      me.appShopping.payMentList = retData.data.pos_payment;
      this.orderData(me.appShopping.payMentList);
    }

    return true;
  }
  refreshSalesTable(retData) {
    let me = this;
    me.appShopping.salesTableList = retData.pos_salestable;
    me.selectTableOnTable();
  }
  refreshItem() {
    this.appShopping.comSpuList.forEach(comSpu => {
      comSpu.tmpExt = this.selectSpuExtById(comSpu.id);
      comSpu.tmpSkuList = this.selectSkuBySpuId(comSpu.id);
      //默认sku
      if (comSpu.tmpSkuList.length == 1) {
        comSpu.tmpIsDefaultSku = comSpu.tmpSkuList[0];
      } else {
        comSpu.tmpSkuList.forEach(sku => {
          if (sku.isDefault == 1) {
            comSpu.tmpIsDefaultSku = sku;
          }
        });
      }
    });
  }
  orderData(list) {
    // lineNo
    if (list && list.length > 1) {
      if (list && list.length > 0) {
        list.sort(function (m, n) {
          if (m.lineNo > n.lineNo) return 1
          else if (m.lineNo < n.lineNo) return -1
          else return 0
        });
      }
    }
  }
	/**将销售table赋给table
	 * table.tmpSalesTableList = []; 销售tablelist
	 * table.tmpManNumber = 0;    本桌人数
	 * table.tmpPrice = 0;        本桌消费金额 
	 */
  selectTableOnTable() {
    // debugger
    if (this.appShopping.tableList && this.appShopping.tableList.length > 0) {
      this.appShopping.tableList.forEach(table => {
        table.tmpSalesTableList = [];
        table.tmpManNumber = 0;
        table.tmpPrice = 0;
        if (this.appShopping.salesTableList && this.appShopping.salesTableList.length > 0) {
          this.appShopping.salesTableList.forEach(salesTable => {
            if (salesTable.status == '0' && salesTable.isDelete != '1' && salesTable.tableId == table.id) {
              table.tmpSalesTableList.push(JSON.parse(JSON.stringify(salesTable)));
              table.tmpManNumber = this.utilProvider.accAdd(table.tmpManNumber, salesTable.personNum);
              table.tmpPrice = this.utilProvider.accAdd(table.tmpPrice, salesTable.salesAmt);
            }
            //  else {
            //   table.tmpSalesTableList.push(JSON.parse(JSON.stringify(salesTable)));
            //   table.tmpManNumber = this.utilProvider.accSub(table.tmpManNumber, salesTable.personNum);
            //   table.tmpPrice = this.utilProvider.accSub(table.tmpPrice, salesTable.salesAmt);
            // }

          });
        }

        //排序
        let list = table.tmpSalesTableList;
        if (list && list.length > 0) {
          list.sort(function (m, n) {
            if (m.virtualId > n.virtualId) return 1
            else if (m.virtualId < n.virtualId) return -1
            else return 0
          });
        }
      });

      //排序
      let list = this.appShopping.salesTableList;
      if (list && list.length > 0) {
        list.sort(function (m, n) {
          if (m.tableId > n.tableId) return 1
          else if (m.tableId < n.tableId) return -1
          else return 0
        });
      }
    }

    // this.appShopping.tableList=list;
    // console.log('saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    // console.log(this.appShopping.tableList);

  }



  /**spu
    * 判断商品是否可以直接加入购物车
    * hasAddition 是否有配菜： 0-没有 1-有
    * itemType    N:normall普通商品, G: Group组合商品,套餐, S:Service服务
    * specs      
    */
  isSimplCom(comSpu) {
    // let ext = this.selectSpuExtById(comSpu.id);
    if (comSpu.hasAddition == '0' && comSpu.itemType == 'N' && (comSpu.specs == '' || comSpu.specs == null)
      && (comSpu.dynamicAttr == '' || comSpu.dynamicAttr == null || JSON.parse(comSpu.dynamicAttr).length == 0)) {
      return true;
    } else {
      return false;
    }
  }

  /** 
  * 中介者
  * 当购物车发生变化的时候，负责更新搜索列表数量、商品数量、购物车总价
  * 计算购物车总价，需要考虑是本地购物车还是数据库购物车
  * 
  * 根据类型来判断要重新计算哪个
  * type: search : 搜索列表
  *       dish： 商品列表
  *       cart： 购物车总价
  *       all: 所有
 */
  mediator(type: string = 'all') {
    this.getShowCarDetailData();

  }
  /**更新购物车显示页面数据 */
  getShowCarDetailData() {
    let list = this.appShopping.salesDetailList;
    if (list && list.length > 0) {
      list.forEach(item => {
        item['showSalesAmt'] = this.getSalesAmt(item);
        item['showRetailAmt'] = this.getRetailAmt(item);
        item['showIsDiscount'] = this.isDiscount(item);
        item['showIsPresenter'] = this.isDiscount(item) && this.isPresent(item) && !this.isAlreadyPresent(item);
        item['showIsCancelPresenter'] = this.isDiscount(item) && this.isPresent(item) && this.isAlreadyPresent(item);
        item['showPreferentialType'] = this.preferentialType(item);
        if (item['tmpAdditionList'] && item['tmpAdditionList'].length > 0) {
          item['tmpAdditionList'].forEach(add => {
            add.showAddtionAbbreviation == add.itemName + "×" + this.getAdditionNum(add, item)
              + "￥" + this.getAdditionPrice(add, item)
          });
        }
        if (item['tmpGroupeList'] && item['tmpGroupeList'].length > 0) {
          item['tmpGroupeList'].forEach(group => {
            group.showGroupAbbreviation == group.itemName + "×" + this.utilProvider.accDiv(group.salesQty, item.salesQty, 0) + "￥" +
              this.utilProvider.accMul(group.salesPrice, this.utilProvider.accDiv(group.salesQty, item.salesQty, 0))
          });
        }
      })

    }

  }
  /**优惠方式 */
  preferentialType(salesDetail) {
    let Component = this.getOneCampaignBySalesId(salesDetail.id)
    if (Component && Component.id) {
      if (Component.campaignType == '2') {
        return '赠';
      } else if (Component.campaignType == '3') {
        return '折';
      } else if (Component.campaignType == '4') {
        return '改';
      } else if (Component.campaignType == '5') {
        return 'VI';
      }

    } else {
      return false
    }
  }

  /**
    * 添加商品到购物车
    * @param itemSpu; itemSku;comSpuExt  商品
    * @param addNum; 增加数量 默认为 1
    * itemAttr 做法，忌口
    * comAdditionList 加料
    */
  addToCar(data: { itemSpu, itemSku, comSpuExt, itemAttr?: string, additionGroupList?: any[], comboGroupList?: any[] }) {
    let itemSpu = data.itemSpu;
    // let itemSku = data.itemSku;
    // let comSpuExt = data.comSpuExt;
    // let itemAttr = data.itemAttr;
    // let additionGroupList = data.additionGroupList;
    // let comboGroupList = data.comboGroupList;
    /**直接加入购物车 */
    data['addNum'] = itemSpu.minCount ? itemSpu.minCount : 1;
    /**填写数量 */
    if (itemSpu.tmpQty) {
      data['addNum'] = itemSpu.tmpQty
    }
    let com = this.isNew(itemSpu);
    let salesDetail;
    if (com) {//购物车已有商品 直接增加数量
      this.addCom(com, 1);
    } else {
      let changeNum = this.utilProvider.accAdd(this.appShopping.spuOfCarComMap[data.itemSpu.id], data['addNum'])
      if (data.itemSpu.soldoutStatus == '1' && data.itemSpu.soldoutNum != null && changeNum > data.itemSpu.soldoutNum) {//判断是否沽请
        this.http.showToast('商品数量不足！');
        return
      }
      /**整理数据逻辑 */
      let tmpItem = this.buildItem(data);
      // console.log('111111111111111111111111111111111111111111111111111');
      // console.log(tmpItem);

      /**普通商品 规格商品 套餐商品外壳 */
      let salesDetail = JSON.parse(JSON.stringify(tmpItem))
      this.doAddNewComToCar(salesDetail);


      /**加料商品 */
      if (tmpItem.tmpAddList && tmpItem.tmpAddList.length > 0) {
        tmpItem.tmpAddList.forEach(salesDetail => {
          this.doAddNewComToCar(salesDetail);
        });
      }

      /**套餐商品明细 */
      if (tmpItem.tmpComboList && tmpItem.tmpComboList.length > 0) {
        tmpItem.tmpComboList.forEach(salesDetail => {
          this.doAddNewComToCar(salesDetail);
        });
        this.shareGrupuCom(salesDetail);
      }
    }
    this.doOneCustomerDiscounts(salesDetail);
    this.getTypeMap();
    this.doLog();
    this.mediator();
  }

  /**
  * 将已经整理好的购物车商品数据加入购物车
  */
  doAddNewComToCar(item: SalesDetail) {
    if (item.relatedType == 'M') {
      // this.appShopping.salesDetailList.unshift(item);
      this.appShopping.salesDetailList.push(item);
    } else {
      this.appShopping.salesDetailList.push(item);
    }
    this.events.publish('spu:addToCar');
    this.setComByDao(item);
    console.log(this.appShopping.salesDetailList);
    // this.doOneCustomerDiscounts(item);//是否执行会员优惠，或整单折扣
  }


  /**查询Spu商品对应的skuList*/
  selectSkuBySpuId(id) {
    let skuList = [];
    this.appShopping.comSkuList.forEach(sku => {
      if (sku.spuId == id) {
        skuList.push(sku);
      }
    });
    return skuList;
  }

  /**查询Sku商品*/
  selectSkuBySkuId(id) {
    let tmpSku: ItemSku;
    this.appShopping.comSkuList.forEach(sku => {
      if (sku.id == id) {
        tmpSku = sku;
      }
    });
    return tmpSku;
  }

  /**查询Spu商品*/
  selectSpuBySpuId(id) {
    let tmpSpu: ItemSpu;
    this.appShopping.comSpuList.forEach(spu => {
      if (spu.id == id) {
        tmpSpu = spu;
      }
    });
    return tmpSpu;
  }
  /**查询商品扩展表*/
  selectSpuExtById(id) {
    let spuExt = new SpuExt();
    this.appShopping.comSpuExtList.forEach(comSpuExt => {
      if (comSpuExt.id == id) {
        spuExt = comSpuExt
      }
    });
    return spuExt;
  }
  /**
  * 判断商品是否已在购物车中存在，如果有就返回购物车中已存在的商品对象，如果没有返回false
  */
  isNew(item: SalesDetail) {
    let isNew = false;
    let isMerger = this.appCache.Configuration.DP_HB;//是否合并
    if (isMerger) {
      for (let com of this.appShopping.salesDetailList) {
        if (com.spuId == item.id && this.isSimplCom(item)) {
          isNew = true;
          return com
        }
      }

      return isNew;
    } else {
      return isNew;
    }

  }

  /**
* 判断商品是否已点
*/
  isHave(itemSpu) {
    let isHave = false;
    for (let com of this.appShopping.salesDetailList) {
      if (com.spuId == itemSpu.id) {
        if (com.relatedType != "M") {
          return isHave;
        }
        return true;
      }
    }
    return isHave;
  }



  /**
  * 整理商品加入购物车数据结构
  * addNum 起售数量
  */
  buildItem(data: { itemSpu: ItemSpu, itemSku: ItemSku, comSpuExt: SpuExt, addNum?: 1, itemAttr?: string, additionGroupList?, comboGroupList?}) {
    let itemSpu = data.itemSpu;
    let additionGroupList = data.additionGroupList;
    let comboGroupList = data.comboGroupList;

    data['data'] = new Date();
    if (!this.appShopping.salesh || !this.appShopping.salesh.id) {//如果没有销售主单就生成销售单主单
      let salesh = this.appShopping.salesh;
      // console.log(salesh);
      salesh.id = this.utilProvider.getUUID();
      salesh.storeId = this.appCache.store.id;
      salesh.storeName = this.appCache.store.storeName;
      salesh.salesNo = this.utilProvider.transformDatatoString(data['data'], "yyyyMMddHHmmss");
      salesh.salesmanId1 = this.appShopping.staff.id;
      salesh.salesmanCode1 = this.appShopping.staff.staffCode;
      salesh.salesmanName1 = this.appShopping.staff.staffName;
      // salesh.serialNum = data['data'].getTime() + '';
      salesh.cashierId = this.appShopping.cashier.id;
      salesh.cashierCode = this.appShopping.cashier.staffCode;
      salesh.cashierName = this.appShopping.cashier.staffName;
      salesh.createdTime = this.utilProvider.transformDatatoString(data['data'], "yyyy-MM-dd HH:mm:ss");
      salesh.createdBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
      salesh.lastUpdateTime = this.utilProvider.transformDatatoString(data['data'], "yyyy-MM-dd HH:mm:ss");
      salesh.lastUpdateBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
      salesh.status = '0';
      salesh.payStatus = '0';
      salesh.orderType = "N";
      salesh.salesType = "S";
      salesh.ttlDiscAmt = 0;
      salesh.channel = "MB";
      salesh.posType = "M";
      salesh.salesDate = this.appShopping.handoverh.handoverDate;
      salesh.salesTime = this.utilProvider.transformDatatoString(data['data'], "yyyy-MM-dd HH:mm:ss");
      salesh.createdTime = this.utilProvider.transformDatatoString(data['data'], "yyyy-MM-dd HH:mm:ss");
      salesh.salesYear = this.utilProvider.transformDatatoString(data['data'], "yyyy");
      salesh.salesMonth = this.utilProvider.transformDatatoString(data['data'], "yyyy-MM");
      salesh.posId = this.appCache.store.posId;
      salesh.isDelete = '0';
      salesh.handoverId = this.appShopping.handoverh.id;
      salesh.ttlPointValue = '0';
      salesh.mealNo = null;
      salesh.macAddr = this.appCache.macId || '';
      // salesh.storeName
      this.appShopping.salesh = salesh;
    }

    // console.log(itemSpu);
    let itemStatus = '0';
    if (this.appShopping.salesTable.salesId) {
      itemStatus = '1'
    }
    data['salesh'] = this.appShopping.salesh;
    data['itemStatus'] = itemStatus;
    // let salesh = this.appShopping.salesh;

    let tmpItem: any;
    tmpItem = this.getSimperCom(data);
    let tmpAddList = [];
    if (additionGroupList && additionGroupList.length > 0) {
      // tmpItem.tmpAddList = [];//加料商品list 临时字段
      additionGroupList.forEach(additionGroup => {
        additionGroup.additionList.forEach(addition => {
          if (addition.salesQty > 0) {
            tmpAddList.push(this.getAdditionCom(data['salesh'], tmpItem, itemSpu, additionGroup, addition, itemStatus, data['data']));
          }
        });
      });
    }
    let tmpComboList = [];
    let comboCostPrice = 0;
    if (comboGroupList && comboGroupList.length > 0) {
      // tmpItem.tmpComboList = [];//套餐商品list 临时字段
      // tmpItem.costPrice = 0;//套餐商品list 临时字段
      comboGroupList.forEach(comboGroup => {
        comboGroup.comBoList.forEach(comBo => {
          if (comBo.tmpQty > 0) {
            comboCostPrice = this.utilProvider.accAdd(comboCostPrice, this.utilProvider.accMul(comBo.comMap.sku.purchasePrice, comBo.tmpQty));
            comboCostPrice = this.utilProvider.accDiv(comboCostPrice, tmpItem.salesQty);
            tmpComboList.push(this.getComboCom(data['salesh'], tmpItem, data.itemSpu, comboGroup, comBo, itemStatus, data['data']));
          }
        });
      });
    }

    if (tmpAddList.length > 0) {
      tmpItem.tmpAddList = tmpAddList;
    }
    if (tmpComboList.length > 0) {
      tmpItem.tmpComboList = tmpComboList;
      tmpItem.costPrice = comboCostPrice;
    }
    return tmpItem;
  }

  /**主商品 */
  getSimperCom(data: { salesh?: Salesh, itemSpu: any, itemSku: ItemSku, comSpuExt: SpuExt, addNum?, itemAttr?: string, itemStatus?, data?}) {

    let tmpItem = new SalesDetail;
    let orgSalesPrice = data.itemSku ? data.itemSku.retailPrice : 0;

    tmpItem.id = this.utilProvider.getUUID();
    tmpItem.salesId = data.salesh.id;
    tmpItem.salesNo = data.salesh.salesNo;
    tmpItem.lineNo = null;
    tmpItem.salesDate = data.salesh.salesDate;
    tmpItem.parentId = null;
    tmpItem.groupId = null;
    tmpItem.parentSpuId = null;
    tmpItem.parentSpuName = null;
    tmpItem.spuId = data.itemSpu.id;
    tmpItem.spuType = data.itemSpu.itemType;
    tmpItem.spuCode = data.itemSpu.itemCode;
    tmpItem.itemId = data.itemSku ? data.itemSku.id : data.itemSpu.id;
    tmpItem.itemCode = data.itemSku ? data.itemSku.itemCode : data.itemSpu.itemCode;
    tmpItem.itemType = data.itemSpu.itemType;
    tmpItem.relatedType = 'M';
    tmpItem.itemName = data.itemSku ? data.itemSku.itemName : data.itemSpu.itemName;
    tmpItem.spuName = data.itemSpu.itemName;
    tmpItem.itemAttr = data.itemAttr;//商品做法，忌口等
    tmpItem.status = data.salesh.status ? data.salesh.status : 0;
    tmpItem.itemStatus = data.itemStatus;
    tmpItem.specs1 = data.itemSku ? data.itemSku.specs1 : null;
    tmpItem.specs2 = data.itemSku ? data.itemSku.specs2 : null;
    tmpItem.specs3 = data.itemSku ? data.itemSku.specs3 : null;
    tmpItem.specs4 = data.itemSku ? data.itemSku.specs4 : null;
    tmpItem.specs5 = data.itemSku ? data.itemSku.specs5 : null;
    tmpItem.measureFlag = data.itemSpu.measureFlag;
    tmpItem.retailPrice = data.itemSku ? data.itemSku.retailPrice : 0;
    tmpItem.vipPrice = null;
    tmpItem.orgSalesPrice = orgSalesPrice;
    tmpItem.salesPrice = orgSalesPrice;
    tmpItem.itemDiscSalesPrice = orgSalesPrice;
    tmpItem.salesQty = data.addNum;
    // tmpItem.salesAmt = this.utilProvider.accMul(orgSalesPrice, data.addNum);
    tmpItem.ttlDiscAmt = 0;
    tmpItem.deductType = data.itemSpu.deductType || 'N';
    tmpItem.deductValue = data.itemSpu.deductValue || 0;
    tmpItem.salespersonId = this.appShopping.staff.id;
    tmpItem.salespersonCode = this.appShopping.staff.staffCode;
    tmpItem.salespersonName = this.appShopping.staff.staffName;
    tmpItem.cateId = data.itemSpu.cateId;
    tmpItem.cateCode = data.itemSpu.cateCode || null;
    tmpItem.cateName = data.itemSpu.cateName;
    tmpItem.brandId = data.itemSpu.brandId ? data.itemSpu.brandId : '';
    tmpItem.brandCode = data.itemSpu.brandCode || null;
    tmpItem.brandName = data.itemSpu.brandName ? data.itemSpu.brandName : '';
    tmpItem.vendorId = data.itemSpu.vendorId ? data.itemSpu.vendorId : '';
    tmpItem.vendorCode = data.itemSpu.vendorCode || null;
    tmpItem.vendorName = data.itemSpu.vendorName ? data.itemSpu.vendorName : '';
    tmpItem.costPrice = data.itemSku.purchasePrice ? data.itemSku.purchasePrice : 0;
    tmpItem.unitName = data.itemSpu.unitName;
    tmpItem.isDelete = data.itemSku ? data.itemSku.isDelete : data.itemSpu.isDelete;
    tmpItem.returnSalesId = null;
    tmpItem.returnSalesNo = null;
    tmpItem.returnSalesItemId = null;
    tmpItem.createdTime = this.utilProvider.transformDatatoString(data.data, "yyyy-MM-dd HH:mm:ss");
    tmpItem.createdBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
    tmpItem.lastUpdateTime = this.utilProvider.transformDatatoString(data.data, "yyyy-MM-dd HH:mm:ss");
    tmpItem.lastUpdateBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
    tmpItem.sysUpdateTime = null;
    tmpItem.storeId = this.appCache.store.id;
    tmpItem.storeSysCode = this.appCache.store.storeSysCode;
    tmpItem.salesYear = this.utilProvider.transformDatatoString(data.data, "yyyy");
    tmpItem.salesMonth = this.utilProvider.transformDatatoString(data.data, "yyyy-MM");
    tmpItem.salesTime = this.utilProvider.transformDatatoString(data.data, "yyyy-MM-dd HH:mm:ss");
    tmpItem.salesType = data.salesh.salesType;
    tmpItem.orderType = data.salesh.orderType;
    tmpItem.isLabelPrint = data.itemSpu.isLabelPrint;
    tmpItem.pyCode = data.itemSpu.pyCode;
    tmpItem.handoverId = this.appShopping.handoverh.id;
    tmpItem.originIp = null;
    tmpItem.channel = 'MB';
    tmpItem.minCount = data.itemSpu.minCount;
    tmpItem.isStock = data.itemSpu.isStock; // 是否管理库存
    tmpItem.isPoint = data.itemSpu.isPoint; // 商品是否积分
    tmpItem.pointValue = data.itemSku.pointValue;
    tmpItem.soldoutNum = data.itemSpu.soldoutNum || null;
    tmpItem.soldoutStatus = data.itemSpu.soldoutStatus || null;
    tmpItem.isFree = data.itemSpu.isFree || null;
    tmpItem.printerId = data.itemSpu.printerId || null;
    return tmpItem;
  }
  /**
   * 加料商品明细
   * @param salesh 
   * @param parentItem  主商品
   * @param parentSpu 
   * @param additionGroup 
   * @param addition 
   * @param itemStatus 
   * @param data 
   */
  getAdditionCom(salesh: Salesh, parentItem, parentSpu: ItemSpu, additionGroup, addition: ItemAddition, itemStatus, data) {
    let tmpItem = new SalesDetail;
    let orgSalesPrice = addition.price;
    tmpItem.id = this.utilProvider.getUUID();
    tmpItem.salesId = salesh.id;
    tmpItem.salesNo = salesh.salesNo;
    tmpItem.lineNo = null;
    tmpItem.lineNo = null;
    tmpItem.salesDate = salesh.salesDate;
    tmpItem.parentId = parentItem.id;
    tmpItem.groupId = additionGroup.id;
    tmpItem.attrGroupName = additionGroup.groupName;
    tmpItem.parentSpuId = parentSpu.id;
    tmpItem.parentSpuName = parentSpu.itemName;
    tmpItem.spuId = this.utilProvider.getUUID();
    // tmpItem.spuType = itemSpu.itemType;
    tmpItem.itemCode = '123456';
    tmpItem.itemId = addition.id;
    tmpItem.relatedType = 'A';
    tmpItem.itemType = 'A';
    tmpItem.itemName = addition.additionName;
    tmpItem.spuName = addition.additionName;
    tmpItem.status = 0;
    tmpItem.itemStatus = itemStatus;

    // tmpItem.costPrice = data.itemSku.purchasePrice ? data.itemSku.purchasePrice : 0;
    tmpItem.measureFlag = "P";
    tmpItem.retailPrice = addition.price;
    tmpItem.vipPrice = null;
    tmpItem.orgSalesPrice = orgSalesPrice;
    tmpItem.salesPrice = orgSalesPrice;
    tmpItem.itemDiscSalesPrice = orgSalesPrice;
    tmpItem.salesQty = addition['salesQty'];
    // tmpItem.salesAmt = this.utilProvider.accMul(orgSalesPrice, addition['salesQty']);
    tmpItem.ttlDiscAmt = 0;
    tmpItem.deductType = 'N';
    tmpItem.deductValue = 0;
    tmpItem.salespersonId = this.appShopping.staff.id;
    tmpItem.salespersonCode = this.appShopping.staff.staffCode;
    tmpItem.salespersonName = this.appShopping.staff.staffName;
    tmpItem.costPrice = 0;

    tmpItem.isDelete = 0;
    tmpItem.returnSalesId = null;
    tmpItem.returnSalesNo = null;
    tmpItem.returnSalesItemId = null;
    tmpItem.createdTime = this.utilProvider.transformDatatoString(data, "yyyy-MM-dd HH:mm:ss");
    tmpItem.createdBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
    tmpItem.lastUpdateTime = this.utilProvider.transformDatatoString(data, "yyyy-MM-dd HH:mm:ss");
    tmpItem.lastUpdateBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
    //this.utilProvider.getNowTime();
    tmpItem.sysUpdateTime = null;
    tmpItem.storeId = this.appCache.store.id;
    tmpItem.storeSysCode = this.appCache.store.storeSysCode;
    tmpItem.salesYear = this.utilProvider.transformDatatoString(data, "yyyy");
    tmpItem.salesMonth = this.utilProvider.transformDatatoString(data, "yyyy-MM");
    tmpItem.salesTime = this.utilProvider.transformDatatoString(data, "yyyy-MM-dd HH:mm:ss");
    tmpItem.salesType = salesh.salesType;
    tmpItem.orderType = salesh.orderType;
    tmpItem.handoverId = this.appShopping.handoverh.id;
    tmpItem.originIp = null;
    tmpItem.channel = 'MB';

    tmpItem.cateId = 'cb09577cd74d48719e5f76c56bd6a0fd';
    tmpItem.cateCode = '123456';
    tmpItem.cateName = '加料';
    tmpItem.pointValue = 0;
    // tmpItem.isFree=data.itemSpu.isFree || null;
    // tmpItem.soldoutNum=combo.comMap.spu.soldoutNum||null;
    return tmpItem;
  }

  /**
   * 套餐商品明细
   * @param salesh 
   * @param parentItem 主商品
   * @param parentSpu 
   * @param comboGroup 
   * @param combo 
   * @param itemStatus 
   * @param data 
   */
  getComboCom(salesh: Salesh, parentItem, parentSpu: ItemSpu, comboGroup, combo, itemStatus, data) {
    let tmpItem = new SalesDetail;
    let orgSalesPrice = combo.comMap.sku.retailPrice;
    tmpItem.id = this.utilProvider.getUUID();
    tmpItem.salesId = salesh.id;
    tmpItem.salesNo = salesh.salesNo;
    tmpItem.lineNo = null;
    tmpItem.salesDate = salesh.salesDate;
    tmpItem.parentId = parentItem.id;
    tmpItem.groupId = comboGroup['id'];
    tmpItem.parentSpuId = parentSpu.id;
    tmpItem.parentSpuName = parentSpu.itemName;
    tmpItem.spuId = combo.comMap.spu.id;
    tmpItem.spuType = combo.comMap.spu.itemType;
    tmpItem.spuCode = combo.comMap.spu.itemCode;
    tmpItem.itemId = combo.comMap.sku.id;
    tmpItem.itemCode = combo.comMap.sku.itemCode;
    tmpItem.relatedType = 'G';
    tmpItem.itemType = combo.comMap.sku.itemType;
    tmpItem.itemName = combo.comMap.sku.itemName;
    tmpItem.spuName = combo.comMap.sku.itemName;
    // tmpItem.itemAttr = itemAttr;//商品做法，忌口等
    tmpItem.status = 0;
    tmpItem.itemStatus = itemStatus;
    tmpItem.specs1 = combo.comMap.sku.specs1;
    tmpItem.specs2 = combo.comMap.sku.specs2;
    tmpItem.specs3 = combo.comMap.sku.specs3;
    tmpItem.specs4 = combo.comMap.sku.specs4;
    tmpItem.specs5 = combo.comMap.sku.specs5;
    tmpItem.measureFlag = combo.comMap.spu.measureFlag;
    tmpItem.retailPrice = combo.comMap.sku.retailPrice;
    tmpItem.vipPrice = null;
    tmpItem.orgSalesPrice = orgSalesPrice;
    tmpItem.salesPrice = orgSalesPrice;
    tmpItem.itemDiscSalesPrice = orgSalesPrice;
    tmpItem.salesQty = combo.tmpQty;
    // tmpItem.salesAmt = this.utilProvider.accMul(orgSalesPrice, combo.tmpQty);
    // tmpItem.costPrice = data.itemSku.purchasePrice ? data.itemSku.purchasePrice : 0;
    tmpItem.ttlDiscAmt = 0;
    tmpItem.deductType = combo.comMap.spu.deductType || 'N';
    tmpItem.deductValue = combo.comMap.spu.deductValue || 0;
    tmpItem.salespersonId = this.appShopping.staff.id;
    tmpItem.salespersonCode = this.appShopping.staff.staffCode;
    tmpItem.salespersonName = this.appShopping.staff.staffName;
    tmpItem.cateId = combo.comMap.spu.cateId;
    tmpItem.cateCode = null;
    tmpItem.cateName = combo.comMap.spu.cateName;
    tmpItem.brandId = combo.comMap.spu.brandId;
    tmpItem.brandCode = null;
    tmpItem.brandName = combo.comMap.spu.brandName;
    tmpItem.vendorId = combo.comMap.spu.vendorId;
    tmpItem.vendorCode = null;
    tmpItem.vendorName = combo.comMap.spu.vendorName;
    tmpItem.costPrice = combo.comMap.sku.purchasePrice;
    tmpItem.unitName = combo.comMap.spu.unitName;
    tmpItem.isDelete = combo.comMap.sku.isDelete;
    tmpItem.returnSalesId = null;
    tmpItem.returnSalesNo = null;
    tmpItem.returnSalesItemId = null;
    tmpItem.createdTime = this.utilProvider.transformDatatoString(data, "yyyy-MM-dd HH:mm:ss");
    tmpItem.createdBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
    tmpItem.lastUpdateTime = this.utilProvider.transformDatatoString(data, "yyyy-MM-dd HH:mm:ss");
    tmpItem.lastUpdateBy = this.appCache.store.userName + ':' + this.appShopping.staff.staffCode;
    //this.utilProvider.getNowTime();
    tmpItem.sysUpdateTime = null;
    tmpItem.storeId = this.appCache.store.id;
    tmpItem.storeSysCode = this.appCache.store.storeSysCode;
    tmpItem.salesYear = this.utilProvider.transformDatatoString(data, "yyyy");
    tmpItem.salesMonth = this.utilProvider.transformDatatoString(data, "yyyy-MM");
    tmpItem.salesTime = this.utilProvider.transformDatatoString(data, "yyyy-MM-dd HH:mm:ss");
    tmpItem.salesType = salesh.salesType;
    tmpItem.orderType = salesh.orderType;
    tmpItem.isLabelPrint = combo.comMap.spu.isLabelPrint;
    tmpItem.pyCode = combo.comMap.spu.pyCode;
    tmpItem.handoverId = this.appShopping.handoverh.id;
    tmpItem.originIp = null;
    tmpItem.channel = 'MB';
    tmpItem.pointValue = combo.comMap.sku.pointValue;
    tmpItem.isStock = combo.comMap.spu.isStock; // 是否管理库存
    tmpItem.isPoint = combo.comMap.spu.isPoint; // 商品是否积分
    tmpItem.pointValue = combo.comMap.sku.pointValue;
    tmpItem.soldoutNum = combo.comMap.spu.soldoutNum || null;
    tmpItem.soldoutStatus = combo.comMap.spu.soldoutStatus || null;
    tmpItem.isFree = combo.comMap.spu.isFree || null;
    return tmpItem;
  }

  /**
   * 加入购物车中商品数据处理
   * 1，临时字段
   * 2，优惠计算
   * 3，字段赋值
   * 4，价格显示
   * 5，价格还原
   */

  /**
  * 改变购物车主商品数量
  * @param com; 购物车商品
  * @param subNum; 数量
  */
  setCom(com: SalesDetail, subNum: number = 1) {
    let orgQty = com.salesQty;
    let changeNum = this.utilProvider.accAdd(this.appShopping.spuOfCarComMap[com.spuId], this.utilProvider.accSub(subNum, orgQty))
    if (com.soldoutStatus == '1' && com.soldoutNum != null && com.soldoutNum < changeNum) {
      this.http.showToast('商品数量不足！');
      return;
    }
    com.salesQty = Number(subNum);
    if (com.salesAmt && com.salesAmt > 0) {
      com.salesAmt = this.utilProvider.accMul(com.salesPrice, com.salesQty);
    }
    this.updateCampaign(com, orgQty);
    this.setComByDao(com);
    this.changeGroupeOrAddition(com, orgQty);
    this.getTypeMap();

    //执行整单优惠
    this.doOrNotAllSalescampaign();
  }

  /**
  * 增加购物车主商品
  * @param com; 购物车商品
  * @param subNum; 减少数量 默认为 1
  */
  addCom(com: SalesDetail, subNum: number = 1) {
    let orgQty = com.salesQty;
    let num = this.utilProvider.accAdd(orgQty, subNum, 0);
    //判断沽请数量
    let changeNum = this.utilProvider.accAdd(this.appShopping.spuOfCarComMap[com.spuId], subNum)
    if (com.soldoutStatus == '1' && com.soldoutNum != null && com.soldoutNum < changeNum) {
      this.http.showToast('商品数量不足！');
      return;
    }
    com.salesQty = num;
    if (com.salesAmt && com.salesAmt > 0) {
      com.salesAmt = this.utilProvider.accMul(com.salesPrice, com.salesQty);
    }
    this.updateCampaign(com, orgQty);
    this.setComByDao(com);
    this.changeGroupeOrAddition(com, orgQty);
    this.getTypeMap();

    //执行整单优惠
    this.doOrNotAllSalescampaign();
  }

  //   addGroupOrAdition() {
  // if(){}
  //   }

  /**
  * 减少或删除购物车主商品
  * 在非购物车加载的商品显示页面，只有普通商品才能直接减数量
  * 套餐，规格等商品需在购物车缓存数据加载页面才可减少数量
  * @param com; 购物车商品
  * @param subNum; 减少数量 默认为 1
  */
  subToCar(com: SalesDetail, subNum: number = 1) {
    let orgQty = com.salesQty;
    if (orgQty > subNum) {
      com.salesQty = Number(this.utilProvider.accSub(orgQty, subNum, 0));
      if (com.salesAmt && com.salesAmt > 0) {
        com.salesAmt = this.utilProvider.accMul(com.salesPrice, com.salesQty);
      }
      // com.salesAmt = this.utilProvider.accMul(com.salesPrice, com.salesQty);
      this.updateCampaign(com, orgQty);
      this.setComByDao(com);
      this.changeGroupeOrAddition(com, orgQty);
    } else {
      // this.utilProvider.showConfirm('提示', '确认删除').then(pame => {
      //   console.log(pame);
      //   if (pame.res == 'yes') {
      let salesDetail = JSON.parse(JSON.stringify(com));
      salesDetail.salesQty = 0;
      this.doDedel(salesDetail);
      this.sudComByDao(salesDetail);
      // } else {
      //   return;
      // }
      // });
      this.changeGroupeOrAddition(salesDetail, orgQty);
    }

    this.getTypeMap();

    //执行整单优惠
    this.doOrNotAllSalescampaign();
    this.mediator();
  }
  updateCampaign(salesDetail, orgQty) {
    let cam = this.getOneCampaignBySalesId(salesDetail.id);
    let disCount = this.utilProvider.accDiv(salesDetail.salesQty, orgQty);
    cam.salesQty = this.utilProvider.accMul(cam.salesQty, disCount);
    cam.itemQty = cam.salesQty;
    cam.discountAmt = this.utilProvider.accMul(cam.discountAmt, disCount);
  }

  /**加减商品 改变套餐明细，加料明细salesQty */
  changeGroupeOrAddition(salesDetail, orgQty) {

    let discount = this.utilProvider.accDiv(salesDetail.salesQty, orgQty);
    if (salesDetail.salesQty > 0) {
      this.appShopping.salesDetailList.forEach(com => {
        if (com.parentId == salesDetail.id) {
          let orgAddQty = com.salesQty;
          //称重商品加料数量不变
          if (salesDetail.measureFlag != 'Z') {
            com.salesQty = this.utilProvider.accMul(com.salesQty, discount, 0);
            if (com.salesAmt && com.salesAmt > 0) {
              com.salesAmt = this.utilProvider.accMul(com.salesPrice, com.salesQty);
            }
          }
          this.updateCampaign(com, orgAddQty);
          // com.salesAmt = this.utilProvider.accMul(com.salesPrice, com.salesQty);
        }
      });
    } else {
      this.appShopping.salesDetailList.forEach(com => {
        if (com.parentId == salesDetail.id) {
          this.doDedel(com);
        }
      });
    }
  }
  /**删除商品 */
  doDedel(salesDetail) {
    this.appShopping.salesDetailList = this.appShopping.salesDetailList.filter(item => item.id != salesDetail.id);
    this.subOneSalesCampaign(salesDetail);
    this.getTypeMap();
  }


  /** 清空购物车*/
  clearToCar(): Observable<any> {
    // this.appShopping.salesDetailList = [];
    // this.salesDetailDao.clear();
    // this.appShopping.clearOdear();
    // this.getTypeMap();
    return Observable.create(observable => {
      var me = this;
      this.helper.alert('确认清空购物车？', '', () => {
        console.log("清空购物车");
        this.events.publish('cart:claer-shoping-view');
        this.clearToCartSilent();
        observable.next(true);
      }, () => { });
    });


  }
  /**
   * @method {Function} clearToCartSilent 静默清空购物车
   */
  clearToCartSilent(nav?) {
    // debugger
    this.appShopping.clearOdear();
    this.getTypeMap();
    if (nav) {
      nav.popToRoot();
    } else {
      this.app.getActiveNav().popToRoot();
    }

  }


  /** 添加或跟新购物车商品到数据库*/
  setComByDao(com) {
    this.salesDetailDao.set(com);
  }

  /**删除购物车商品到数据库*/
  sudComByDao(com) {
    this.salesDetailDao.delById(com.id);
  }

  /**主商品详情赋值 */
  getDetailList() {
    this.appShopping.salesDetailList.forEach(salesDetail => {
      let arr;
      if (salesDetail.relatedType == 'M') {
        this.getGroupOrAdditionList(salesDetail);
      }

    });
  }

  /**
   * 获取加料商品单个主商品对应的加料商品数量
   * @param salesDetail 
   * @param addition 
   */
  getAdditionNum(addition, salesDetail) {
    if (salesDetail.measureFlag == 'Z') {
      return addition.salesQty;
    } else {
      return this.utilProvider.accDiv(addition.salesQty, salesDetail.salesQty, 0)
    }
  }

  /**
 * 获取加料商品单个主商品对应的加料商品价格
 * @param salesDetail 
 * @param addition 
 */
  getAdditionPrice(addition, salesDetail) {
    if (salesDetail.measureFlag == 'Z') {
      return addition.orgSalesPrice;
    } else {
      return this.utilProvider.accMul(addition.orgSalesPrice, this.utilProvider.accDiv(addition.salesQty, salesDetail.salesQty, 0));
    }
  }
  /**
   * 拿到主商品的加料或分组lest
   * 如果有就直接取
   * 如果没有就生成对应的字段list
   * @isResut 是否重置
   */
  getGroupOrAdditionList(salesDetail, isResut: boolean = true) {
    let data = { additionList: [] = [], groupList: [] = [] };

    if (salesDetail.tmpAdditionList && salesDetail.tmpAdditionList.length > 0 && !isResut) {
      data.additionList = salesDetail.tmpAdditionList;
    } else {
      this.appShopping.salesDetailList.forEach(com => {
        if (salesDetail.itemType != 'G' && com.relatedType == 'A' && com.parentId == salesDetail.id) {
          data.additionList.push(com);
          // debugger;
          // com.lineNo = 10000;
        }
      });
      salesDetail.tmpAdditionList = data.additionList;
    }

    if (salesDetail.tmpGroupeList && salesDetail.tmpGroupeList.length > 0 && !isResut) {
      data.groupList = salesDetail.tmpGroupeList;
    } else {
      this.appShopping.salesDetailList.forEach(com => {
        if (com.relatedType == 'G' && com.parentId == salesDetail.id) {
          data.groupList.push(com);
        }
      });
      salesDetail.tmpGroupeList = data.groupList;
    }
    // console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
    // console.log(data);

    return data;
  }




  /**用于显示相关方法 */

  /**
   * 单条商品原销售价
   * price 单条总金额
   * DiscountPrice 可打折金额
   * unDiscountPrice 不可打折金额
   */
  getOneSalesAmt(salesDetail: SalesDetail) {
    let price = 0;//总金额
    let DiscountPrice = 0;//可打折金额
    let unDiscountPrice = 0;//不可打折金额
    price = salesDetail.retailPrice;
    debugger
    if (salesDetail.itemType == 'G') {
    } else {//规格商品需要加上加料商品价格
      let flag = false;
      // if (this.selectSpuBySpuId(salesDetail.spuId).isAdditionDiscount == '0')//配菜不可打折
      // {
      //   flag = true;
      // }
      this.appShopping.salesDetailList.forEach(com => {
        if (com.parentId == salesDetail.id) {
          if (salesDetail.measureFlag != 'Z') {
            price = this.utilProvider.accAdd(price, this.utilProvider.accDiv(this.utilProvider.accMul(com.retailPrice, com.salesQty), salesDetail.salesQty));
          } else {
            price = this.utilProvider.accAdd(price, this.utilProvider.accMul(com.retailPrice, com.salesQty));
          }

          if (!this.isSalesDetailDiscount(com, true)) {//判断是否可优惠
            if (salesDetail.measureFlag != 'Z') {
              unDiscountPrice = this.utilProvider.accAdd(unDiscountPrice, this.utilProvider.accDiv(this.utilProvider.accMul(com.retailPrice, com.salesQty), salesDetail.salesQty));
            } else {
              unDiscountPrice = this.utilProvider.accAdd(unDiscountPrice, this.utilProvider.accMul(com.retailPrice, com.salesQty));
            }

          }
          // salesDetail.salesAmt = price;
        }
      });
    }
    DiscountPrice = this.utilProvider.accSub(price, unDiscountPrice);
    let data = { price: price, discountPrice: DiscountPrice, unDiscountPrice: unDiscountPrice };
    // console.log(data);
    return data;
  }

  /**单价 */
  getUnitSalesPrice(salesDetail) {
    let price = 0;
    price = salesDetail.salesPrice;

    if (salesDetail.itemType == 'G') {
      // salesDetail.salesAmt = price;
    } else {//规格商品需要加上加料商品价格
      let list = this.getGroupOrAdditionList(salesDetail).additionList;
      if (list.length > 0) {
        list.forEach(com => {
          let unitQty = this.utilProvider.accDiv(com.salesQty, salesDetail.salesQty);
          price = this.utilProvider.accAdd(price, this.utilProvider.accMul(unitQty, com.salesPrice));
          // price = this.utilProvider.accAdd(price, this.utilProvider.accMul(com.salesQty, com.salesPrice));
        });
      }

    }
    return price;
  }

  /**单条商品销售总价 */
  getSalesAmt(salesDetail, isResut: boolean = true) {
    let price = 0;
    if (salesDetail.salesAmt && salesDetail.salesAmt > 0) {
      price = salesDetail.salesAmt
    } else {
      price = this.utilProvider.accMul(salesDetail.salesQty, salesDetail.salesPrice);
    }
    if (salesDetail.itemType == 'G') {
      // salesDetail.salesAmt = price;
    } else {//规格商品需要加上加料商品价格
      let list = this.getGroupOrAdditionList(salesDetail, isResut).additionList;
      if (list.length > 0) {
        list.forEach(com => {
          if (com.salesAmt && com.salesAmt > 0) {
            price = this.utilProvider.accAdd(price, com.salesAmt);
          } else {
            price = price = this.utilProvider.accAdd(price, this.utilProvider.accMul(com.salesQty, com.salesPrice));
          }
          // price = this.utilProvider.accAdd(price, this.utilProvider.accMul(com.salesQty, com.salesPrice));
        });
      }

    }
    return price;
  }
  /**单条商品原总价 */
  getRetailAmt(salesDetail: SalesDetail) {
    let retailPrice = 0;
    retailPrice = this.utilProvider.accMul(salesDetail.salesQty, salesDetail.retailPrice);
    return retailPrice;
  }

  /** 拿到分类对应的购物车商品数量*/
  getTypeMap() {
    this.appShopping.typeOfCarComMap = {};
    this.appShopping.spuOfCarComMap = {};
    this.appShopping.salesDetailList.forEach(com => {
      if (this.appShopping.typeOfCarComMap[com.cateId] && this.appShopping.typeOfCarComMap[com.cateId] > 0) {
        if (!com.parentSpuId) this.appShopping.typeOfCarComMap[com.cateId] = this.utilProvider.accAdd(this.appShopping.typeOfCarComMap[com.cateId], com.salesQty, 0);
      } else {
        if (!com.parentSpuId) this.appShopping.typeOfCarComMap[com.cateId] = com.salesQty;
      }

      if (this.appShopping.spuOfCarComMap[com.spuId] && this.appShopping.spuOfCarComMap[com.spuId] > 0 && com.relatedType == "M") {
        if (!com.parentSpuId) {
          this.appShopping.spuOfCarComMap[com.spuId] = this.utilProvider.accAdd(this.appShopping.spuOfCarComMap[com.spuId], com.salesQty);
        }
      } else {
        if (!com.parentSpuId) {
          this.appShopping.spuOfCarComMap[com.spuId] = com.salesQty;
        }
      }

    });
    // console.log(this.appShopping.typeOfCarComMap);
    console.log(this.appShopping.spuOfCarComMap);
  }
  /** 拿到沽请计算商品数量*/
  getSoudoutCountMap() {

  }

  /**拿到购物车商品总数量
   * 出去套餐和加料明细
  */
  getTotalNum() {
    let num: number = 0;
    this.appShopping.salesDetailList.forEach(com => {
      if (com.parentSpuId) return
      num = this.utilProvider.accAdd(num, com.salesQty, 0);
    });
    return num;
  }

  /**拿到购物车商品原价总金额*/
  getRetalTotalMoney() {
    let Money: number = 0;
    this.appShopping.salesDetailList.forEach(com => {
      //套餐商品明细不参与价格计算
      if (com.relatedType == 'G') return
      Money = this.utilProvider.accAdd(Money, this.utilProvider.accMul(com.salesQty, com.retailPrice));
    });
    return Money;
  }

  /**拿到购物车商品销售总金额*/
  getSalesTotalMoney() {
    // console.log('getSalesTotalMoney');
    let Money: number = 0;
    this.appShopping.salesDetailList.forEach(com => {
      //套餐商品明细不参与价格计算
      if (com.relatedType == "G") return;
      if (com.salesAmt && com.salesAmt > 0) {
        Money = this.utilProvider.accAdd(Money, com.salesAmt);
      } else {
        Money = this.utilProvider.accAdd(Money, this.utilProvider.accMul(com.salesQty, com.salesPrice));
      }
    });
    return Money;
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
    // debugger
    let flag = '0';
    if (!salesDetail) {
      return;
    }
    if (salesDetail && salesDetail.tmpIsDiscount && !isResut) {
      flag = salesDetail.tmpIsDiscount;
    } else if (salesDetail && salesDetail.relatedType == 'M' && this.selectSpuBySpuId(salesDetail.spuId) && this.selectSpuBySpuId(salesDetail.spuId).isDiscount == '1') {
      flag = '1';
    } else if (salesDetail && salesDetail.relatedType == 'G') {//套餐明细

    } else if (salesDetail && salesDetail.relatedType == 'A' && this.selectSpuBySpuId(salesDetail.parentSpuId) && this.selectSpuBySpuId(salesDetail.parentSpuId).isAdditionDiscount == '1') {//加料明细
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
    } else if (salesDetail.relatedType == 'M' && this.selectSpuBySpuId(salesDetail.spuId) && this.selectSpuBySpuId(salesDetail.spuId).isAdditionDiscount == '1') {
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
    let spu = this.selectSpuBySpuId(salesDetail.spuId);
    // console.log(spu);
    if (spu && spu['isDiscount'] == '1') {
      return true;
    } else {
      return false;
    }
  }
  /* 判断商品是否可以执行赠送 */
  isPresent(salesDetail) {
    if (salesDetail.parentId) {
      return false; // 加料明细与套餐明细先不管
    }
    let spu = this.selectSpuBySpuId(salesDetail.spuId);
    if (spu && spu['isFree'] == '1') return true;
    else return false;
  }
  /* 判断商品是否已经执行赠送 */
  isAlreadyPresent(salesDetail) {
    let salesCampaign = this.getOneCampaignBySalesId(salesDetail.id);
    if (salesCampaign && salesCampaign.campaignType == '2' && salesCampaign.isDelete != '1') return true;
    return false;
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
          let sku = this.selectSkuBySkuId(salesDetail.itemId);
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
    this.mediator();
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
        this.subOneSalesCampaign(salesDetail)
      } else {
        this.addOrEiditSalesOneCampaign(salesDetail, campaignData);
      }
      //单品折扣后
      salesDetail.itemDiscSalesPrice = price;
    }
    if (salesDetail.relatedType == 'M') {//主商品
      if (salesDetail.itemType == 'G') {
        this.shareGrupuCom(salesDetail, isAll);
      } else {
        this.shareAdditionComByDiscount(salesDetail, discount, isAll);
      }
    }
    // console.log(this.appShopping.salesDetailList);

    //执行整单优惠
    console.log('12112121212221');
    //执行整单优惠
    if (!isAll) {
      this.doOrNotAllSalescampaign();
    } else {
      this.mediator();
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
      //单品折后价
      salesDetail.itemDiscSalesPrice = price;
    }
    // price = this.doOneComByDiscount(price);
    if (salesDetail.itemType == 'G') {
      this.shareGrupuCom(salesDetail, isAll);
    }

    //执行整单优惠
    if (!isAll) {
      this.doOrNotAllSalescampaign();
    } else {
      this.mediator();
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
  shareGrupuCom(salesDetail: SalesDetail, isAll?) {
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
    this.appShopping.salesDetailList.forEach(item => {
      if (item.parentId == salesDetail.id) {
        totalOrgTotalPrice = this.utilProvider.accAdd(totalOrgTotalPrice, this.utilProvider.accMul(item.orgSalesPrice, item.salesQty));
        grupList.push(item);
      }
    });
    let disCount = this.utilProvider.accDiv(totalSalesPrice, totalOrgTotalPrice, 4);
    grupList.forEach(grupuCom => {
      if (grupList[grupList.length - 1].id == grupuCom.id) {//最后一条
        grupuCom.salesAmt = surplus;
        grupuCom.salesPrice = this.utilProvider.accDiv(grupuCom.salesAmt, grupuCom.salesQty);
        //折扣后
        if (isAll) {

        } else {
          //单品折扣后
          grupuCom.itemDiscSalesPrice = grupuCom.salesPrice;
        }
        // grupuCom.orgSalesPrice=grupuCom.salesPrice;
      } else {
        let price = this.utilProvider.accMul(grupuCom.orgSalesPrice, grupuCom.salesQty);//单个商品原价总金额
        grupuCom.salesAmt = this.utilProvider.accMul(price, disCount);
        // grupuCom.salesAmt = this.utilProvider.accMul(totalSalesPrice, disCount);
        grupuCom.salesPrice = this.utilProvider.accDiv(grupuCom.salesAmt, grupuCom.salesQty);
        if (isAll) {

        } else {
          //单品折扣后
          grupuCom.itemDiscSalesPrice = grupuCom.salesPrice;
        }
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
      let list = this.getGroupOrAdditionList(salesDetail, true).additionList;
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
    let grupList = this.getGroupOrAdditionList(salesDetail).groupList;
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
    }
    this.mediator();
    return;
  
  }

  /**
    * 整单优惠前先执行单品优惠
    * 购物车所有可优惠商品
    */
  doFirstOneCampain(salesDetail) {
    let campaign = new SalesCampaign();
    campaign = this.getOneCampaignBySalesId(salesDetail.id);
    // console.log('qqqqqqqqqqqqqqq');
    // console.log(salesDetail);
    // console.log(campaign);
    // console.log(this.appShopping.salesCampaignList);

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
      this.resutOneCampaign(salesDetail, false, true);
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

        this.doFirstOneCampain(salesDetail);
        if (discount == '100') {
          this.subAllSalesCampaign();
          return;
        }
        originalAmt = this.utilProvider.accAdd(originalAmt, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
        itemQty = this.utilProvider.accAdd(itemQty, this.getGroupQty(salesDetail));
        let orgPrice = salesDetail.salesPrice;
        salesDetail.salesPrice = this.utilProvider.accMul(orgPrice, this.utilProvider.accDiv(discount, 100));
        // salesDetail.salesAmt = this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty);
        if (salesDetail.salesAmt && salesDetail.salesAmt != 0) {
          salesDetail.salesAmt = this.utilProvider.accMul(salesDetail.salesQty, salesDetail.salesPrice);
        }
        if (salesDetail.itemType == 'G') {
          this.shareGrupuCom(salesDetail, true);
        }
        itemRetailAmt = this.utilProvider.accAdd(itemRetailAmt, this.utilProvider.accMul(salesDetail.retailPrice, salesDetail.salesQty));

      } else {
        originalAmt = this.utilProvider.accAdd(originalAmt, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
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
    this.mediator();

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
        this.doFirstOneCampain(salesDetail);//先执行单品优惠
        discountItemList.push(salesDetail);
        //销售价总金额
        salesAmt = this.utilProvider.accAdd(salesAmt, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
        //优惠商品原价总金额
        itemRetailAmt = this.utilProvider.accAdd(itemRetailAmt, this.utilProvider.accMul(salesDetail.retailPrice, salesDetail.salesQty));
        //优惠商品销售价总金额 可优惠金额
        itemSalesAmt = this.utilProvider.accAdd(itemSalesAmt, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty));
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

    this.mediator();
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
      let groupList = this.getGroupOrAdditionList(salesDetail).groupList;
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
    return salesCampaign;
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
    return salesCampaign;
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
    salesCampaign.createdTime = this.utilProvider.transformDatatoString(new Date(), "yyyy-MM-dd HH:mm:ss");
    //this.utilProvider.getNowTime();

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
      // console.log('111111111111111111111' , JSON.stringify(salesDetail) );

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
      // console.log('22222222222222222222' , JSON.stringify(salesDetail) );
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
      if (salesDetail.relatedType != 'G') {
        salesh['itemQty'] = this.utilProvider.accAdd(salesh['itemQty'], salesDetail.salesQty);
        salesh.itemDiscSalesAmt = this.utilProvider.accAdd(salesh.itemDiscSalesAmt, salesDetail.itemDiscSalesAmt);
        // debugger
        salesh.itemDiscAmt = this.utilProvider.accAdd(salesh.itemDiscAmt, salesDetail.itemDiscAmt);
        salesh.itemWholeDiscAmt = this.utilProvider.accAdd(salesh.itemWholeDiscAmt, salesDetail.itemWholeDiscAmt);
        console.log('itemDiscSalesAmt:' + salesh.itemDiscSalesAmt + 'itemDiscAmt:' + salesh.itemDiscAmt + 'itemWholeDiscAmt:' + salesh.itemWholeDiscAmt);
      }
      salesh.salesQty = this.utilProvider.accAdd(salesh.salesQty, salesDetail.salesQty);
      salesh.costAmt = this.utilProvider.accAdd(this.utilProvider.accMul(salesDetail.costPrice, salesDetail.salesQty), salesh.costAmt);
      if (salesDetail.relatedType != "G") {
        salesDetail.ttlDiscAmt = this.utilProvider.accSub(this.utilProvider.accMul(salesDetail.orgSalesPrice, salesDetail.salesQty), salesDetail.salesAmt);
      }
      //d
      if (salesDetail.itemType == 'G' && salesDetail.ttlDiscAmt && salesDetail.ttlDiscAmt != 0) {
        // let list = this.getGroupOrAdditionList(salesDetail).groupList;
        let disCount = this.utilProvider.accDiv(salesDetail.ttlDiscAmt, this.utilProvider.accMul(salesDetail.salesPrice, salesDetail.salesQty), 4);
        let surplus = salesDetail.ttlDiscAmt;
        let disSurplus = salesDetail.itemDiscAmt;
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
      if (!salesDetail.parentId) {
        this.getGroupOrAdditionList(salesDetail);
      }
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
    this.doLog();
  }

  /**取消单品优惠 */
  resutOneCampaign(salesDetail, needCyclic?, isAll: boolean = false) {
    if (salesDetail.relatedType == 'G') {//套餐明细排除
      return;
    }
    this.doOneChargeMoney(salesDetail, salesDetail.orgSalesPrice, '', isAll, false);
    if (needCyclic) {
      this.appShopping.salesDetailList.forEach(addtion => {
        if (addtion.parentId == salesDetail.id) {
          this.doOneChargeMoney(addtion, addtion.orgSalesPrice, isAll, false);
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
  buildSalesPay(payMent, price, changeFlag: number = 0,) {
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
    salesPay.createdTime = this.utilProvider.transformDatatoString(new Date(), "yyyy-MM-dd HH:mm:ss");
    //this.utilProvider.getNowTime();
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

  //购物车数据变化
  onCarDataChange() {

  }


  doLog(data?: {}) {
    let msg;
    msg = '购物车详情:' + JSON.stringify(this.appShopping.salesDetailList) + '优惠单详情:' + JSON.stringify(this.appShopping.salesCampaignList) + '销售单' + JSON.stringify(this.appShopping.salesh);
    console.log('购物车详情:');
    console.log(this.appShopping.salesDetailList);
    console.log('优惠单详情:');
    console.log(this.appShopping.salesCampaignList);
    console.log('销售单');
    console.log(this.appShopping.salesh);
    console.log('this.appShopping.salesCusts', this.appShopping.salesCusts);
    console.log(data);
    this.logService.upLogData(msg);
  }
}
