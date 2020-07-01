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
  selector: 'page-editTaste',
  templateUrl: 'editTaste.html',
})

export class EditTastePage {
  /**
  * 做法，忌口
  * dynamicAttrList[].allAttr[].isckeckd true为选中
  */
  dynamicAttrList: any[] = [];
  itemAttr: string = '';
  salesDetail: any;


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
    this.dynamicAttrList = [];
    this.itemAttr = '';
  }
  ionViewDidLoad() {
    this.salesDetail = this.navParams.get('salesDetail');
  }

  ionViewWillEnter() {
    if (this.navParams.get('salesDetail')) {
      this.salesDetail = this.navParams.get('salesDetail');
      this.backShow(this.salesDetail);
    }
    this.selectSpuExtById(this.salesDetail.spuId);
    this.addComAttr();
    this.backShow(this.salesDetail);
  }
  ionViewDidLeave() {

  }
  /**
   * 查询商品扩展表
   */
  selectSpuExtById(id) {
    this.appShopping.comSpuList.forEach(comSpuExt => {
      if (comSpuExt.id == id) {
        let tmpComSpuExt = comSpuExt;
        // dynamicAttrList 做法，忌口
        // this.dynamicAttrList = JSON.parse(this.comSpu.dynamicAttr);
        this.dynamicAttrList = tmpComSpuExt.dynamicAttr ? JSON.parse(tmpComSpuExt.dynamicAttr) : [];
        console.log(this.dynamicAttrList);
        return;
      }
    });
  }

  //添加公共口味
  addComAttr() {
    let list = this.appShopping.dynamicAttrList;
    if (list && list.length > 0) {
      for (let gop of list) {
		// 踢除被删除的口味
		if(1===gop.isDelete||"1"===gop.isDelete) continue;
        let allAttr = gop.allAttr;
        if (typeof allAttr === "object") {
          gop.allAttr = allAttr;
        } else {
          gop.allAttr = JSON.parse(allAttr);
        }
        // console.log(gop);
        if (this.dynamicAttrList) {
          if (!this.isHaveGroup(gop)) {
            this.dynamicAttrList.push(JSON.parse(JSON.stringify(gop)));
          }

        } else {
          this.dynamicAttrList = [];
          this.dynamicAttrList.push(JSON.parse(JSON.stringify(gop)));
        }

      }
    }
  }
  isHaveGroup(gop) {
    for (let item of this.dynamicAttrList) {
      if (item.attrGroupName == gop.attrGroupName) {
        return true;
      }
    }
    return false;
  }

  /**回显 */
  backShow(salesDetail: SalesDetail) {
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
        }
      });
    });
    console.log('11111111111111111111111111111111');
    console.log(itemAttr);
    return itemAttr;
    // return JSON.stringify(itemAttr);
  }

  edit() {
    let itemAttr = this.getItemAttr();
    this.salesDetail.itemAttr = JSON.stringify(itemAttr);
    console.log(this.salesDetail);

    this.viewCtrl.dismiss();
  }
}
