import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { EventsProvider } from '../../providers/Events';
import { GlobalData } from '../../providers/GlobalData';
import { WoShopService } from '../../service/wo.shop.service';
import { ModalController, AlertController, NavController } from 'ionic-angular';
import { AppShopping } from '../../app/app.shopping';
import { HttpProvider } from '../../providers/http';
import { AppPermission } from '../../app/app.permission';
import { WebSocketService } from '../../service/webSocketService';
/**
 * Generated class for the WoCartTabComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'wo-cart-tab',
  templateUrl: 'wo-cart-tab.html'
})
export class WoCartTabComponent {

  @ViewChild('parabola') parabolaElement: any;
  @Output() openModal = new EventEmitter<any>();
  @Output() placeOrder = new EventEmitter<any>();
  @Output() stayHangOrder = new EventEmitter<any>();
  @Output() hangOrder = new EventEmitter<any>();
  @Output() addItemOfOrder = new EventEmitter<any>();


  showTips: boolean = false;
  timer: any = null;
  deshNumber: number = 0;
  constructor(public shopSer: WoShopService,
    public modalCtrl: ModalController,
    public navController: NavController,
    public appShopping: AppShopping,
    public http: HttpProvider,
    public appPer: AppPermission,
    public alertCtrl: AlertController,
    public event: EventsProvider,
    public webSocketService: WebSocketService) {
    this.event.subscribe(GlobalData.sys_wo_take_order, res => {
      this.deshNumber = res.number;
      if (this.showTips) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.showTips = false;
          this.timer = null;
        }, 500);
      } else {
        this.showTips = true;
        this.timer = setTimeout(() => {
          this.showTips = false;
          this.timer = null;
        }, 500)
      }

    })
  }

  ngOnInit() {

  }

  _open() {
    if (!this.appShopping.salesDetailList || this.appShopping.salesDetailList.length == 0) {
      this.http.showToast('请选择商品');
      return;
    }
    this.openModal.emit();
    // let modal = this.modalCtrl.create("WoShopDetailCarPage", {}, {
    //   cssClass: 'custom-modal3'
    // });
    // modal.present();
  }

  initNum: number = 0
  _place() {
    if (this.appShopping.salesDetailList.length <= 0) {
      this.http.showToast('请选择商品');
      return;
    }
    this.placeOrder.emit();
    this.initNum++;
    // this.event.notifyDataChanged(GlobalData.sys_wo_take_order, { number: this.initNum })
  }
  //开台下单
  _stayHangOrder() {
    if (this.appShopping.salesDetailList.length <= 0) {
      this.http.showToast('请选择商品');
      return;
      
    }
    this.stayHangOrder.emit();
  }
  // 挂单
  _addItemOfOrder() {
    var me = this;
    if (this.appShopping.salesDetailList.length <= 0) {
      this.http.showToast('请选择商品');
      return;
    }
    var requestData = {
      salesh: this.appShopping && this.appShopping.salesh,
      optType: 'SHARE'
    };
    me.addItemOfOrder.emit();
    //me.webSocketService.sendObserveMessage("CHECKEDTABLEISHOLD", requestData).subscribe(function (retData) {
      //if(retData && retData.success){
      //}
    //})
  }

  //选桌下单
  _hangOrder() {
    if (this.appShopping.salesDetailList.length <= 0) {
      this.http.showToast('请选择商品');
      return;
      // this.navController.push('HangOrderPage');
    }
    this.hangOrder.emit();
  }

  //取消
  result() {
    let alertCtrl = this.alertCtrl.create({
      title: '放弃加菜？',
      // message: res['data'].verDesc,
      cssClass: 'alert-log',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('取消');
          }
        },
        {
          text: '确认',
          handler: () => {
            var me = this;
            //取消占用释放
            var salesData = {
              salesTable:this.appShopping.salesTable,
              salesh:this.appShopping.salesh,
            };
            me.webSocketService.sendObserveMessage("RETURNTABLEVIEW", salesData, { content: '正在返回...', isShowing: false }).subscribe(function () {
              me.shopSer.clearToCartSilent();
              me.navController.popToRoot();
            });
          }
        }
      ]
    });
    alertCtrl.present();
  }
}
