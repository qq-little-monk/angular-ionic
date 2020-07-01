import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Events, ActionSheetController, AlertController } from 'ionic-angular';
import { AppShopping } from '../../../../app/app.shopping';
import { WoShopService } from '../../../../service/wo.shop.service';
import { SalesDetail } from '../../../../domain/salesDetail';
import { UtilProvider } from '../../../../providers/util/util';
import { HttpProvider } from '../../../../providers/http';
import { TableService } from '../../../../service/tableService';
import { WebSocketService } from '../../../../service/webSocketService';
import { AppPermission } from '../../../../app/app.permission';
import { WoShopDetailSpecPage } from '../wo-shop-detail-spec/wo-shop-detail-spec';
import { SetSalesDetailNumberPage } from '../setSalesDetailNumber/setSalesDetailNumber';
import { DiscountKeyboardPage } from '../discountkeyboard/discountkeyboard';
import { EditTastePage } from '../editTaste/editTaste';
import { ReturnStatement } from '@angular/compiler';

/**
 * Generated class for the WoShopDetailSpecPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-wo-shop-detail-car',
  templateUrl: 'wo-shop-detail-car.html',
})
export class WoShopDetailCarPage {

  dish: {} = {};
  isShowDiscount: boolean = false;
  isAddItem: boolean = false;
  // comList:any[]=[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appShopping: AppShopping,
    public modalCtrl: ModalController,
    public woShopServices: WoShopService,
    public utilProvider: UtilProvider,
    public http: HttpProvider,
    public actionSheetCtrl: ActionSheetController,
    public tableService: TableService,
    public webSocketService: WebSocketService,
    public appPer: AppPermission,
    public alertCtrl: AlertController,
    public events: Events,
    public viewCtrl: ViewController) {
  }

  close() {
    this.viewCtrl.dismiss();
  }
  ionViewWillEnter() {
    this.isShowDiscount = this.appPer.staffPermission('1501') || this.appPer.staffPermission('1502');
    this.woShopServices.getShowCarDetailData();
    // this.comList = this.appShopping.salesDetailList;
    this.woShopServices.getDetailList();
    if (this.navParams.get('navCtrl')) {
      this.navCtrl = this.navParams.get('navCtrl');
    }

    //监听餐桌强制占用事件
    this.tableService.alertCtrlShow = false;
    this.events.subscribe('cart:claer-shoping-view', (EventData) => {
      console.log("监听清空购物车事件：cart:claer-shoping-view")
      var salesData = {
        salesTable: this.appShopping.salesTable,
        salesh: this.appShopping.salesh,
      };
      if (this.appShopping.salesTable.salesId) {
        this.webSocketService.sendObserveMessage("RETURNTABLEVIEW", salesData, { content: '正在返回...', isShowing: false }).subscribe(function () { });
        this.appShopping.clearOdear();
      }
    });
  }
  ionViewWillLeave() {
    this.events.unsubscribe('cart:claer-shoping-view');
    console.log("移除监听：cart:claer-shoping-view")
  }
  ionViewDidLoad() {
    // setTimeout(() => {
    //   document.getElementById('specMask').className = 'show'
    // }, 100);
  }

  /**单条商品销售价 */
  getSalesAmt(salesDetail) {
    salesDetail.salesAmt = this.utilProvider.accMul(salesDetail.salesQty, salesDetail.salesPrice);
    return salesDetail.salesAmt;
  }
  /**单条商品原价 */
  getRetailAmt(salesDetail: SalesDetail) {
    let retailPrice = 0;
    retailPrice = this.utilProvider.accMul(salesDetail.salesQty, salesDetail.retailPrice);
    return retailPrice;
  }
  //口味修改
  goToEditTastePage(salesDetail) {
    let modal = this.modalCtrl.create(EditTastePage, { salesDetail: salesDetail }, {
      cssClass: 'custom-modal2'
    });
    modal.present();
  }
  //商品优惠
  DiscountKeyboardPage(salesDetail) {
    // this.showCartModal = !this.showCartModal;
    // this.noScrolling = true;
    let modal = this.modalCtrl.create(DiscountKeyboardPage, { salesDetail: salesDetail }, {
      cssClass: 'custom-modal2'
    });
    modal.present();
  }
  // 是否有赠送权限
  isHasPresentPer() {
    if (!this.appPer.staffPermission(this.appPer.ITEM_PRESENT)) {
      this.http.showToast('无【赠送】权限');
      return false;
    }
    return true;
  }
  // 赠送商品明细
  presentDetailItem(salesDetail) {
    if (!this.isHasPresentPer()) return false;
    this.woShopServices.doOneDiscounts(salesDetail, 0);
  }
  // 重置赠送商品明细
  resetPresentDetailItem(salesDetail) {
    if (!this.isHasPresentPer()) return false;
    this.woShopServices.doOneDiscounts(salesDetail, 100);
  }
  //整单备注模态框
  toRemark() {
    let profileModal = this.modalCtrl.create('PlaceOrderRemarkPage', { remark: this.appShopping.salesh.remark }, {
      cssClass: 'custom-modal'
    });
    profileModal.onDidDismiss(data => {
      if (data && data.flag) {
        this.appShopping.salesh.remark = data.remark;
      }

    });
    profileModal.present();
  }

  //单品备注模态框
  toSalesDetailRemark(salesDetail) {
    let profileModal = this.modalCtrl.create('PlaceOrderRemarkPage', { remark: salesDetail.remark, salesDetail: salesDetail }, {
      cssClass: 'custom-modal'
    });
    profileModal.onDidDismiss(data => {
      if (data && data.flag) {
        salesDetail.remark = data.remark;
      }

    });
    profileModal.present();
  }
  //商品详情
  toDeshDetail(salesDetail) {
    let spu = this.woShopServices.selectSpuBySpuId(salesDetail.spuId);
    let modal = this.modalCtrl.create(WoShopDetailSpecPage, { comSpu: JSON.stringify(spu), salesDetail: salesDetail }, {
      cssClass: 'custom-modal3'
      // enterAnimation: 'modal-scale-enter',
      // leaveAnimation: 'modal-scale-leave'
    });
    modal.present();
  }

  //挂单  购物车为空不给挂单
  toHangOrder() {
    if (this.appShopping.salesDetailList.length <= 0) {
      this.http.showToast("请选择商品");
      return;
    }
    this.navCtrl.push('HangOrderPage');
    this.close();
  }

  //结账
  placeOrder() {
    if ((!this.appShopping.salesTable || !this.appShopping.salesTable.id) && this.appPer.storeParamPermission('isOpenMealNo')) {
      let number = { number: '0', isClear: true };
      let top = { title: '输入牌号', placeholder: '' };
      if (this.appShopping.salesh && this.appShopping.salesh.mealNo) {
        number.number = this.appShopping.salesh.mealNo;
      }
      let modal = this.modalCtrl.create("InputNumberKeyboardPage", { number: number, top: top, maxLength: 10, havePoint: false }, {
        cssClass: 'custom-modal2'
      });
      modal.onDidDismiss((data) => {
        if (data && data.flag) {
          this.appShopping.salesh.mealNo = data.data + '';
          this.navCtrl.push('PayMentPage');
          // setTimeout(() => {
          this.close();
          // }, 500);
        }
      });
      modal.present();
    } else {
      this.navCtrl.push('PayMentPage');
      // setTimeout(() => {
      this.close();
      // }, 500);
    }
    // this.navCtrl.push('PayMentPage');

  }
  clearCart() {
    // this.helper.alert('确认清空购物车？', '', () => {
    //   this.appShopping.clearOdear();
    //   this.getTypeMap();
    // }, () => { });
    this.woShopServices.clearToCar().subscribe(res => {
      if (res) {
        this.close();
        setTimeout(() => {
          this.navCtrl.popToRoot();
        }, 500);
      }
    });

  }

  /**加菜 */
  addItemOfOrder() {
    /*let modal = this.modalCtrl.create("ManNumberPage", { salesTable: this.appShopping.salesTable, }, {
      cssClass: 'custom-modal2'
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.flag) {
        let number = data.number;
        let teaAmt = data.teaAmt;
        let remark = data.remark;
        this.submit(number, teaAmt);
        this.close();
      }
    });*/
    let salesTable = this.appShopping.salesTable;
    this.submit(salesTable.personNum, salesTable.teaAmt);
    this.close();
  }

  submit(number, teaAmt) {
    let datas = this.tableService.addItemForSalesTable(number, this.appShopping.salesTable, this.appShopping.salesh, teaAmt);
    let me = this;
    me.webSocketService.sendObserveMessage("UPDATEDATA", datas).subscribe(function (retData) {
      if (retData && retData.success) {
        me.woShopServices.clearToCartSilent(); // 清空购物车
        setTimeout(() => {
          me.http.showToast('加菜成功');
        }, 500);

      }
    });
  }


  setNumberComSpu(salesDetail) {
    let item = { number: salesDetail.salesQty, isClear: true }
    let modal = this.modalCtrl.create(SetSalesDetailNumberPage, { salesDetail: salesDetail, item: item }, {
      cssClass: 'custom-modal2'
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.flag) {
        if (data.data < salesDetail.minCount || data.data <= 0) {
          this.http.showToast('不可小于起售份数');
          return;
        } else if (!this.utilProvider.checkNumCorrect(data.data)) { // 超出数值范围
          this.http.showToast(this.utilProvider.getErrorNumHintTxt());
          return;
        } else {
          // this.salesDetail.tmpQty = data.data;
          this.woShopServices.setCom(salesDetail, data.data)
        }
      } else {
        return;
      }
    });

  }

  openMenu(item) {
    let con = [];
    if (true) {
      con.push(
        {
          text: '菜品备注',
          handler: () => {
            this.toSalesDetailRemark(item);
          }
        }
      );
    }
    if (true) {
      con.push(
        {
          text: '稍后上菜',
          handler: () => {
            item.isWaitingDish = 'Y';
          }
        }
      );
    }
    if (true) {
      con.push(
        {
          text: '删除',
          handler: () => {
            this.deletSalesDetail(item);
          }
        }
      );
    }
    con.push(
      {
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    );

    let actionSheet = this.actionSheetCtrl.create({
      buttons: con
    });

    actionSheet.present();
  }

  deletSalesDetail(salesDetail) {
    this.woShopServices.doDedel(salesDetail);
    this.appShopping.salesDetailList.forEach(com => {
      if (com.parentId == salesDetail.id) {
        this.woShopServices.doDedel(com);
      }
    });
  }

  //全部稍后上菜
  allWaiting() {
    let alert = this.alertCtrl.create({
      title: '提示',
      message: '确认将当前购物车商品设为稍后上菜!',
      // enableBackdropDismiss: false,
      buttons: [
        {
          text: '取消',
        },
        {
          text: '确定',
          handler: () => {
            this.appShopping.salesDetailList.forEach(salesDetail => {
              salesDetail.isWaitingDish = 'Y';
            })
          }
        },
      ]
    });
    alert.present();
  }
}
