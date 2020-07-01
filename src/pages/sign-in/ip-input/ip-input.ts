import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SalesCampaign } from '../../../domain/sales-campaign';
import { WoShopService } from '../../../service/wo.shop.service';
import { UtilProvider } from '../../../providers/util/util';
import { AppShopping } from '../../../app/app.shopping';
import { HttpProvider } from '../../../providers/http';
import { AppPermission } from '../../../app/app.permission';


/**
 * Generated class for the KeyboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ip-input',
  templateUrl: 'ip-input.html',
})
/**整单优惠 */
export class IpInputPage {
  str: string = '';
  address1: any = { number: '192', isClear: false };
  address2: any = { number: '168', isClear: false };
  address3: any = { number: '1', isClear: false };
  address4: any = { number: '0', isClear: false };

  @ViewChild('inputaddress1') inputaddress1;
  @ViewChild('inputaddress2') inputaddress2;
  @ViewChild('inputaddress3') inputaddress3;
  @ViewChild('inputaddress4') inputaddress4;

  addressFlag: number = 1;
  address: string;
  index: number = 1;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public woShopService: WoShopService,
    public utilProvider: UtilProvider,
    public appShopping: AppShopping,
    public http: HttpProvider,
    public appPer: AppPermission,
    public navParams: NavParams) {
  }
  ionViewWillEnter() {
    this.address = this.navParams.get('adress');
    if (this.address&&this.address.length > 0) {
      let list = this.address.split('.');
      this.address1.number = list[0];
      this.address2.number = list[1];
      this.address3.number = list[2];
      this.address4.number = list[3];
    }
  }
  checkValue(index, address) {
    this.index = index;
    this.address1.isClear = false;
    this.address2.isClear = false;
    this.address3.isClear = false;
    this.address4.isClear = false;
    address.isClear = true;
  }

  ionViewDidEnter() {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad KeyboardPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  confirm() {
    let address = `${this.address1.number}.${this.address2.number}.${this.address3.number}.${this.address4.number}`;
    this.viewCtrl.dismiss({ data: address, flag: true });
  }





  changer(campaignType) {

    if (campaignType == '3') {


    } else {


    }
  }

}
