import { NgModule, ErrorHandler, ElementRef } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, Config } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { Toast } from "@ionic-native/toast";
import { Geolocation } from "@ionic-native/geolocation";
import { SQLite } from "@ionic-native/sqlite";
import { Camera } from "@ionic-native/camera";
import { Vibration } from '@ionic-native/vibration';
import { Badge } from '@ionic-native/badge';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { File } from '@ionic-native/file'
import { FileOpener } from "@ionic-native/file-opener";
import { Transfer } from "@ionic-native/transfer";
import { DatePipe, DecimalPipe } from "@angular/common";
import { Network } from "@ionic-native/network";
import { QRScanner } from "@ionic-native/qr-scanner";
import { NativeAudio } from '@ionic-native/native-audio';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { PhotoLibrary } from "@ionic-native/photo-library";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
// import {ChartsModule} from "ng2-charts";
import { BackgroundMode } from "@ionic-native/background-mode";
import { Keyboard } from "@ionic-native/keyboard";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
import { BLE } from '@ionic-native/ble';

import { PipesModule } from "../pipes/pipes.module";
import { IonAffixModule } from "../directives/ion-affix.module";
import { DaoModule } from "../dao/dao.module";

//providers
import { JwtInterceptor } from '../providers/jwt-interceptor';
import { HttpProvider } from '../providers/http';
import { DbProvider } from '../providers/db';
import { PushProvider } from '../providers/push';
import { NativeProvider } from '../providers/native';
import { UtilProvider } from "../providers/util/util";
import { VersionUtil } from "../providers/util/VersionUtil";
import { ExportProvider } from '../providers/export/export';

import { APP_CONFIG, APP_SIT_CONFIG, APP_UAT_CONFIG, APP_PRD_CONFIG } from "./app.config";



import { OrderProvider } from "../providers/order/order";
import { AppMinimize } from '@ionic-native/app-minimize';
import { AppConstants } from './app.constants';
import { AppCache } from './app.cache';
import { PinYin } from '../providers/pinyin'
import { AppPermission } from './app.permission';
import { DirectivesModule } from '../directives/directives.module';
import { ServiceModule } from '../service/service.module';

import { ModalFromRightEnter, ModalFromRightLeave, ModalScaleEnter, ModalScaleLeave } from './modal-transitions';
import { EventsProvider } from '../providers/Events';
import { HelperService } from '../providers/Helper';
import { AppShopping } from './app.shopping';
import { CommonStatusEnum } from '../providers/common.statusenum';
// import { MenuPage } from '../pages/menu/menu';
import { ComponentsModule } from '../components/components.module';
import { QrScanUtilProvider } from '../providers/util/QrScanUtil';
import { GlobalErrorHandler } from '../providers/util/globalErrorHandler';
import { SignInPage } from "../pages/sign-in/sign-in";
// import { AppErrorHandler } from '../providers/app-error-handler';
import { Device } from '@ionic-native/device';
import { PrintUtilProvider } from '../providers/util/PrintUtil';
import { PrintProvider } from '../providers/print';
import { WoShopDetailCarPage } from '../pages/wxdc/shop/wo-shop-detail-car/wo-shop-detail-car';
import { WoShopDetailPage } from '../pages/wxdc/shop/wo-shop-detail/wo-shop-detail';
import { WoShopDetailSpecPage } from '../pages/wxdc/shop/wo-shop-detail-spec/wo-shop-detail-spec';
import { SetSalesDetailNumberPage } from '../pages/wxdc/shop/setSalesDetailNumber/setSalesDetailNumber';
import { DiscountKeyboardPage } from '../pages/wxdc/shop/discountkeyboard/discountkeyboard';
import { MainOrderPage } from '../pages/wxdc/tab/main-order/main-order';
import { EditTastePage } from '../pages/wxdc/shop/editTaste/editTaste';
// import { ProductionDetailPage} from '../pages/wxdc/shop/production-detail/production-detail';
// import { QrCoderPayPage} from '../pages/wxdc/pay/qrCodePay/qrCoderPay';

import { JPush } from '@jiguang-ionic/jpush';
// import { Umeng } from '../me-native/umeng/umeng';

// import { AboutUSPage } from '../pages/about-us/about-us';

const components = [SignInPage, WoShopDetailCarPage, WoShopDetailPage, WoShopDetailSpecPage, SetSalesDetailNumberPage, DiscountKeyboardPage, MainOrderPage,
  EditTastePage
  // PlaceOrderRemarkPage, PayMentkeyboardPage, DiscountKeyboardPage, SetSalesDetailNumberPage, WoShopDetailCarPage,
  // ManNumberPage, InputNumberKeyboardPage,
  // AboutUSPage// SkuPopover, CheckOutModal,// CheckOut_NoCodeModal,
  // LablePopover, TableCheckOutModal, ExamplePopover
];
// import VConsole from 'vconsole';
// new VConsole();
const providers = [SQLite, DbProvider, Toast, Geolocation, Network, Camera, Vibration,QRScanner, File, DatePipe, Keyboard, NativeAudio, BluetoothSerial, BLE,
  PhotoViewer, HttpProvider, PushProvider, UtilProvider, NativeProvider, DecimalPipe, QrScanUtilProvider, GlobalErrorHandler, Device, PrintUtilProvider, PrintProvider,
  OrderProvider, PhotoLibrary, ScreenOrientation, File, FileOpener, Transfer, VersionUtil, BackgroundMode, PinYin, CommonStatusEnum,//PushOriginal,
  ExportProvider, Badge, LocalNotifications];

@NgModule({
  declarations: [
    MyApp,
    ...components
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    HttpClientModule,
    PipesModule,
    DaoModule,
    ServiceModule,
    IonAffixModule,
    DirectivesModule,
    ComponentsModule,


    //ChartsModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'push',
      swipeBackEnabled: true,
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false,
      // backButtonIcon: "ios-arrow-back",
      backButtonText: '',
      pageTransition: 'ios-transition',
      iconMode: "ios",
      mode: 'ios',
      activator: 'highlight',
      platforms: {
        ios: {
          mode: 'ios',
          menuType: 'overlay',
        },
        // android: {
        //   mode: 'md',
        // }
      },
      tabsPlacement: 'bottom',
      tabsHideOnSubPages: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ...components
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppMinimize,
    AppConstants,
    AppCache,
    AppShopping,
    AppPermission,
    EventsProvider,
    HelperService,
    JPush,
    // JpushUtil,
    // Upush,
    // IonicErrorHandler GlobalErrorHandler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    // { provide: APP_CONFIG, useValue: APP_SIT_CONFIG },
    // {provide: APP_CONFIG, useValue: APP_UAT_CONFIG},
    { provide: APP_CONFIG, useValue: APP_PRD_CONFIG },

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    // { provide: ErrorHandler, useClass: AppErrorHandler },
    ...providers,
    ExportProvider
  ]
})
export class AppModule {
  constructor(public config: Config) {
    this.setCustomTransitions();
  }

  private setCustomTransitions() {
    this.config.setTransition('modal-from-right-enter', ModalFromRightEnter);
    this.config.setTransition('modal-from-right-leave', ModalFromRightLeave);
    this.config.setTransition('modal-scale-enter', ModalScaleEnter);
    this.config.setTransition('modal-scale-leave', ModalScaleLeave);
  }
}
