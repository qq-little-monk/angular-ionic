import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { Events, ModalController, NavController, NavParams, PopoverController, IonicPage } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import { HttpProvider } from "../../providers/http";
import { Observable } from "rxjs/Observable";
import { NativeProvider } from "../../providers/native";
//import {HomePage} from "../home/home";
//import {PrintProvider} from "../../providers/print";
import { APP_CONFIG, AppConfig } from "../../app/app.config";
import { CHECK_OUT_PAGE } from "../pages.constants";
import { UtilProvider } from "../../providers/util/util";
// import { OrderProvider } from "../../providers/order/order";
import { AppCache } from '../../app/app.cache';

/**
 * Generated class for the QrScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-qr-scan',
  templateUrl: 'qr-scan.html',
})
export class QRScanPage {
  sellId: string;
  placeId: string;
  payType: string;
  total: number;
  callback: (data: any) => Promise<any>;
  lightEnabled: boolean = false;
  frontCameraEnabled: boolean = false;
  scanSub: any;
  refs: any[] = [];
  interval: any;

  preView: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public qrScanner: QRScanner, public events: Events, public appCache: AppCache,
    public renderer: Renderer2, public elementRef: ElementRef, public httpProvider: HttpProvider,// public orderProvider: OrderProvider,//public printProvider: PrintProvider,
    public native: NativeProvider, @Inject(APP_CONFIG) public config: AppConfig, public modalCtrl: ModalController, public popoverCtrl: PopoverController, private util: UtilProvider) {
  }

  ionViewWillEnter() {
    this.sellId = this.navParams.get('sellId');
    this.placeId = this.navParams.get('placeId');
    this.payType = this.navParams.get('payType');
    this.total = this.navParams.get('total');
    this.callback = this.navParams.get('callback');
    this.preView = this.navParams.get('preView');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrScanPage');
    this.refs = this.elementRef.nativeElement.parentElement.querySelectorAll('.tabbar');
  }

  ionViewWillLeave() {

  }

}
