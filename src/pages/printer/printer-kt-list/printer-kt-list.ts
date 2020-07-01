import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PrinterDeviceDao } from '../../../dao/PrinterDeviceDao';
import { AppCache } from '../../../app/app.cache';
import { APP_CONFIG, AppConfig } from '../../../app/app.config';
import { HttpProvider } from '../../../providers/http';
import { PrintProvider } from '../../../providers/print';
import { PrinterType } from '../../../domain/enum';
import { PRINTER_KT_ADD_PAGE } from '../../pages.constants';
import { PrinterDevice } from '../../../domain/printerDevice';
import { CommodityType } from '../../../domain/commodity-type';


/**
 * Generated class for the PrinterKtListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-printer-kt-list',
  templateUrl: 'printer-kt-list.html',
})
export class PrinterKtListPage {
  deviceList: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public printerDeviceDao: PrinterDeviceDao, public appCache: AppCache,
    @Inject(APP_CONFIG) private config: AppConfig, public http: HttpProvider, public printProvider: PrintProvider, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrinterKtListPage');
  }

  ionViewWillEnter() {
    this.printerDeviceDao.queryByPrinterType(String(PrinterType.kitchenPrinter), this.appCache.seller.id).then(data => {
      this.deviceList = data;
      this.setStatus();

      this.printProvider.checkKichentPrinter(this.printProvider.kitchenPrinterMap).then(res => {
        this.setStatus();
      }, err => {
        this.setStatus();
      });
    })
  }

  setStatus() {
    for (var i = 0; i < this.deviceList.length; i++) {
      let p = this.printProvider.kitchenPrinterMap.get(this.deviceList[i].id);
      if (p) {
        this.deviceList[i].connectStatus = p.connectStatus;
      }
    }
  }
  edit(printer) {
    this.navCtrl.push(PRINTER_KT_ADD_PAGE, {
      device: printer
    })
  }

  add() {
    //this.navCtrl.push(PRINTER_DEVICE_SELECT_PAGE, {printerType: String(PrinterType.kitchenPrinter)})
    this.navCtrl.push(PRINTER_KT_ADD_PAGE, {
      device: PrinterDevice.toJson()
    })
  }

}
