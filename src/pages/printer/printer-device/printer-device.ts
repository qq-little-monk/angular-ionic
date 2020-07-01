import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BLE } from '@ionic-native/ble';
import { APP_CONFIG, AppConfig } from '../../../app/app.config';
import { AppCache } from '../../../app/app.cache';
import { PrinterType, linkType } from '../../../domain/enum';
import { PRINTER_DEVICE_SELECT_PAGE, PRINTER_DEVICE_WIFI_PAGE, PRINTER_DEVICE_BLUETOOTH_PAGE, PRINTER_KT_LIST_PAGE } from '../../pages.constants';
import { PrintProvider } from '../../../providers/print';
import { PrinterDeviceDao } from '../../../dao/PrinterDeviceDao';
import { OrderProvider } from '../../../providers/order/order';
import { AppShopping } from '../../../app/app.shopping';
import { ConfigurationDao } from '../../../dao/configurationDao';
import { HttpProvider } from '../../../providers/http';

/**
 * Generated class for the PrinterDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-printer-device',
  templateUrl: 'printer-device.html',
})
export class PrinterDevicePage {
  ktPrints: any[] = [];
  kichentStatus: number = 0;
  bluetoothOpenFlag: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public printProvider: PrintProvider,
    public printerDeviceDao: PrinterDeviceDao, public orderProvider: OrderProvider, public platform: Platform,
    public bluetoothSerial: BluetoothSerial, public ble: BLE, public http: HttpProvider,
    public appShopping: AppShopping, public configurationDao: ConfigurationDao,
    @Inject(APP_CONFIG) private config: AppConfig, public appCache: AppCache) {
  }
  Configuration = this.appCache.Configuration;
  ionViewDidLoad() {
    console.log('ionViewDidLoad PrinterDevicePage');
  }

  ionViewWillEnter() {
    this.isBluetoothOpen();
    // this.orderProvider.checkStatus();
    this.kichentStatus = this.printProvider.getKichentStatus();
    this.printerDeviceDao.queryByPrinterType(String(PrinterType.kitchenPrinter), this.appCache.seller.id).then(data => {
      this.ktPrints = data
    })
  }

  editReceiptPrinter() {
    if (this.printProvider.receiptPrinter.id == null) {
      this.navCtrl.push(PRINTER_DEVICE_SELECT_PAGE, { printerType: String(PrinterType.receiptPrinter) })
    } else {
      if (this.printProvider.receiptPrinter.linkType == String(linkType.wifi)) {
        this.navCtrl.push(PRINTER_DEVICE_WIFI_PAGE, {
          printerType: String(PrinterType.receiptPrinter),
          device: this.printProvider.receiptPrinter
        })
      } else {
        this.navCtrl.push(PRINTER_DEVICE_BLUETOOTH_PAGE, {
          printerType: String(PrinterType.receiptPrinter),
          device: this.printProvider.receiptPrinter
        })
      }
    }
  }

  editKichentPrinter() {
    this.navCtrl.push(PRINTER_KT_LIST_PAGE);
  }

  editTablePrinter() {
    if (this.printProvider.tablePrinter.id == null) {
      this.navCtrl.push(PRINTER_DEVICE_SELECT_PAGE, { printerType: String(PrinterType.tablePrinter) })
    } else {
      this.navCtrl.push(PRINTER_DEVICE_WIFI_PAGE, {
        printerType: String(PrinterType.tablePrinter),
        device: this.printProvider.tablePrinter
      })
    }
  }

  editImgPrinter() {
    if (this.printProvider.imgPrinter.id == null) {
      this.navCtrl.push(PRINTER_DEVICE_SELECT_PAGE, { printerType: String(PrinterType.imgPrinter) })
    } else {
      this.navCtrl.push(PRINTER_DEVICE_BLUETOOTH_PAGE, {
        printerType: String(PrinterType.imgPrinter),
        device: this.printProvider.imgPrinter
      })
    }
  }

  editTagPrinter() {
    if (this.printProvider.tagPrinter.id == null) {
      this.navCtrl.push(PRINTER_DEVICE_SELECT_PAGE, { printerType: String(PrinterType.tagPrinter) })
    } else {
      if (this.printProvider.tagPrinter.linkType == String(linkType.wifi)) {
        this.navCtrl.push(PRINTER_DEVICE_WIFI_PAGE, {
          printerType: String(PrinterType.tagPrinter),
          device: this.printProvider.tagPrinter
        })
      } else {
        this.navCtrl.push(PRINTER_DEVICE_BLUETOOTH_PAGE, {
          printerType: String(PrinterType.tagPrinter),
          device: this.printProvider.tagPrinter
        })
      }
    }
  }

  isBluetoothOpen() {
    if (this.platform.versions().ios) {
      this.ble.isEnabled().then(data => {
        console.log('isEnabled++++++++++++++++++++++++++++++++++++++');
        console.log(data);
        this.bluetoothOpenFlag = true;
        return true;
      }, err => {
        this.bluetoothOpenFlag = false;
        return false;
      })
    } else {
      this.bluetoothSerial.isEnabled().then(data => {
        if (data == "OK") {
          this.bluetoothOpenFlag = true;
          return true;
        }
      }, error => {
        // this.http.showToast('蓝牙已关闭，请打开蓝牙');
        this.bluetoothOpenFlag = false;
        return false;
      })
    }
  }

  toggleFun(id) {
    console.log(id);
    let configuration = {
      id: id,
      value: this.Configuration[id] || false,
      storeId: this.appCache.store.id,
      salesId: this.appShopping.staff.id,
    }
    console.log(configuration);

    this.configurationDao.set(configuration).then(res => {
      console.log(res);
    })
  }

  fontSize(id) {
    console.log(id);
    let configuration = {
      id: id,
      value: this.Configuration[id] || 0,
      storeId: this.appCache.store.id,
      salesId: this.appShopping.staff.id,
    }
    console.log(configuration);

    this.configurationDao.set(configuration).then(res => {
      console.log(res);
    })
  }


}
