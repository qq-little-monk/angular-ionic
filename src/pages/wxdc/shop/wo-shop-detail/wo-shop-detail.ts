import { Component, ViewChild, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content, MenuController, Events, Scroll, InfiniteScroll, AlertController } from 'ionic-angular';
import { EventsProvider } from '../../../../providers/Events';
import { WoShopService } from '../../../../service/wo.shop.service';
import { HttpProvider } from '../../../../providers/http';
import { AppShopping } from '../../../../app/app.shopping';
import { ItemSku } from '../../../../domain/item-sku';
import { SpuExt } from '../../../../domain/item-spu-ext';
import { TableService } from '../../../../service/tableService';
import { WebSocketService } from '../../../../service/webSocketService';
import { AppPermission } from '../../../../app/app.permission';
import { PrinterDeviceDao } from '../../../../dao/PrinterDeviceDao';
import { PrintProvider } from '../../../../providers/print';
import { AppCache } from '../../../../app/app.cache';
import { OrderProvider } from '../../../../providers/order/order';
import { PrintService } from '../../../../service/printService';
import { WoShopDetailCarPage } from '../wo-shop-detail-car/wo-shop-detail-car';
import { WoShopDetailSpecPage } from '../wo-shop-detail-spec/wo-shop-detail-spec';
import { DiscountKeyboardPage } from '../discountkeyboard/discountkeyboard';
import { UtilProvider } from '../../../../providers/util/util';
import { JsonPipe } from '@angular/common';
import {ProductionDetailPage} from '../production-detail/production-detail';


declare var funParabola: any;
// @IonicPage()
@Component({
  selector: 'page-wo-shop-detail',
  templateUrl: 'wo-shop-detail.html',
})
export class WoShopDetailPage {

  offset: number = 100;
  showShopInfo: boolean = false;
  noScrolling: boolean = false;
  showItemList: any = [];

  // @ViewChild('ionContent') ionContent: any;
  @ViewChild(Content) content: Content;
  @ViewChild('shopInfoContainer') shopInfoContainer: any;
  @ViewChild('shopInner') shopInner: any;
  @ViewChildren("IonItemGroup") ionItemGroup: any;
  @ViewChild('container') container: any;
  @ViewChild('itembutton') itembutton: any;


  index: any; //当前选中的商品类型
  offsetTops: Array<number> = [];  //商品类标题距离顶部的高度
  @ViewChild("desheScroll") desheScroll: any;
  canScroll: boolean = true;
  showCartModal: boolean = false;
  showNoImgMode: boolean = false;
  pageLimit: number = 10;
  isOpenTable: boolean = false;//是否开台进入
  /**
* 选中分类
*/
  checkedType: {} = {};
  isAddItem: boolean = false;

  isShowSlab: boolean = false;
  showSlabType: string = this.appCache.Configuration.DP_DPNUM;
  configuration: {} = this.appCache.Configuration;
  // showSlabType:string =this.appCache.Configuration. DP_DPNUM;
  // showSlabClassName="isShowSlab2";
  // slab: {} = {
  //   height: "50%",
  //   width: "33%",
  // }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ref: ChangeDetectorRef,
    public modalCtrl: ModalController,
    public eventsSer: EventsProvider,
    public shopSer: WoShopService,
    private http: HttpProvider,
    public appShopping: AppShopping,
    public tableService: TableService,
    public webSocketService: WebSocketService,
    public events: Events,
    public appPer: AppPermission,
    public appCache: AppCache,
    public orderProvider: OrderProvider,
    public printerDeviceDao: PrinterDeviceDao,
    public print: PrintProvider,
    public printService: PrintService,
    public alertCtrl: AlertController,
    public util: UtilProvider,
    public menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
    document.getElementsByTagName('title')[0].innerHTML = '爱宝点菜宝';
    //伪加载界面，保证数据完全写入内存
    if (this.appCache.Configuration.DP_MS) {
      this.http.loadingPresent(true, '正在加载数据,请稍后...').subscribe(loadding => {
        setTimeout(() => {
          this.http.loadingDismiss(loadding);
        }, 2000);
      })
    }
    // console.log(this.content.ionScroll)
    // console.log(this.desheScroll)
    this.checkedType = {};
    if (this.appShopping.comTypeList && this.appShopping.comTypeList.length > 0) { this.checkedType = this.appShopping.comTypeList[0]; }
    this.queryDeviceByPrinterType();
  }
  //得到蓝牙打印的驱动
  queryDeviceByPrinterType() {
    // let device=
    let type = '1';//小票打印机
    let device = Object.assign({}, this.print.receiptPrinter);
    if (device.id) {
      return
    } else {
      this.printerDeviceDao.queryByPrinterType(type, this.appCache.seller.id).then(data => {
        console.log('数据库查询出的打印驱动————————————————————————————————————————————————————————————————————————————————————————————————————');
        console.log(JSON.stringify(data));
        if (data.length > 0) {
          device = data[0];
          this.print.receiptPrinter = device;
          this.orderProvider.receiptPrintStatus = true;
        } else {
          this.orderProvider.receiptPrintStatus = false;
        }
      })
    }
  }
  initItem() {
    this.appShopping.comSpuList.forEach(comSpu => {
      comSpu.tmpExt = this.shopSer.selectSpuExtById(comSpu.id);
      comSpu.tmpSkuList = this.shopSer.selectSkuBySpuId(comSpu.id);
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
  ionViewWillEnter() {

    this.tableService.refreshSpuDataForSoudout();
    // this.initItem();
    this.isAddItem = this.navParams.get('isAddItem');
    this.isOpenTable = this.navParams.get('isOpenTable');
    this.pageLimit = 10;
    console.log('进入页面', this.configuration);
    // console.log(this.appShopping.comSpuList);

    // isShowSlab=this.appCache.Configuration. DP_DPNUM;
    this.configuration = this.appCache.Configuration;
    this.showNoImgMode = this.appCache.Configuration.DP_NOIMG;
    // 大屏且无图模式时，设置页显示数量限制为36
    if (this.appCache.Configuration.DP_DP && this.showNoImgMode) {
      let headerHeight = 44;  // 顶栏的高度，根据机型的不同，可能会有偏差
      let footerHeight = 50;  // 底栏的高度，根据机型的不同，可能会有偏差
      let itemHeight = 66;    // 一行的高度，根据机型的不同，可能会有偏差
      let contentHeight = window.screen.availHeight - headerHeight - footerHeight;
      let contentLines = parseInt((contentHeight / itemHeight) + "") + 1;
      //this.pageLimit=36;
      this.pageLimit = contentLines * parseInt(this.appCache.Configuration.DP_DPNUM);
    }
    this.getShowList(this.checkedType);
    this.shopSer.getTypeMap();
  }
  scrollFlag = true;
  //商品区域滚动监听事件
  // desheScrollFun(event) {
  //   if (!this.scrollFlag) {
  //     return;
  //   }
  //   console.log(event.scrollTop);
  //   console.log(this.desheScroll.scrollHeight);
  //   if (event.scrollTop + 650 > this.desheScroll.scrollHeight) {
  //     this.scrollFlag = false;
  //     this.http.showToast('11111');
  //     this.nextPage();
  //     setTimeout(() => {
  //       this.scrollFlag = true;
  //     }, 500);

  //   }
  // }
  doInfinite(infiniteScroll: InfiniteScroll) {
    if (this.pageLimit >= this.showItemList.length) {
      infiniteScroll.complete();
      return;
    }
    if (!this.scrollFlag) {
      infiniteScroll.complete();
      return;
    }
    this.scrollFlag = false;
    setTimeout(() => {
      this.nextPage();
      this.scrollFlag = true;
      infiniteScroll.complete();
    }, 500);
  }
  nextPage() {
    this.pageLimit = this.pageLimit + 20;
    this.getPageLimitData();
  }
  ionViewDidEnter() {
    console.log('进入页面');
    // this.setItemButton();
    this.tableService.alertCtrlShow = false;
    this.events.subscribe('spu:refresh', (EventData) => {
      this.getShowList(this.checkedType);
      // this.initItem();
    });
    //监听订单更新事件 */
    this.tableService.alertCtrlShow = false;

    if (this.appCache.Configuration.JC_ORDER_ONCHANG) {
      this.events.subscribe('order:refresh', (EventData) => {
        if (this.appShopping.salesTable) {
          this.tableService.alertCtrlShow = false;
          this.tableService.doConfirmByOrder();
        }
      });
    }
    // this.getOffsetTops();
  }
  ionViewWillLeave() {
    this.events.unsubscribe('order:refresh');
  }
  ionViewDidLeave() {
    // this.events.unsubscribe('order:refresh');
  }
  getShowList(type) {
    // console.log(type);
    let tmpList = [];
    let defaultTypeId: number = 999999;
    if (type.id == defaultTypeId) {
      tmpList = this.appShopping.comSpuList;
    } else {
      this.appShopping.comSpuList.forEach(item => {
        if (item.cateId == type.id) {
          tmpList.push(item);
        }
      })
    }
    this.showItemList = null;
    this.showItemList = tmpList;
    this.getPageLimitData();
  }
  pageLimitData: any = [];
  getPageLimitData() {
    if (!this.showItemList || this.showItemList.length == 0) {
      this.pageLimitData.length = 0;
    } else {
      this.pageLimitData.length = 0;
      for (let index = 0; index < this.showItemList.length; index++) {
        if (index < this.pageLimit) {
          this.pageLimitData.push(this.showItemList[index]);
        } else {
          return
        }

      }
    }

  }

  openMenu() {
    this.menuCtrl.open();
    console.log(this.menuCtrl.getMenus());

  }
  openFirst() {
    this.menuCtrl.enable(true, 'WoShopDetailCarPage');
    console.log(this.menuCtrl.enable(true, 'first'));
    this.menuCtrl.open('WoShopDetailCarPage');
  }
  getOffsetTops() {
    // console.log('111111111111111');
    // console.log(this.ionItemGroup);
    this.offsetTops = this.ionItemGroup._results.map(ele => {
      return ele.nativeElement.offsetTop;
    });
  }

  toggleShopHeight() {
    console.log(this.content.getContentDimensions())
    if (!this.showShopInfo) {
      this.showShopInfo = !this.showShopInfo;
      this.shopInfoContainer.nativeElement.style.height = `${this.content.getContentDimensions().contentHeight - this.shopInner.nativeElement.clientHeight + this.content.getContentDimensions().contentBottom + 10}px`;
      this.shopInfoContainer.nativeElement.style.maxHeight = `${this.content.getContentDimensions().contentHeight - this.shopInner.nativeElement.clientHeight + this.content.getContentDimensions().contentBottom + 10}px`;;
      this.content.resize();
    } else {
      this.shopInfoContainer.nativeElement.style.height = 0;
      this.shopInfoContainer.nativeElement.style.maxHeight = '0';
      setTimeout(() => {
        this.showShopInfo = !this.showShopInfo;
        this.content.resize();
      }, 300);
    }
    // this.ref.detectChanges();
  }


  selectAddToCar(itemSpu) {
    // console.log(itemSpu)
    // this.navCtrl.push(ProductionDetailPage,{
    //   itemName: itemSpu.itemName,
    //   retailPrice: itemSpu.retailPrice,
    //   retailPriceX: itemSpu.retailPriceX
    // });
    console.log('its mi');
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

  //搜索商品
  toSearch() {

  }

  //左侧商品分类点击事件
  selectType(item) {
    this.pageLimit = this.pageLimit > 10 ? this.pageLimit : 10;
    this.checkedType = item;
    this.desheScroll.scrollTop = 0;
    this.getShowList(this.checkedType);
    this.refreshPage();
    // const offsetTop = this.offsetTops[index];
    // console.log(this.desheScroll);
    // console.log(offsetTop);
    // this.content.scrollToBottom(300);

    // setTimeout(() => {
    //   console.log(this.desheScroll)
    //   this.desheScroll.nativeElement.scrollTop = offsetTop;
    //   this.desheScroll.scr(offsetTop)
    //   this.desheScroll.scrollTo(0, offsetTop, 0)

    // }, 100)
  }

  // //商品区域滚动监听事件
  // desheScrollFun(event) {
  //   console.log(event)
  //   const threshold = 37;
  //   if (event.scrollTop < threshold) {
  //     console.log(this.index)
  //     this.index = this.shopSer.disheList[0].id;
  //     return;
  //   }
  //   for (let i = this.offsetTops.length; i > 0; i--) {
  //     if (event.scrollTop + threshold >= this.offsetTops[i]) {
  //       this.index = this.shopSer.disheList[i].id;
  //       console.log(this.index)
  //       this.ref.detectChanges();
  //       return;
  //     }
  //   }

  //   // if (event.srcElement.scrollTop < threshold) {
  //   //   this.index = this.shopSer.disheList[0].id;
  //   //   return;
  //   // }
  //   // for (let i = this.offsetTops.length; i > 0; i--) {
  //   //   if (event.srcElement.scrollTop + threshold >= this.offsetTops[i]) {
  //   //     this.index = this.shopSer.disheList[i].id;
  //   //     this.ref.detectChanges();
  //   //     return;
  //   //   }
  //   // }
  // }

  //外层content滚动事件
  scrollHandler(event) {
    let scrollTop = event.scrollTop;
    let canScrollFlag = this.container.nativeElement.offsetTop;
    // console.log(this.content.getContentDimensions())
    // this.canScroll = event.scrollTop == this.container.nativeElement.offsetTop;
    //当滚动距离大于 商品内容距离顶部高度-头部高度-切换栏高度 减去5时,分类商品内容区域可以滚动
    if (scrollTop > canScrollFlag - 5 && scrollTop < canScrollFlag + 5) {
      if (!this.canScroll) {
        this.canScroll = true;
        // this.ref.detectChanges();
      }
    } else {
      if (this.canScroll) {
        this.canScroll = false;
        // this.desheScroll.nativeElement.scrollTop = 0;
        this.desheScroll.scrollTop = 0
        // this.ref.detectChanges();
      }
    };
    // this.ref.detectChanges();
  }


  //选择规格 模态框
  selectSpec(comSpu) {
    // this.noScrolling = true;
    // alert(this.noScrolling)

    if (this.configuration['DP_DP']) {
      this.navCtrl.push(WoShopDetailSpecPage, { comSpu: JSON.stringify(comSpu), isShowSlab: true });
    } else {
      let modal = this.modalCtrl.create(WoShopDetailSpecPage, { comSpu: JSON.stringify(comSpu) }, {
        cssClass: 'custom-modal3'
        // enterAnimation: 'modal-scale-enter',
        // leaveAnimation: 'modal-scale-leave'
      });
      modal.onDidDismiss((data) => {
        this.noScrolling = false;
      });
      modal.present();
    }
    // }



    // let detailSpec = this.modalCtrl.create('WoShopDetailSpecPage', {}, {
    //   // enterAnimation: 'modal-scale-enter',
    //   // leaveAnimation: 'modal-scale-leave',
    //   // cssClass: 'spec-select-modal',
    //   showBackdrop: false,
    //   enableBackdropDismiss: true
    // });
    // detailSpec.onDidDismiss(data => {

    // });
    // detailSpec.present();
  }


  //打开购物车
  openCartModal() {
    // this.showCartModal = !this.showCartModal;
    // this.noScrolling = true;
    let modal = this.modalCtrl.create(WoShopDetailCarPage, { navCtrl: this.navCtrl }, {
      cssClass: 'custom-modal3'
    });
    modal.onDidDismiss((data) => {
      this.noScrolling = false;
    });
    modal.present();
    // this.navCtrl.push('WoShopDetailCarPage');

  }

  //商品优惠
  DiscountKeyboardPage() {
    // this.showCartModal = !this.showCartModal;
    // this.noScrolling = true;
    let modal = this.modalCtrl.create(DiscountKeyboardPage, {}, {
      cssClass: 'custom-modal2'
    });
    modal.onDidDismiss((data) => {
      this.noScrolling = false;
    });
    modal.present();

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
      } else {//下单失败
        me.appShopping.salesTable.salesId = null;
      }
    });
  }
  //选桌下单  购物车为空不给挂单
  toHangOrder() {
    if (this.appShopping.salesDetailList.length <= 0) {
      this.http.showToast("请选择商品");
      return;
    }
    this.navCtrl.push('HangOrderPage');
  }
  //结账
  placeOrder() {
    if (this.appShopping.salesDetailList.length <= 0) {
      this.http.showToast("请选择商品");
      return;
    }
    this.showCartModal = false;
    if ((!this.appShopping.salesTable || !this.appShopping.salesTable.salesId) && this.appPer.storeParamPermission('isOpenMealNo')) {
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
    // this.noScrolling = false;


  }
  goToTakeOrderTabPage() {
    if (!this.appPer.staffPermission('1202')) {
      this.http.showToast('无【取单】权限');
      return;
    }
    if (this.appShopping.salesDetailList.length > 0 && this.appShopping.salesh.id) {
      this.http.showToast("请完成当前点餐操作，再前往取单");
      return;
    }
    this.navCtrl.push('HangOrderPage', { isTakeOrder: true })
    this.webSocketService.sendObserveMessage("RELEASEMASTERDATA", { status: 0 }, { isShowing: false }).subscribe(function () { });
  }

  //关闭购物车模态框
  closeCartModal() {
    this.showCartModal = false;
    this.noScrolling = false;
  }

  //添加临时菜
  addTempGood(){
     let modalNumPage = this.modalCtrl.create("TemporaryDishPage", { }, {
      cssClass: 'custom-modal2'
    });
    modalNumPage.present();
  }
  //商品详情
  toDeshDetail(dish) {
    if (this.configuration['DP_DP']) {//开启大屏显示
      this.navCtrl.push('ImgDetailPage', { dish: JSON.stringify(dish) })
    } else {
      let modal = this.modalCtrl.create("ImgDetailPage", { dish: JSON.stringify(dish) }, {
        cssClass: 'custom-modal3',
        enterAnimation: 'modal-scale-enter',
        leaveAnimation: 'modal-scale-leave'
      });
      modal.onDidDismiss((data) => {
        this.noScrolling = false;
      });
      modal.present();
    }

  }
  selectCust() {
    if (this.appShopping.customer) {
      this.navCtrl.push('CustomerInfoPage', { customer: this.appShopping.customer })
    } else {
      this.navCtrl.push('CustomerSearchPage', { customer: this.appShopping.customer })

    }
  }
  /**加菜 */
  addItemOfOrder() {
    // console.log(this.appShopping.salesTable);
    let salesTable = this.appShopping.salesTable;
    // let modal = this.modalCtrl.create("ManNumberPage", { salesTable: this.appShopping.salesTable, }, {
    //   cssClass: 'custom-modal2'
    // });
    // modal.present();
    // modal.onDidDismiss(data => {
    //   if (data && data.flag) {
    //     let manNumber = data.number;
    //     let teaAmt = data.teaAmt;
    // this.submit(manNumber, teaAmt);
    //   }
    // });
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
          me.navCtrl.popToRoot();
        }, 500);
        let salesData = { topName: '【加菜单】', salesH: datas.salesH, salesTable: datas.salesTable, salesDetailList: datas.salesDetail, };
        salesData = JSON.parse(JSON.stringify(salesData));
        // 'DY_JCD'
        me.printService.printSales(salesData, this.navCtrl, 'DY_JCD');
      }
    });
  }

  //设置商品dom宽度和高度
  setItemButton() {
    // const el = document.getElementsByName('itembutton');
    // console.log(el);
    // console.log('12121212', el);
    // if (el && el.length > 0) {
    //   el.forEach(dom => {
    //     dom.style.width = "100%";
    //   })
    // }
    // const el = this.itembutton._elementRef.nativeElement;
    // const el=document.getElementById('itembutton');
    // console.log(el);
    // el.style.width="100%";
  }

  refreshData(dataName) {
    dataName = dataName || '*';
    let me = this;
    me.webSocketService.sendObserveMessage("LOADDATA", dataName, { content: '正在刷新数据...' }).subscribe(function (retData) {
      if (retData && retData.success) {
        me.shopSer.assignmentData(retData);
        me.http.showToast('数据刷新成功!');
      }
    });
  }

  refreshPage() {
    this.ref.detectChanges();
  }


  // ionViewCanLeave() {
  //   if (this.isAddItem ) {
  //     let alertCtrl = this.alertCtrl.create({
  //       title: '放弃加菜？',
  //       // message: res['data'].verDesc,
  //       cssClass: 'alert-log',
  //       buttons: [
  //         {
  //           text: '取消',
  //           role: 'cancel',
  //           handler: () => {
  //             console.log('取消');
  //           }
  //         },
  //         {
  //           text: '确认',
  //           handler: () => {
  //             this.isAddItem = false;
  //             this.shopSer.clearToCartSilent();
  //             this.navCtrl.popToRoot();
  //             return true;
  //           }
  //         }
  //       ]
  //     });
  //     alertCtrl.present();

  //     return false;

  //   } else {

  //     return true;
  //   }
  // }
  // doRefresh(refresher) {
  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 2000);

  // }


}
