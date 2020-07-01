import { Component, Inject, ViewChild } from '@angular/core';
import { AlertController, Content, NavController, App, ModalController, MenuController, Platform } from 'ionic-angular';
import { HttpProvider } from '../../providers/http';
import { WebSocketService } from '../../service/webSocketService';
import { AppShopping } from '../../app/app.shopping';
import { AppCache } from '../../app/app.cache';
import { WoShopService } from '../../service/wo.shop.service';
import { User } from '../../domain/user';
import { UserDao } from '../../dao/userDao';
import { AppConstants } from '../../app/app.constants';
import { AppPermission } from '../../app/app.permission';
import { Observable } from 'rxjs';
import { VersionUtil } from '../../providers/util/VersionUtil';
import { Device } from '@ionic-native/device';
import { ConfigurationDao } from '../../dao/configurationDao';
import { WoShopDetailPage } from '../wxdc/shop/wo-shop-detail/wo-shop-detail';
import { MainOrderPage } from '../wxdc/tab/main-order/main-order';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
// import { Address1 } from './address1';
// import { Address2 } from './address2';
// import { Address3 } from './address3';

/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  @ViewChild(Content) content: Content;
  username: string;
  password: string;
  ip: string;
  data: any = { workId: "1001", password: "1001" };
  seller: any = {};
  isConnectStatus: string = 'syt_sta_outline.png';
  nav: any;
  isLine: boolean = false;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public http: HttpProvider,
    public app: App, public webSocketService: WebSocketService,
    public appShopping: AppShopping,
    public woShopService: WoShopService,
    public appCache: AppCache,
    public modalCtrl: ModalController,
    public userDao: UserDao,
    public appConstants: AppConstants,
    private menuController: MenuController,
    public platform: Platform,
    public versionUtil: VersionUtil,
    public appPer: AppPermission,
    private device: Device,
    public configurationDao: ConfigurationDao,
    public screenOrientation: ScreenOrientation,
  ) {

  }
  ionViewWillEnter() {
    // this.ip = '192.168.1.144';
    this.menuController.enable(false);
    this.getMacId();

  }

  // buidAddrData() {
  //   let addr: any = [];
  //   let addr1 = Address1;

  //   addr1.forEach(a1 => {
  //     let con = {
  //       name: a1.name,
  //       code: a1.code,
  //       children: this.getadd2(a1),
  //     }
  //     addr.push(con)
  //   })
  //   console.log(JSON.stringify(addr));

  // }

  // getadd2(a1) {
  //   let addr2 = Address2;
  //   let list = [];
  //   addr2.forEach(a2 => {

  //     if (a2.parent == a1.code) {
  //       let con2 = {
  //         name: a2.name,
  //         code: a2.code,
  //         children: this.getadd3(a2),
  //       };
  //       list.push(con2)
  //     }
  //   })
  //   return list;
  // }
  // getadd3(a2) {
  //   // debugger
  //   let addr3 = Address3;
  //   let list = [];
  //   for (let a3 of addr3) {
  //     if (a3.parent == a2.code) {
  //       let con3 = {
  //         name: a3.name,
  //         code: a3.code,
  //       }
  //       list.push(con3);
  //     }
  //   }
  //   return list;
  // }


  ionViewWillLoad() {
    // this.versionUtil.openUpdateVersion(false);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SignInPage');
    let me = this;
    setTimeout(() => {
      this.userDao.get(this.appConstants.ID_UESR_TB).then(data => {
        if (data && data.username && data.password) {
          this.username = data.username;
          this.password = data.password;
          this.ip = data.ip;
          if (this.ip == null || this.ip == '') {
            return;
          }
          me.doWebConnect().subscribe(res => {
            if (res) {
              this.signIn(true);
            }
          });
        }
      })
    }, 2000);
  }
  text() {
    // this.login();
  }

  ionViewDidEnter() {
    var idInput = document.getElementById("inp");
    idInput.onkeyup = (event) => {
      if (event.keyCode == 13) {
        //执行相应的方法
        this.signIn();
      }
    }
    //me.webSocketService.connect("192.168.0.104",10002, 60000);

  }
  doLog() {

  }
  doWebConnect() {
    this.isLine = false;
    return Observable.create(observable => {
      this.http.loadingPresent(true, '正在连接服务，请稍后...').subscribe(loading => {
        this.webSocketService.connect(this.ip, 10002, 60000).subscribe(retData => {
          loading.dismiss();
          if (retData.success) {
            this.http.showToast(retData.data);
            this.isLine = true;
            observable.next(true);
          } else {
            this.http.showToast(retData.data);
            this.isLine = false;
            observable.next(false);
          }
        });
      });
    });
  }
  getData() {
    if (this.seller['workId']) {
      this.data['isMd5'] = 1;
    } else {
      this.data['isMd5'] = 0;
    }
    this.data['showLoginText'] = "";
    this.data['isLogining'] = false;
  }
  getMacId() {
    if (this.platform.versions().ios) {
      this.appCache.macId = this.device.uuid;
    } else {
      this.appCache.macId = this.device.uuid;
    }
  }
  // 显示IP
  onShowIP() {
    // this.buidAddrData();
    // let errorTest = [];
    // let a = errorTest[0]['name'];
    let me = this;
    //let loading;
    me.http.loadingPresent(true, '正在连接服务，请稍后...').subscribe(loading => {
      //loading = loading;
      me.webSocketService.connect(this.ip, 10002, 60000).subscribe(res => {
        if (res.success) {
          this.isLine = true;
          me.http.showToast('连接成功！');
          loading.dismiss();
        } else {
          this.isLine = false;
          loading.dismiss();
          me.http.showToast('连接失败！请稍后重试');
        }
      }, err => {
        this.isLine = false;
        loading.dismiss();
        me.http.showToast('连接失败！请稍后重试');
      });
    });

    //this.webSocketService.sendSwapMessage({msgType:"Mobile",bizType:"LOGIN",EVENT:"LOGIN",data:{content:{staffCode:"111",password:"111"}}});
  }
  //登录
  signIn(auto: boolean = false) {
    console.log("signIn");
    let me = this;
    let platform = { deviceType: 'MD', version: this.appConstants.VERSION };//this.appConstants.VERSION
    if (this.platform.versions().ios) {
      platform.deviceType = 'IOS';
    }
    // platform: platform 
    me.webSocketService.sendObserveMessage("LOGIN", { staffCode: me.username, password: me.password, platform: platform }, { content: '登陆中，请稍后...' }).subscribe(function (retData) {
      if (retData && retData.success) {
        if (retData.data.isUpgrade) {
          me.versionUtil.UpdateVersion(true);
          return;
        }
        if (retData.data.version && String(retData.data.version).toLowerCase() <= String('V0.00.19').toLowerCase()) {
          me.http.showToast('收银端版本过低，请更新收银端！');
          return;
        }
        // this.menuController.enable(true);
        me.menuController.enable(true);
        console.log(retData);
        try {
          me.appCache.store = retData.data.store; // store店铺赋值
          me.appCache.seller = retData.data.store;
          me.appShopping.cashier = retData.data.cashier; // staff 员工赋值 
          me.appShopping.staff = retData.data.staff; // staff 员工赋值 
          me.appShopping.handoverh = retData.data.handover;  // handover 交班赋值
          me.appPer.storeParam = retData.data.storeParam.sysSetting;  // 店铺配置信息
          me.appPer.buildStaffPermissionArray(me.appShopping.staff);
          me.appPer.buildstoreParamArray(retData.data.storeParam.sysSetting);
          me.webSocketService.sendObserveMessage("LOADDATA", "*", { timeOut: 2000 }).subscribe(function (retData) {
            if (retData && retData.success) {
              if (me.woShopService.assignmentData(retData)) {
                me.initItem();
                // console.log(me.appShopping);
                me.getConfiguration(me.appCache.store.id);
              }
            }
          });
        } catch (error) {
          me.http.showToast('数据写入异常，请重试！');
        }

      }
    });
  }

  //获取配置信息
  getConfiguration(storeId) {
    this.configurationDao.queryByStoreId(storeId).then(res => {
      console.log('121212121');
      console.log(res);
      if (res && res.length > 0) {
        res.forEach(data => {
          if (data.value == 'false') {
            let key = data.id;
            this.appCache.Configuration[key] = false;
          } else {
            let key = data.id;
            this.appCache.Configuration[key] = data.value;
          }
        })
      }
      // console.log('111111111111111111');
      // console.log(this.appCache);
      //横屏
      if (this.appCache.Configuration && this.appCache.Configuration.DP_LAND) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      } else {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
      if (this.appCache.Configuration && this.appCache.Configuration.DP_MS) {
        this.appCache.rootPage = 'WoShopDetailPage';
        setTimeout(() => {
          this.navCtrl.setRoot(WoShopDetailPage, {}, { animate: true, direction: "forward" });
          this.saveUser();
        }, 500);

      } else {
        this.appCache.rootPage = 'MainOrderPage';
        setTimeout(() => {
          this.navCtrl.setRoot(MainOrderPage, {}, { animate: true, direction: "forward" });
        }, 200);
      }
    }, err => {
      this.http.showToast('获取配置信息出错,请重试！');
    })
  }
  saveUser() {
    let user = new User();
    user.loginTime = new Date().getTime() - 1000;
    user.id = this.appConstants.ID_UESR_TB;
    user.username = this.username;
    user.password = this.password;
    user.ip = this.ip;
    this.userDao.set(user);
  }

  inputIp() {
    let modal = this.modalCtrl.create("IpInputPage", { adress: this.ip }, {
      cssClass: 'custom-modal2'
    });

    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.flag) {
        this.ip = data.data;
        this.doWebConnect().subscribe(res => {
        });
      } else {
        return;
      }
    });
  }
  goToQr() {
    this.navCtrl.push('CommodityQrScanPage', { QRcallback: this.QRcallback, })
  }
  QRcallback: (param: any) => Promise<any> = (params) => new Promise(resolve => {
    this.ip = params.code;
    this.doWebConnect().subscribe();
  });
  initItem() {
    this.appShopping.comSpuList.forEach(comSpu => {
      comSpu.tmpExt = this.woShopService.selectSpuExtById(comSpu.id);
      comSpu.tmpSkuList = this.woShopService.selectSkuBySpuId(comSpu.id);
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
  // onShowIP() {
  //   if (this.isConnectStatus == 'syt_sta_line.png') {
  //     if (this.data['ipAdress'] != undefined) {
  //       this.http.showToast('已连接:' + this.data['ipAdress']);
  //     }
  //   } else {
  //     let dot = ' ...';
  //     if (this.data['ipAdress']) {
  //       setTimeout(function () {
  //         var my_interval = setInterval(function () {
  //           dot += '.';
  //           console.log(dot);
  //           this.http.showToast('正在连接' + this.data.ipAdress + dot);
  //           // showCenter('正在连接'+$scope.data.ipAdress+$scope.dot);

  //         }, 200);

  //         new ws_connectionUtil(this.data.ipAdress).connect(function (success) {
  //           if (success) {

  //             this.connAndLogin();
  //             setTimeout(function () {
  //               if (rootScope.connectStatus == CONNECTMANAGE.CONNECT) {
  //                 this.http.showToast('正在连接' + this.data.ipAdress + dot + '连接成功');
  //                 // showCenter('正在连接'+$scope.data.ipAdress+$scope.dot+'连接成功');
  //                 this.isConnectStatus = 'syt_sta_line.png';
  //                 clearInterval(my_interval);

  //               } else {
  //                 this.http.showToast('正在连接' + this.data.ipAdress + dot + '连接失败');
  //                 // showCenter('正在连接'+$scope.data.ipAdress+$scope.dot+'连接失败');
  //                 this.isConnectStatus = 'syt_sta_outline.png';
  //                 rootScope.clearAllStatus();
  //                 rootScope.setConnectStatus(CONNECTMANAGE.ERROR);
  //                 clearInterval(my_interval);
  //               }
  //             }, 2000);
  //           } else {
  //             this.http.showToast('正在连接' + this.data.ipAdress + dot + '连接失败');
  //             // showCenter('正在连接'+$scope.data.ipAdress+$scope.dot+'连接失败');
  //             this.isConnectStatus = 'syt_sta_outline.png';
  //             rootScope.clearAllStatus();
  //             rootScope.setConnectStatus(CONNECTMANAGE.ERROR);
  //             clearInterval(my_interval);
  //           }
  //         });
  //       }, 500);
  //     } else {
  //       showToast($ionicLoading, '请先手动输入IP');
  //     }


  //   }
  // }


  // connAndLogin() {
  //   if (socket) {
  //     socket.close();
  //     socket = null;
  //   }
  //   $timeout(function () {//
  //     // $scope.showLoginModal();
  //     createConnection('ws://' + $scope.data.ipAdress + ":" + PORT + "/");
  //   }, 500);
  // }

  // setRoot() {
  //   // this.nav = this.app.getActiveNavs();
  //   // this.nav[0].setRoot('WoShopDetailPage');
  //   // ManageSelectPage
  //   // WoShopDetailPage
  //   this.navCtrl.setRoot(WoShopDetailPage, {}, { animate: true, direction: 'forward' });

  // }

  doConfirm() {
    let alert = this.alertCtrl.create({
      title: '过期提示',
      message: '您的APP已到期，请及时续费',
      buttons: [
        {
          text: '确定',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
      ]
    });
    alert.present();
  }
}
