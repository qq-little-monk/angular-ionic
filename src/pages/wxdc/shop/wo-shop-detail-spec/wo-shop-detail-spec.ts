import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AppShopping } from '../../../../app/app.shopping';
import { WoShopService } from '../../../../service/wo.shop.service';
import { HttpProvider } from '../../../../providers/http';
import { UtilProvider } from '../../../../providers/util/util';
import { SalesDetail } from '../../../../domain/salesDetail';
import { SetSalesDetailNumberPage } from '../setSalesDetailNumber/setSalesDetailNumber';

/**
 * Generated class for the WoShopDetailSpecPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-wo-shop-detail-spec',
  templateUrl: 'wo-shop-detail-spec.html',
})

export class WoShopDetailSpecPage {

  comSpu: any = {};
  /** sku*/
  comSku: any = {};
  /** spu商品扩展*/
  comSpuExt: {} = {};
  /**
  * 做法，忌口
  * dynamicAttrList[].allAttr[].isckeckd true为选中
  */
  dynamicAttrList: any[] = [];


  itemAttr: string = '';

  /** 规格商品对应的skulist*/
  specsSkuList: any[] = [];

  /**选中的规格商品*/
  checkedSpecsSku: {} = {};


  /** 加料商品组*/
  additionGroupList: any[] = [];

  /**套餐商品组*/
  comBoGroupList: any[] = [];
  hasAddition;

  /**选中的套餐商品list商品*/
  checkedComBoList: any[] = [];
  /**查看加入购物车商品明细 */
  salesDetail: any;

  //是否大屏模式
  isShowSlab:boolean=false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appShopping: AppShopping,
    public woShopService: WoShopService,
    public viewCtrl: ViewController,
    public httpProvider: HttpProvider,
    public modalCtrl: ModalController,
    public utilProvider: UtilProvider,
  ) {

  }

  close() {
    this.viewCtrl.dismiss();
  }
  result() {
    this.comSpu = {};
    this.comSpuExt = {};
    this.dynamicAttrList = [];
    this.itemAttr = '';
    this.specsSkuList = [];
    this.checkedSpecsSku = {};
    this.additionGroupList = [];
    this.comBoGroupList = [];
  }
  ionViewDidLoad() {
    this.comSpu = JSON.parse(this.navParams.get('comSpu'));
    this.resultComSpu();
  }

  ionViewWillEnter() {
    this.isShowSlab=this.navParams.get('isShowSlab');

    if (this.navParams.get('salesDetail')) {
      this.salesDetail = this.navParams.get('salesDetail');
      this.backShow(this.salesDetail);
    }
    if (this.comSpu.tmpQty && this.comSpu.tmpQty >= this.comSpu.minCount) {
      return;
    }
    else if (this.comSpu.minCount && this.comSpu.minCount > 1) {
      this.comSpu.tmpQty = this.comSpu.minCount;
    } else {
      this.comSpu.tmpQty = 1;
    }
  }
  ionViewDidLeave() {

  }

  /**回显 */
  backShow(salesDetail: SalesDetail) {
    //规格
    this.checkedSpecsSku = this.woShopService.selectSkuBySkuId(salesDetail.itemId);
    //套餐
    this.comBoGroupList.forEach(comBoGroup => {
      comBoGroup.comBoList.forEach(comBo => {
        let list = this.woShopService.getGroupOrAdditionList(salesDetail).groupList;
        comBo.tmpQty = 0;
        list.forEach(com => {
          if (comBo.comMap.sku.id == com.itemId && comBoGroup.id == com.groupId) {
            comBo.tmpQty = com.salesQty / salesDetail.salesQty;
            return;
          }
        });

      });
    })
    //口味 做法
    if (salesDetail.itemAttr && salesDetail.itemAttr.length > 0) {
      this.dynamicAttrList.forEach(attrGroup => {
        attrGroup.allAttr.forEach(dynamic => {
          if (salesDetail.itemAttr.indexOf(dynamic.value) > -1) {
            dynamic.isckeckd = true;
          }

        });
      });
    }

    //加料
    this.additionGroupList.forEach(additionGroup => {
      additionGroup.additionList.forEach(comAddition => {
        let list = this.woShopService.getGroupOrAdditionList(salesDetail).additionList;
        comAddition.salesQty = 0;
        list.forEach(com => {
          if (comAddition.id == com.itemId && additionGroup.id == com.groupId) {
            if (this.comSpu.measureFlag != 'Z') {
              comAddition.salesQty = com.salesQty / salesDetail.salesQty;
            } else {
              comAddition.salesQty = com.salesQty;
            }

            return;
          }
        });

      });
    });


  }

  addComSpu(comSpu) {
    comSpu.tmpQty = this.utilProvider.accAdd(comSpu.tmpQty, 1, 0);
  }

  subComSpu(comSpu) {
    if (comSpu.tmpQty <= comSpu.minCount || comSpu.tmpQty <= 0) {
      this.httpProvider.showToast('不可小于起售份数');
      return;
    } else {
      comSpu.tmpQty = comSpu.tmpQty - 1;
    }
  }

  setNumberComSpu(comSpu) {
    let item = { number: comSpu.tmpQty, isClear: true }
    let modal = this.modalCtrl.create(SetSalesDetailNumberPage, { salesDetail: comSpu, item: item }, {
      cssClass: 'custom-modal2'
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.flag) {
        if (data.data < comSpu.minCount || data.data <= 0) {
          this.httpProvider.showToast('不可小于起售份数');
          return;
        } else {
          this.comSpu.tmpQty = Number(data.data);
        }
      } else {
        return;
      }
    });
  }


  /**
  * spu中要加入购物车商品初始化
  */
  resultComSpu() {
    this.selectSpuExtById(this.comSpu.id);
    //this.comSpu.specs && this.comSpu.specs != '' && this.comSpu.specs != null
    if (true) {//是否有规格
      this.specsSkuList = this.selectSkuListBySpuId(this.comSpu.id);
      this.specsSkuList.forEach(sku => {
        if (sku.isDefault == 1) {
          this.checkedSpecsSku = sku;
        }
      });

    }
    if (this.comSpu.hasAddition == '1') {//是否有加料
      this.additionGroupList = this.selectAdditionGroupListBySpuId(this.comSpu.id);
      console.log(this.additionGroupList);
    }
    if (this.comSpu.itemType == 'G') {//是否有套餐
      this.selectSkuExtById(this.comSpu.id);

      this.comBoGroupList = this.selectComBoGroupListBySpuId(this.comSpu.id);
      this.comBoGroupList.forEach(comBoGroup => {
        if (comBoGroup.isFixedNum == '1') {//固定数量组 0-不固定 1-固定
          comBoGroup.comBoList.forEach(comBo => {
            comBo.tmpQty = comBo.mustNum;//选中套餐组商品数量
          });
        }
      });
      console.log(this.comBoGroupList);
    }
  }

  /**
  * 查询套餐商品sku
  */
  selectSkuExtById(id) {
    this.appShopping.comSkuList.forEach(comSku => {
      if (comSku.spuId == id) {
        this.comSku = JSON.parse(JSON.stringify(comSku));
        console.log(this.dynamicAttrList);
        return;
      }
    });
  }

  /**
  * 查询商品扩展表
  */
  selectSpuExtById(id) {
    // this.appShopping.comSpuExtList.forEach(comSpuExt => {
    //   if (comSpuExt.id == id) {
    //     this.comSpuExt = comSpuExt;
    //dynamicAttrList 做法，忌口
    if (this.comSpu.dynamicAttr && this.comSpu.dynamicAttr.length > 0) {
      this.dynamicAttrList = JSON.parse(this.comSpu.dynamicAttr);
    }
    console.log(this.dynamicAttrList);
    return;
    //   }
    // });
  }
  /**
  * 选择商品做法，忌口
  * 
  */
  selectDynamic(attrGroupName, dynamic) {
    if (dynamic.isckeckd) {
      dynamic.isckeckd = false;
    } else {
      dynamic.isckeckd = true;
    }

  }


  /**
  * 查询规格商品对应的skulist
  */
  selectSkuListBySpuId(id) {
    let list = [];
    this.appShopping.comSkuList.forEach(sku => {
      if (sku.spuId == id) {
        list.push(sku)
      }
    });
    return list;
  }
  /**
  * 选择规格商品
  */
  selectSku(comsku) {
    this.checkedSpecsSku = comsku;
  }


  /**
* 查询”加料“商品对应的list组
*/
  selectAdditionGroupListBySpuId(id) {
    let gropList = [];
    this.appShopping.comAdditionGroupList.forEach(additionGroup => {
      if (additionGroup.refSpuId == id) {
        gropList.push(JSON.parse(JSON.stringify(additionGroup)));
      }
    });

    return gropList;
  }

  // /**
  // * 查询”加料“商品对应的list组
  // */
  // selectAdditionGroupListBySpuId(id) {
  //   let gropList = [];
  //   this.appShopping.comAdditionGroupList.forEach(additionGroup => {
  //     // console.log(id);
  //     // console.log(additionGroup);
  //     if (additionGroup.refSpuId == id) {
  //       // console.log(additionGroup);
  //       additionGroup.additionList = JSON.parse(JSON.stringify(this.selectAdditionListByGroupId(additionGroup.id)));//根据分组id拿到分组明细
  //       gropList.push(additionGroup)
  //     }
  //   });
  //   return gropList;
  // }

  // /**
  // * 查询”加料“组对应的明细
  // */
  // selectAdditionListByGroupId(id) {
  //   let List = [];
  //   this.appShopping.comAdditionList.forEach(addition => {
  //     if (addition.groupId == id) {
  //       List.push(JSON.parse(JSON.stringify(addition)))
  //     }
  //   });
  //   return List;
  // }

  /**
  * 查询'套餐'商品对应的list组
  */
  selectComBoGroupListBySpuId(id) {
    let gropList = [];
    this.appShopping.comBoGroupList.forEach(comBoGroup => {
      // console.log(id);
      // console.log(comBoGroup);
      if (comBoGroup.refSpuId == id) {
        // console.log(comBoGroup);
        comBoGroup.comBoList = JSON.parse(JSON.stringify(this.selectComBoListByGroupId(comBoGroup.id)));//根据分组id拿到套餐明细
        gropList.push(comBoGroup)
      }
    });
    return gropList;
  }
  /**
  * 查询'套餐'组对应的明细
  */
  selectComBoListByGroupId(id) {
    let List = [];
    this.appShopping.comBoList.forEach(comBo => {
      if (comBo.groupId == id) {
        comBo.comMap = this.selectComBoSpuAndSku(comBo);
        let tmp = JSON.parse(JSON.stringify(comBo))
        List.push(tmp)
      }
    });
    return List;
  }
  /**
  * 查询'套餐'明细对应spu/sku/ext商品
  */
  selectComBoSpuAndSku(comBo) {
    let comMap = { spu: {}, sku: {}, ext: {} };
    this.appShopping.comSpuExtList.forEach(ext => {
      if (ext.id == comBo.spuId) {
        comMap.ext = ext;
      }
    });
    this.appShopping.comSpuList.forEach(comSpu => {
      if (comSpu.id == comBo.spuId) {
        comMap.spu = comSpu;
      }
    }); 
    this.appShopping.comSkuList.forEach(comSku => {
      if (comSku.id == comBo.itemId) {
        comMap.sku = comSku;
      }
    });
    return comMap;
  }
  /**
  * 选择套餐明细商品
  */
  selectComBo(comBoGroup, comBo) {
    let num = 1;
    // comBoGroup.canDuplicate 是否可重复选 0-否 1-是
    // comBoGroup.mustNum 必选数量
    let mustNum = 0
    comBoGroup.comBoList.forEach(comBo => {
      mustNum = this.utilProvider.accAdd(comBo.tmpQty ? comBo.tmpQty : 0, mustNum, 0);
    });
    if (mustNum >= comBoGroup.mustNum) {//检查是否达到该分组的最大数量
      this.httpProvider.showToast('该分组选择完成');
      return;
    }
    if (comBo.tmpQty > 0) {//增加数量
      if (comBoGroup.canDuplicate == '0') {
        this.httpProvider.showToast('该分组不允许重复选择商品');
        return;
      } else {
        comBo.tmpQty = this.utilProvider.accAdd(comBo.tmpQty, num, 0)
      }

    } else {
      comBo.tmpQty = num;
    }
  }
  isCanAdd(comBoGroup, comBo) {
    let mustNum = 0
    comBoGroup.comBoList.forEach(comBo => {
      mustNum = this.utilProvider.accAdd(comBo.tmpQty, mustNum, 0);
      comBoGroup.tmpMustNum = mustNum;
    });
    if (comBo.tmpQty > 0) {
      return true;
    }
    else if (comBoGroup.canDuplicate == '0' && comBo.tmpQty > 0) {
      return false;
    }
    else if (mustNum >= comBoGroup.mustNum) {//检查是否达到该分组的最大数量
      return false;
    } else {
      return true;
    }
  }
  subComBo(comBo) {
    let num = 1;
    if (comBo.tmpQty >= num) {
      comBo.tmpQty = this.utilProvider.accSub(comBo.tmpQty, num, 0);
    } else {
      comBo.tmpQty = 0;
    }
  }
  addToCar() {
    // console.log('111111111111111111');
    // console.log(this.additionGroupList);

    if (!this.checkout()) return;

    if (this.comSpu.itemType == 'G') {
      this.addGroupComToCar();
    } else {
      this.addSpecesComToCar();
    }
    setTimeout(() => {
      this.close();
    }, 200);
  }
  /**
 * 校验是否可以加入购物车
 */
  checkout() {
    if (this.specsSkuList.length > 0) {
      if (!this.checkedSpecsSku['id']) {
        this.httpProvider.showToast('请选择商品规格');
        return false;
      }
    }

    this.comBoGroupList.forEach(comBoGroup => {
      comBoGroup.tmpMustNum = 0;
      comBoGroup.comBoList.forEach(comBo => {
        comBoGroup.tmpMustNum = this.utilProvider.accAdd(comBoGroup.tmpMustNum, comBo.tmpQty, 0);
      });
    });
    for (let comBoGroup of this.comBoGroupList) {
      if (comBoGroup.tmpMustNum < comBoGroup.mustNum) {
        this.httpProvider.showToast('套餐组' + comBoGroup.comboName + '未完成选择');
        return false;
      }

    }
    return true;
  }
  /**商品属性 做法，忌口 */
  getItemAttr() {
    // let itemAttr: string;
    let itemAttr: any = {};
    if (!this.dynamicAttrList || this.dynamicAttrList.length == 0) return itemAttr
    this.dynamicAttrList.forEach(attrGroup => {
      if (attrGroup.allAttr.length == 0) return itemAttr
      attrGroup.allAttr.forEach(dynamic => {
        if (dynamic.isckeckd) {
          if (!itemAttr || !itemAttr[attrGroup.attrGroupName]) {
            itemAttr[attrGroup.attrGroupName] = dynamic.value;
          } else {
            itemAttr[attrGroup.attrGroupName] = itemAttr[attrGroup.attrGroupName] + ',' + dynamic.value;
          }

          // if (!itemAttr) {
          //   itemAttr = attrGroup.attrGroupName + ':' + dynamic.value
          // } else {
          //   if (itemAttr.indexOf(attrGroup.attrGroupName) > -1) {
          //     itemAttr = itemAttr + ',' + dynamic.value
          //   } else {
          //     itemAttr = itemAttr + ',' + attrGroup.attrGroupName + ':' + dynamic.value;
          //   }
          // }
        }
      });
    });
    console.log('11111111111111111111111111111111');
    console.log(itemAttr);
    return itemAttr;
    // return JSON.stringify(itemAttr);
  }

  getTotalReterPrice() {
    let price: number = 0;
    let additionPrice: number = 0;
    let spuPrice: number = 0;

    if (this.comSpu.itemType == 'G') {
      spuPrice = this.comSku['retailPrice'];
      price = this.utilProvider.accAdd(this.comSku['retailPrice'], price);
      if (this.comBoGroupList.length > 0) {
        this.comBoGroupList.forEach(comBoGroup => {
          comBoGroup.comBoList.forEach(comBo => {
            price = this.utilProvider.accAdd(this.utilProvider.accMul(comBo.increasePrice, comBo.tmpQty), price);
          });
        });
      }
    } else {
      spuPrice = this.checkedSpecsSku['retailPrice'];
      price = this.utilProvider.accAdd(this.checkedSpecsSku['retailPrice'], price);
      if (this.additionGroupList.length > 0) {
        this.additionGroupList.forEach(additionGroup => {
          additionGroup.additionList.forEach(comAddition => {
            let additionOne = this.utilProvider.accMul(comAddition.price, comAddition.salesQty);
            additionPrice = this.utilProvider.accAdd(additionPrice, additionOne);
            price = this.utilProvider.accAdd(additionOne, price);
          });
        });
      }
    }

    if (this.comSpu.measureFlag != 'Z') {//非计重商品
      price = this.utilProvider.accMul(price, this.comSpu.tmpQty);
    } else {//计重商品
      // price=0;
      price = this.utilProvider.accMul(spuPrice, this.comSpu.tmpQty);
      price = this.utilProvider.accAdd(price, additionPrice);
    }

    return price;
  }

  getTotalSalesPrice() {
    let price: number = 0;
    let additionPrice: number = 0;
    let spuPrice: number = 0;
    if (this.comSpu.itemType == 'G') {
      spuPrice = this.comSku['retailPrice'];
      price = this.utilProvider.accAdd(this.comSku['retailPrice'], price);
      if (this.comBoGroupList.length > 0) {
        this.comBoGroupList.forEach(comBoGroup => {
          comBoGroup.comBoList.forEach(comBo => {
            price = this.utilProvider.accAdd(this.utilProvider.accMul(comBo.increasePrice, comBo.tmpQty), price);
          });
        });
      }
    } else {
      spuPrice = this.checkedSpecsSku['retailPrice'];
      price = this.utilProvider.accAdd(this.checkedSpecsSku['retailPrice'], price);
      if (this.additionGroupList.length > 0) {
        this.additionGroupList.forEach(additionGroup => {
          additionGroup.additionList.forEach(comAddition => {
            let additionOne = this.utilProvider.accMul(comAddition.price, comAddition.salesQty);
            additionPrice = this.utilProvider.accAdd(additionPrice, additionOne);
            price = this.utilProvider.accAdd(additionOne, price);
          });
        });
      }
    }
    if (this.comSpu.measureFlag != 'Z') {//非计重商品
      price = this.utilProvider.accMul(price, this.comSpu.tmpQty);
    } else {//计重商品
      price = 0;
      price = this.utilProvider.accMul(spuPrice, this.comSpu.tmpQty);
      price = this.utilProvider.accAdd(price, additionPrice);
    }
    return price;
  }
  // if (this.comSpu.measureFlag != 'Z') {

  /**
 * 加入‘规格商品’到购物车，包括规格，做法，加料
 */
  addSpecesComToCar() {
    let num = this.comSpu.tmpQty;
    let additionGroupList = JSON.parse(JSON.stringify(this.additionGroupList));
    let itemAttr = '';
    // console.log(this.additionGroupList);

    if (additionGroupList && additionGroupList.length > 0) {
      /**cy */
      additionGroupList.forEach(group => {
        group.additionList.forEach(item => {
          if (this.comSpu.measureFlag != 'Z') {
            item.salesQty = this.utilProvider.accMul(item.salesQty, num);
          } else {
            item.salesQty = item.salesQty;
          }

        });

      });
    }
    itemAttr = this.getItemAttr();
    let data = {
      itemSpu: this.comSpu,
      itemSku: this.checkedSpecsSku,
      comSpuExt: this.comSpuExt,
      itemAttr: JSON.stringify(itemAttr),
      additionGroupList: additionGroupList,
      // comboGroupList: null
    }
    this.woShopService.addToCar(data);
  }

  /**
  * 加入‘套餐商品’到购物车
  */
  addGroupComToCar() {
    let comSku = JSON.parse(JSON.stringify(this.comSku));
    let comBoGroupList = JSON.parse(JSON.stringify(this.comBoGroupList));
    let num = this.comSpu.tmpQty;
    //将加价商品加价到套餐上
    comSku['retailPrice'] = this.utilProvider.accDiv(this.getTotalReterPrice(), num);
    comBoGroupList.forEach(group => {
      group.comBoList.forEach(item => {
        item.tmpQty = this.utilProvider.accMul(item.tmpQty, num)
      });
    });
    let data = {
      itemSpu: this.comSpu,
      itemSku: comSku,
      comSpuExt: this.comSpuExt,
      // itemAttr: null,
      // additionGroupList: null,
      comboGroupList: comBoGroupList,
    }
    data = JSON.parse(JSON.stringify(data));
    this.woShopService.addToCar(data);
  }







}
