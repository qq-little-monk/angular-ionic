import { Component, Inject, Output, EventEmitter, Input } from '@angular/core';
import { APP_CONFIG, AppConfig } from "../../app/app.config";
import { AppShopping } from '../../app/app.shopping';
import { AppConstants } from '../../app/app.constants';
import { Platform, App, AlertController, ActionSheetController } from 'ionic-angular';
import { VersionUtil } from '../../providers/util/VersionUtil';
import { AppCache } from '../../app/app.cache';
import { AppPermission } from '../../app/app.permission';
import { UserDao } from '../../dao/userDao';
import { SignInPage } from '../sign-in/sign-in';
import { HelperService } from '../../providers/Helper';
import { UtilProvider } from '../../providers/util/util';
import { PRINTER_DEVICE_PAGE } from '../pages.constants';
import { ConfigurationDao } from '../../dao/configurationDao';
import { HttpProvider } from '../../providers/http';
import { WoShopDetailPage } from '../wxdc/shop/wo-shop-detail/wo-shop-detail';
import { MainOrderPage } from '../wxdc/tab/main-order/main-order';

/**
 * Generated class for the AboutUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @Input() navCtrl: any;
  isIOS: boolean = false;
  constructor(@Inject(APP_CONFIG) private config: AppConfig,
    public appShopping: AppShopping,
    public platform: Platform,
    public appConstants: AppConstants,
    public versionUtil: VersionUtil,
    public userDao: UserDao,
    public appCache: AppCache,
    public appPre: AppPermission,
    public app: App,
    public alertCtrl: AlertController,
    public helper: HelperService,
    public util: UtilProvider,
    public http: HttpProvider,
    public configurationDao: ConfigurationDao,
    public actionSheetCtrl: ActionSheetController,
  ) {
    if (this.platform.versions().ios) {
      this.isIOS = true;
    }
  }
  DP_MS: boolean = true;
  ionViewWillEnter() {
    this.DP_MS = this.appCache.Configuration.DP_MS;
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad AboutUsPage');
  }
  swipeEvent(e) {
    // this.navCtrl.pop();
  }
  checkVersion() {
    this.versionUtil.openUpdateVersion(true);
  }
  goAPPStore() {
    window.open(this.appConstants.APP_STORE_URL);
    // this.appCache.Configuration.DP_MS;
  }

  goToUpdateVersionLog() {
    this.navCtrl.push('UpdateVersionLogPage')
  }
  openAboutUSPage() {
    console.log(this.navCtrl);
    this.navCtrl.push("AboutUSPage");
  }

  goCustomerPage(){
    // console.log(this.navCtrl);
    this.navCtrl.push("CustomerPage");
  }

  showMacId() {
    this.util.presentToast('MACID：' + this.appCache.macId, 5000);
  }
  goToSlabSetPage(){
    this.navCtrl.push('SlabSetPage');
  }
  goToSystemSetPage(){
    this.navCtrl.push('SystemSetPage');
  }
  Logout() {

    let alert = this.alertCtrl.create({
      title: '提示',
      message: '确认退出登录？',
      // enableBackdropDismiss: false,
      buttons: [
        { text: '取消', },
        {
          text: '确定',
          handler: () => {
            this.userDao.clear().then(data => {
              this.appCache.resetData();
              this.appPre.resetData();
              this.appCache.resetData();
              this.appShopping.resetData();
              // this.navCtrl.popToRoot();
              // this.navCtrl.setRoot("SignInPage", {}, { animate: false, direction: "forward" });
              this.app.getRootNav().setRoot(SignInPage, {}, { animate: false, direction: 'back' });
            }, err => {
              this.appCache.resetData();
              this.appPre.resetData();
              this.appCache.resetData();
              this.appShopping.resetData();
              this.app.getRootNav().setRoot(SignInPage, {}, { animate: false, direction: 'back' });
            })
          }
        },
      ]
    });
    alert.present();
  }
  goToPrinterDevicePage() {
    this.navCtrl.push(PRINTER_DEVICE_PAGE)
  }
  chooseMode() {
    let alert = this.alertCtrl.create(
      { cssClass: 'spec-alert' }
    );
    alert.setTitle('请选择模式');


    alert.addInput({
      type: 'radio',
      label: '先点餐后选桌',
      value: 'true',
      checked: this.appCache.Configuration.DP_MS,
      handler: () => {
        if (this.appShopping.salesh.id || this.appShopping.salesDetailList.length > 0 || this.appShopping.salesTable.id) {
          this.http.showToast('请先清空购物车!')
          return
        }
        this.appCache.Configuration.DP_MS = true;
        alert.dismiss();
      }
    });
    alert.addInput({
      type: 'radio',
      label: '先选桌后点餐',
      value: 'fales',
      checked: !this.appCache.Configuration.DP_MS,
      handler: () => {
        if (this.appShopping.salesh.id || this.appShopping.salesDetailList.length > 0 || this.appShopping.salesTable.id) {
          this.http.showToast('请先清空购物车!')
          return
        }
        this.appCache.Configuration.DP_MS = false;
        alert.dismiss();
      }
    });

    alert.addButton('取消');
    alert.present();
  }

  toggleFun(id) {
    let me = this
    if (me.appShopping.salesh.id || me.appShopping.salesDetailList.length > 0 || me.appShopping.salesTable.id) {
      me.appCache.Configuration[id] = !me.appCache.Configuration[id];
      me.http.showToast('请先清空购物车!');
      return;
    }
    console.log(id);
    let configuration = {
      id: id,
      value: !me.appCache.Configuration[id],
      storeId: me.appCache.store.id,
      salesId: me.appShopping.staff.id,
    }
    console.log(configuration);

    me.configurationDao.set(configuration).then(res => {
      // console.log(res);
      // console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
      // console.log( this.appCache);
      // console.log( this.appCache.store); 
      if (me.appCache.Configuration[id]) {
        if (me.appCache.rootPage != 'WoShopDetailPage') {
          me.navCtrl.setRoot(WoShopDetailPage, {}, { animate: true, direction: "forward" });
          me.appCache.rootPage = 'WoShopDetailPage'
        }
      } else {
        if (me.appCache.rootPage != 'MainOrderPage') {
          //该模式下判断取单还是下单状态   salesTable.salesId  null下单 ！null 取单
          me.navCtrl.setRoot(MainOrderPage, {}, { animate: true, direction: "forward" });
          me.appCache.rootPage = 'MainOrderPage'
        }
      }
    })
  }

  toggleFunHB(id) {
    let me = this
    console.log(id);
    let configuration = {
      id: id,
      value: !me.appCache.Configuration[id],
      storeId: me.appCache.store.id,
      salesId: me.appShopping.staff.id,
    }

    console.log(configuration);
    me.configurationDao.set(configuration).then(res => {
      me.appCache.Configuration[id] = configuration.value;
    })
  }
}
