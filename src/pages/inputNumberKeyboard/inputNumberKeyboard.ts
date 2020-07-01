import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SalesCampaign } from '../../domain/sales-campaign';
import { WoShopService } from '../../service/wo.shop.service';
import { UtilProvider } from '../../providers/util/util';
import { AppShopping } from '../../app/app.shopping';
import { HttpProvider } from '../../providers/http';
import { AppPermission } from '../../app/app.permission';


/**
 * Generated class for the KeyboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inputNumberKeyboard',
  templateUrl: 'inputNumberKeyboard.html',
})
export class InputNumberKeyboardPage {
  str: string = '';
  top: { title: '', placeholder: '' };
  number: any = { number: '01', isClear: true, isPwd:false };
  maxLength: number = 13;
  havePoint: boolean = true;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public woShopService: WoShopService,
    public utilProvider: UtilProvider,
    public appShopping: AppShopping,
    public http: HttpProvider,
    public appPer: AppPermission,
    public changeDetectorRef:ChangeDetectorRef,
    public navParams: NavParams) {
  }
  ionViewWillEnter() {
    this.number = this.navParams.get('number');
    this.number.isClear=true;
    this.top = this.navParams.get('top');
    if (this.navParams.get('length')) {
      this.maxLength = this.navParams.get('maxLength');
    }
    if (!this.navParams.get('havePoint')) {
      this.havePoint = this.navParams.get('havePoint');
    }
  }

  ionViewDidEnter() {

    // this.getOffsetTops();
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad KeyboardPage');
  }

  close() {
    this.viewCtrl.dismiss({ data: this.number.number, flag: true });
  }

  confirm() {
    if (!this.number.number) {
      this.http.showToast('请输入数据');
      return;
    }
    this.close();
  }

  foucouce() {
    this.number.isClear = true;
  }

  getShowNumber() {
    // console.log('111111111111111111111111');
    
    if(this.number) {
      if(this.number.isPwd) {
        let numberData = this.number.number;
        if(!numberData || numberData.length<=0) return "";
        return new Array(numberData.length).fill("*").join("");
      }
      if(this.number.number) {
        return this.number.number;
      }
    }
    this.changeDetectorRef.detectChanges();
    return "";
 
  }

}
