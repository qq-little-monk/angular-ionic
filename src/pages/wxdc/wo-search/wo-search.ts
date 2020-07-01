import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, Searchbar } from 'ionic-angular';
import { AppShopping } from '../../../app/app.shopping';
import { WoShopService } from '../../../service/wo.shop.service';
import { ItemSku } from '../../../domain/item-sku';
import { SpuExt } from '../../../domain/item-spu-ext';
import { HttpProvider } from '../../../providers/http';
import { TableService } from '../../../service/tableService';
import { WebSocketService } from '../../../service/webSocketService';
import { AppPermission } from '../../../app/app.permission';
import { FormControl } from '@angular/forms';
import { WoShopDetailCarPage } from '../shop/wo-shop-detail-car/wo-shop-detail-car';
import { WoShopDetailSpecPage } from '../shop/wo-shop-detail-spec/wo-shop-detail-spec';
import { PrintService } from '../../../service/printService';
import { UtilProvider } from '../../../providers/util/util';
import { AppCache } from '../../../app/app.cache';

@IonicPage()
@Component({
  selector: 'page-wo-search',
  templateUrl: 'wo-search.html',
})
export class WoSearchPage {
  @ViewChild('searchbar') searchbar: Searchbar;
  searchText: string;
  showSearch: boolean = true;
  comSpuList: any = [];
  configuration: any;
  constructor(public navCtrl: NavController,
    public appShopping: AppShopping,
    public shopSer: WoShopService,
    public modalCtrl: ModalController,
    public http: HttpProvider,
    public tableService: TableService,
    public webSocketService: WebSocketService,
    public events: Events,
    public appPer: AppPermission,
    public printService: PrintService,
    public util: UtilProvider,
    public appCache: AppCache,
    public navParams: NavParams) {
  }
  public example: FormControl = new FormControl('');
  public ngOnInit() {
    this.example.valueChanges.startWith('').subscribe((value) => {
      // console.log(value);
      this.search();
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad WoSearchPage');
    this.focusInput();
    this.events.subscribe('spu:addToCar', (EventData) => {
      this.searchText = null;
      setTimeout(() => {
        this.searchbar.setFocus();
      }, 1000);
    });
    // console.log(this.searchbar.setFocus());
    // console.log(this.searchbar);
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 1000);
  }
  ionViewWillEnter() {
    this.configuration = this.appCache.Configuration;
    //监听订单更新事件 
    this.tableService.alertCtrlShow = false;
    this.events.subscribe('order:refresh', (EventData) => {
      console.log('EventData');
      console.log('Welcome');
      this.tableService.doConfirmByOrder(null,()=>{this.navCtrl.popToRoot()});
    });
  }

  // addSkuItemCodeList() {
  //   this.appShopping.comSpuList.forEach(spu => {
  //     spu.tmpSkuList.array.forEach(sku => {
  //       spu.skuItemCodeList = spu.skuItemCodeList + ',' + sku.itemCode;
  //       spu.otherCodes = spu.otherCodes + ',' + sku.otherCodes;
  //     });
  //   })
  // }
  /**退出页面触发方法
 */
  ionViewDidLeave() {
    // this.events.unsubscribe('order:refresh');
  }
  ionViewWillLeave() {
    this.events.unsubscribe('order:refresh');
    this.showSearch = false;
  }
  focusInput() {
    var idInput = document.getElementById("input");
    idInput.onkeyup = (event) => {
      if (event.keyCode == 13) {
        //执行相应的方法
        this.search();
      }
    }

  }
  search() {
    let param = this.searchText || '';
    if (param == null || param == '') {
      // this.comSpuList.length=0;
      return;
    }
    let Lowerparam = param.toLocaleLowerCase();
    this.comSpuList = [];
    this.appShopping.comSpuList.forEach(spu => {
      let LowerItemName = spu.itemName ? spu.itemName.toLocaleLowerCase() : '';
      let LowerItemPyCode = spu.pyCode ? spu.pyCode.toLocaleLowerCase() : '';
      let LowerItemCode = spu.itemCode ? spu.itemCode.toLocaleLowerCase() : '';
      let LowerInternalCode = spu.otherCodes ? spu.otherCodes.toLocaleLowerCase() : '';
      let LowerSkuItemCode = spu.skuItemCode ? spu.skuItemCode.toLocaleLowerCase() : '';
      // let UpperItemName = spu.itemName.toLocaleUpperCase() || '';
      if (LowerItemName.indexOf(Lowerparam) > -1 || LowerItemPyCode.indexOf(Lowerparam) > -1
        || LowerItemCode.indexOf(Lowerparam) > -1 || (LowerInternalCode && LowerInternalCode.indexOf(Lowerparam) > -1)
        || (LowerSkuItemCode && LowerSkuItemCode.indexOf(Lowerparam) > -1)
      ) {
        this.comSpuList.push(spu);
      }
    })
  }
  goToQr() {
    this.navCtrl.push('CommodityQrScanPage', { QRcallback: this.QRcallback, })
  }
  QRcallback: (param: any) => Promise<any> = (params) => new Promise(resolve => {
    this.searchText = params.code;
    console.log(this.searchText);
    this.search();
  });


  selectAddToCar(itemSpu) {
    if (this.shopSer.isSimplCom(itemSpu)) {
      let itemSku: ItemSku = this.shopSer.selectSkuBySpuId(itemSpu.id)[0];
      let comSpuExt: SpuExt = this.shopSer.selectSpuExtById(itemSpu.id);
      let data = {
        itemSpu: itemSpu,
        itemSku: itemSku,
        comSpuExt: comSpuExt,
      }
      this.shopSer.addToCar(data);
    } else {
      this.selectSpec(itemSpu);
    }
  }

  //选择规格 模态框
  selectSpec(comSpu) {
    if (this.configuration['DP_DP']) {
      this.navCtrl.push(WoShopDetailSpecPage, { comSpu: JSON.stringify(comSpu), isShowSlab: true });
    } else {
      let modal = this.modalCtrl.create(WoShopDetailSpecPage, { comSpu: JSON.stringify(comSpu) }, {
        cssClass: 'custom-modal3'
        // enterAnimation: 'modal-scale-enter',
        // leaveAnimation: 'modal-scale-leave'
      });
      modal.onDidDismiss((data) => {
      });
      modal.present();
    }
  }

  //商品详情
  toDeshDetail(dish) {
    let modal = this.modalCtrl.create("ImgDetailPage", { dish: JSON.stringify(dish) }, {
      cssClass: 'custom-modal3',
      enterAnimation: 'modal-scale-enter',
      leaveAnimation: 'modal-scale-leave'
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
  }
  //下单
  placeOrder() {
    if (this.appShopping.salesDetailList.length <= 0) {
      this.http.showToast("请选择商品");
      return;
    }
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
        }
      });
      modal.present();
    } else {
      this.navCtrl.push('PayMentPage');
    }
    // this.navCtrl.push('PayMentPage')
  }
  goToTakeOrderTabPage() {
    if (this.appShopping.salesDetailList.length > 0 && this.appShopping.salesh.id) {
      this.http.showToast("请完成当前点餐操作，再前往取单");
      return;
    }
    this.navCtrl.push('HangOrderPage', { isTakeOrder: true })
  }
  //打开购物车
  openCartModal() {
    // this.showCartModal = !this.showCartModal;
    // this.noScrolling = true;
    let modal = this.modalCtrl.create(WoShopDetailCarPage, { navCtrl: this.navCtrl }, {
      cssClass: 'custom-modal3'
    });
    modal.present();

  }

  /**加菜 */
  addItemOfOrder() {
    // let modal = this.modalCtrl.create("ManNumberPage", { salesTable: this.appShopping.salesTable, }, {
    //   cssClass: 'custom-modal2'
    // });
    // modal.present();
    // modal.onDidDismiss(data => {
    //   if (data && data.flag) {
    //     let number = data.number;
    //     let teaAmt = data.teaAmt;
    //     this.submit(number, teaAmt);
    //   }
    // });
    let salesTable = this.appShopping.salesTable;
    this.submit(salesTable.personNum, salesTable.teaAmt);
  }

  submit(number, teaAmt) {
    let datas = this.tableService.addItemForSalesTable(number, this.appShopping.salesTable, this.appShopping.salesh, teaAmt);
    let me = this;
    me.webSocketService.sendObserveMessage("UPDATEDATA", datas).subscribe(function (retData) {
      if (retData && retData.success) {
        me.shopSer.clearToCartSilent(); // 清空购物车
        setTimeout(() => {
          me.http.showToast('加菜成功');
        }, 500);
      }
    });
  }

  /** 
   * 开台下单
  */
  stayEntryOrders() {
    let datas = this.tableService.stayEntryOrders();
    datas['optType'] = 'SHARE';
    let me = this;
    me.webSocketService.sendObserveMessage("UPDATEDATA", datas).subscribe(function (retData) {
      if (retData && retData.success) {

        let salesData = { topName: '【点菜客户单】', salesH: me.appShopping.salesh, salesTable: datas.salesTable, salesDetailList: me.appShopping.salesDetailList, salesCampaign: datas.salesCampaign };
        salesData = JSON.parse(JSON.stringify(salesData));
        me.shopSer.clearToCartSilent(); // 清空购物车 
        me.navCtrl.popToRoot();
        // console.log('111111111111111111111111111111');
        me.printService.printSales(salesData, this.navCtrl, 'DY_GKD');
        // setTimeout(() => {
        salesData = JSON.parse(JSON.stringify(salesData));
        salesData.topName = '【台单】';
        me.printService.printSales(salesData, this.navCtrl, 'DY_TD');
        salesData = null;
        // }, 100);
        setTimeout(() => {
          me.http.showToast('下单成功！');
          this.navCtrl.popToRoot();
        }, 500);
        // me.navCtrl.setRoot("WoShopDetailPage", {}, { animate: true, direction: "forward" }); // 跳转到点菜页面
        // me.close();
        // me.navCtrl.popToRoot();
        // me.callback();
      }
    });
  }
}
