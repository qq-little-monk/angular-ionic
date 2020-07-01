import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { PrinterDeviceDao } from '../../../dao/PrinterDeviceDao';
import { PrinterType } from '../../../domain/enum';
import { PRINTER_DEVICE_WIFI_PAGE, PRINTER_KT_ADD_PAGE, PRINTER_DEVICE_BLUETOOTH_PAGE } from '../../pages.constants';
import { PrinterDevice } from '../../../domain/printerDevice';

/**
 * Generated class for the PrinterDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-printer-device-select',
  templateUrl: 'printer-device-select.html',
})
export class PrinterDeviceSelectPage {
  printerType: string;
  desc: string;
  preView: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public printerDeviceDao: PrinterDeviceDao,
              public viewCtrl: ViewController) {
    this.preView = this.navParams.get('preView');

    if(this.preView != null){
      this.navCtrl.removeView(this.preView)
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrinterDeviceSelectPage');
  }

  ionViewWillEnter() {
    this.printerType = this.navParams.get('printerType');
    switch (this.printerType) {
      case String(PrinterType.receiptPrinter): {
        this.desc = '小票打印机';
        break;
      }
      case String(PrinterType.kitchenPrinter): {
        this.desc = '厨房打印机';
        break;
      }
      case String(PrinterType.tablePrinter): {
        this.desc = '台单打印机';
        break;
      }
      case String(PrinterType.imgPrinter): {
        this.desc = '图片打印机';
        break;
      }
      default:
    }
  }

  goToPrinterDeviceWifiPage() {
    switch (this.printerType) {
      case String(PrinterType.receiptPrinter): {
        this.navCtrl.push(PRINTER_DEVICE_WIFI_PAGE, {printerType: this.printerType, device: PrinterDevice.toJson(), viewCtrl: this.viewCtrl})
        break;
      }
      case String(PrinterType.tagPrinter): {
        this.navCtrl.push(PRINTER_DEVICE_WIFI_PAGE, {printerType: this.printerType, device: PrinterDevice.toJson(), viewCtrl: this.viewCtrl})
        break;
      }
      case String(PrinterType.kitchenPrinter): {
        this.navCtrl.push(PRINTER_KT_ADD_PAGE, {
          device: PrinterDevice.toJson(),
          viewCtrl: this.viewCtrl
        })
        break;
      }
      default:
    }
  }

  goToPrinterDeviceBluetoothPage() {
    this.navCtrl.push(PRINTER_DEVICE_BLUETOOTH_PAGE, {printerType: this.printerType, device: PrinterDevice.toJson(), viewCtrl: this.viewCtrl})
  }
}
