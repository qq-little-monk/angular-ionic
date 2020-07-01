
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { HttpProvider } from "../../../../providers/http";
import { AppCache } from "../../../../app/app.cache";
import { WoShopService } from "../../../../service/wo.shop.service";
import { SalesCusts } from "../../../../domain/sales-custs";
import { AppShopping } from "../../../../app/app.shopping";

/**
 * Generated class for the WoSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-info',
  templateUrl: 'customer-info.html',
})
export class CustomerInfoPage {
  customer: any = {};
  searchNav: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, public appCache: AppCache,
    public woShopService: WoShopService, public appShopping: AppShopping,
  ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WoSearchPage');
  }
  ionViewWillEnter() {
    // console.log('11111111111111111111111111111');
    // console.log(this.navParams);

    this.customer = this.navParams.get('customer');
    this.searchNav = this.navParams.get('searchNav');
  }
  ionViewWillLeave() {

  }
  checkedCustomer() {
    if (this.customer.status == 'N') {
     this.http.showToast('该会员已被禁用');
     return;
    } 
    // debugger
    this.woShopService.checkedCustomer(this.customer);
    // this.searchNav.;
    // this.navCtrl.remove(1);
    this.navCtrl.removeView(this.searchNav);
    this.navCtrl.pop();
    this.woShopService.doLog();
    // this.navCtrl.popToRoot();
  }
  resultCustomer() {
    this.woShopService.resultCustomer();
    // this.navCtrl.popToRoot();
    // this.searchNav.pop();
    this.navCtrl.pop();
  }


}
