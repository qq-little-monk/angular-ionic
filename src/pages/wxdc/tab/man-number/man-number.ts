import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { WoShopService } from '../../../../service/wo.shop.service';
import { SalesCampaign } from '../../../../domain/sales-campaign';
import { UtilProvider } from '../../../../providers/util/util';
import { AppShopping } from '../../../../app/app.shopping';
import { SalesDetail } from '../../../../domain/salesDetail';
import { HttpProvider } from '../../../../providers/http';
import { SalesPay } from '../../../../domain/salesPay';
import { AppCache } from '../../../../app/app.cache';
import { TableService } from '../../../../service/tableService';
import { WebSocketService } from '../../../../service/webSocketService';
import { AppPermission } from '../../../../app/app.permission';

/**
 * Generated class for the KeyboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-man-number',
  templateUrl: 'man-number.html',
})
export class ManNumberPage {
  str: string = '';
  tab: any = {};
  man: any = { number: '0', isClear: true, selected: true };
  teaAmt: any = { number: '0', isClear: false, selected: false };
  deposit: any = { number: '0', isClear: false, selected:  false };
  staff: any = {};
  remark: string = '';
  salesDetail: any;
  // 活动类型 （1活动 2 赠送 3 自定义折扣 4 改价 5 会员优惠 （整单表示会员折扣，单品表示会员价） 6 套餐）
  campaignType: string = '3';
  area: any = {};
  hangOrderNavCtrl: any;
  salesTable: any = {};

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public woShopService: WoShopService,
    public utilProvider: UtilProvider,
    public appShopping: AppShopping,
    public http: HttpProvider,
    public appCache: AppCache,
    public tableService: TableService,
    public appPer: AppPermission,
    public webSocketService: WebSocketService,
    public changeDetectorRef: ChangeDetectorRef,
    public navParams: NavParams) {

  }
  ionViewWillEnter() {
    this.man.isClear = true;
    this.man.selected = true;
    if (this.navParams.get('tab')) {
      this.tab = this.navParams.get('tab');
      this.area = this.navParams.get('area');
      // debugger
      this.hangOrderNavCtrl = this.navParams.get('navCtrl');
      this.man.number = String(this.tab.personNum ? this.tab.personNum : '0');
      this.teaAmt.number = String(this.tab.teaAmt ? this.tab.teaAmt : '0');
      this.remark = String(this.tab.remark ? this.tab.remark : '');
    } else {
      /**加菜 */
      let tmpTab = this.navParams.get('salesTable');
      // let tmpTab = this.appShopping.salesTable;
      console.log(tmpTab);
      if (tmpTab) {
        this.salesTable = tmpTab;
        this.tab = tmpTab;
        this.man.number = String(tmpTab.personNum ? tmpTab.personNum : '0');
        this.teaAmt.number = String(this.tab.teaAmt ? this.tab.teaAmt : '0');
        this.remark = String(this.tab.remark ? this.tab.remark : '');
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  refresh() {
    this.changeDetectorRef.detectChanges();
  }

  getCampaignType() {

  }

  ionViewDidEnter() {

    // this.getOffsetTops();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KeyboardPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  foucouce(flag) {
    if (flag == 1) {
      if (!this.appPer.staffPermission('6002')) {
        this.http.showToast('无【修改茶位费】权限');
        this.teaAmt.isClear = false;
        this.teaAmt.selected = false;
        this.man.isClear = true;
        this.man.selected = true;
        this.deposit.isClear = true;
        this.deposit.selected = true;
        return;
      } else {
        this.man.isClear = false;
        this.man.selected = false;
        this.deposit.isClear = false;
        this.deposit.selected = false;
        this.teaAmt.isClear = true;
        this.teaAmt.selected = true;
      }

    } else if((flag == 2)) {
      this.teaAmt.isClear = false;
      this.teaAmt.selected = false;
      this.deposit.isClear = false;
      this.deposit.selected = false;
      this.man.isClear = true;
      this.man.selected = true;
      
    }else if((flag == 3)) {
      this.teaAmt.isClear = false;
      this.teaAmt.selected = false;
      this.man.isClear = false;
      this.man.selected = false;
      this.deposit.isClear = true;
      this.deposit.selected = true;
    }
    this.changeDetectorRef.detectChanges();
  }


  confirm() {
    // this.close();
    if (!this.man.number||this.utilProvider.checkNumEquals(this.man.number,0)) {
      this.http.showToast('请输入正确的人数');
      return;
    }
    if (this.teaAmt.number == '' || this.teaAmt.number == null) {
      this.http.showToast('请输入茶位费');
      return
    }
    this.viewCtrl.dismiss({ 
      number: this.man.number, 
      teaAmt: this.teaAmt.number, 
      deposit: this.deposit.number,
      remaker: this.remark, 
      flag: true 
    });

  }



}
