import { Component, ViewChild } from '@angular/core';
import { App, Platform, IonicApp, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SignInPage } from "../pages/sign-in/sign-in";
import { HttpProvider } from "../providers/http";
// import {PrintProvider} from "../providers/print";
import { DbProvider } from "../providers/db";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { VersionUtil } from "../providers/util/VersionUtil";
import { NativeProvider } from "../providers/native";
import { BackgroundMode } from "@ionic-native/background-mode";
import { Keyboard } from "@ionic-native/keyboard";
import { AppMinimize } from "@ionic-native/app-minimize";
import { AppCache } from './app.cache';
import { Badge } from '@ionic-native/badge';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PushProvider } from '../providers/push';
import { SellerDao } from '../dao/sellerDao';
import { WebSocketService } from '../service/webSocketService';
import { JPush } from '@jiguang-ionic/jpush';
// import { Seller } from '../domain/seller';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  flag: boolean = true;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public ionicApp: IonicApp, public appCache: AppCache, public badge: Badge,//printProvider: PrintProvider, 
    public sellerDao: SellerDao,// private Seller: Seller,
    public jPush: JPush,
    httpProvider: HttpProvider, db: DbProvider, screenOrientation: ScreenOrientation, private appMinimize: AppMinimize, private localNotifications: LocalNotifications, public pushProvider: PushProvider,
    public native: NativeProvider, public app: App, backgroundMode: BackgroundMode, public keyboard: Keyboard, private http: HttpProvider, public webSocketService: WebSocketService) {
    // umeng.init('', '');
    platform.ready().then(() => {
      this.jPush.init().then(() => {

      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      // let status bar overlay webview
      if (platform.versions().ios) {
        if (platform.versions().ios.num < 11) {
          statusBar.overlaysWebView(true);
        } else {
          statusBar.overlaysWebView(false);
        }
        statusBar.backgroundColorByHexString('orange');
        statusBar.styleLightContent();
      } else {
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString('orange');
      }

      // keyboard.disableScroll(true);
      db.initTables();
      this.rootPage = SignInPage;
      setTimeout(() => {
        splashScreen.hide();
      }, 1000);

      // this.versionUtil.openUpdateVersion();

      if (httpProvider.isMobileDevice()) {

        localNotifications.requestPermission();

        //禁止屏幕横屏
        screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);

        //socket 监听
        //printProvider.addReceiveListeners();
        backgroundMode.setDefaults({ title: "爱宝点菜宝", text: "智能爱宝，连锁未来" });

        backgroundMode.on("activate").subscribe(() => {
          // this.getPushList();
          // this.appCache.badgeNum = this.appCache.totalMsgNum;
          console.log("websocket reconnect");
          this.webSocketService.reconnect(true);
          this.appCache.isBackgroundMode = true;
        });

        backgroundMode.on("deactivate").subscribe(() => {
          // this.appCache.badgeNum = this.appCache.totalMsgNum;
          this.native.msgBadge();
          this.appCache.isBackgroundMode = false;
        });
        backgroundMode.enable();

        backgroundMode.isScreenOff().then(off => {
          if (off) {
            backgroundMode.wakeUp()
          }
        });

        window.addEventListener('native.keyboardshow', function (e) {
          // todo 进行键盘可用时操作
          //e.keyboardHeight 表示软件盘显示的时候的高度
          //this.http.showToast('软件盘弹出了');
          app.getActiveNav()._views[0].getContent().scrollTo(0, e['keyboardHeight']);
        });
        // keyboard.hideKeyboardAccessoryBar(true)
      }

      //     document.addEventListener("resume", ()=>{
      //           
      //     }, false);

      //     document.addEventListener("pause", ()=>{  
      //        
      //     }, false);

      if (platform.is('android')) {
        platform.registerBackButtonAction(() => {
          let loadingPortal = this.ionicApp._loadingPortal.getActive();
          if (loadingPortal) {
            if (!loadingPortal["exitFlag"]) { //loading的话，返回键无效
              return;
            } else {
              loadingPortal.dismiss().catch((error) => { console.error(error) });
            }
          }

          let overlayPortal = this.ionicApp._overlayPortal.getActive();
          if (overlayPortal) {
            //其他的关闭      
            overlayPortal.dismiss('backdrop').catch((error) => { console.error(error) });
            return;
          }

          let activePortal = this.ionicApp._modalPortal.getActive();
          if (activePortal) {
            //其他的关闭
            activePortal.dismiss().catch((error) => { console.error(error) });
            //activePortal.onDidDismiss(() => {});
            return;
          }

          // console.warn('app.getActiveNavs()');
          // console.warn(app.getActiveNavs());
          //
          //
          //
          //(getRootNav) is deprecated and will be removed in the next major release. Use getRootNavById instead
          // console.warn(app.getRootNav());


          // console.warn('app.getRootNavs()');
          // console.warn(app.getRootNavs());
          //
          // let rootNavCtrl: NavController;
          //
          // rootNavCtrl =  app.getRootNavs()[0]
          // console.warn('rootNavCtrl.getViews().length')
          // console.warn(rootNavCtrl.getViews().length)
          //
          //
          // console.warn(rootNavCtrl.getActiveChildNavs().length)
          //
          //
          // console.warn(rootNavCtrl.getAllChildNavs().length)
          //
          //
          // console.warn(rootNavCtrl.length())
          //
          // console.warn(rootNavCtrl.getPrevious())
          //
          // console.warn(app.getActiveNavs().length)

          if (app.getActiveNav().length() <= 1) {
            this.flag = !this.flag;

            setTimeout(() => {
              this.flag = true
            }, 3000);

            if (this.flag) {
              // platform.exitApp()
              this.appMinimize.minimize();
            } else {
              this.http.showToast('再按一次退出', true);
            }
          } else {
            app.getActiveNav().pop();
            return;
          }
        })
      }

      //监听网络状态
      this.native.listenNewworkChange();
      // this.native.setErr();
      native.initSound();
    });
  }

}
