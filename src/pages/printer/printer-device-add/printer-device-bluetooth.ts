import { Component, Inject, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ViewController, Platform } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";
import { Md5 } from "ts-md5/dist/md5";
import { BLE } from '@ionic-native/ble';
import { IPrinterDevice, PrinterDevice } from '../../../domain/printerDevice';
import { APP_CONFIG, AppConfig } from '../../../app/app.config';
import { AppCache } from '../../../app/app.cache';
import { PrinterDeviceDao } from '../../../dao/PrinterDeviceDao';
import { PrintProvider } from '../../../providers/print';
import { NativeProvider } from '../../../providers/native';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { UtilProvider } from '../../../providers/util/util';
import { OrderProvider } from '../../../providers/order/order';
import { HttpProvider } from '../../../providers/http';
import { PrinterType, linkType } from '../../../domain/enum';
import { PRINTER_KT_ADD_PAGE, PRINTER_DEVICE_SELECT_PAGE } from '../../pages.constants';

// /**
//  * Generated class for the PrinterDeviceBluetoothPage page.
//  *
//  * See https://ionicframework.com/docs/components/#navigation for more info on
//  * Ionic pages and navigation.
//  */
@IonicPage()
@Component({
  selector: 'page-printer-device-bluetooth',
  templateUrl: 'printer-device-bluetooth.html',
})
export class PrinterDeviceBluetoothPage {
  @ViewChild(Content) content: Content;
  printerType: string;
  bluetoothSerialDevices: any[] = [];
  device: IPrinterDevice = PrinterDevice.toJson();
  searchBtn: boolean = false;
  observer: Subscription;
  desc: string;

  retry: boolean = false;
  interval: any;
  timeCount: number = 3;  //3秒倒计时

  _viewCtrl: any;
  isSelect: boolean = false;

  size: 1;
  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(APP_CONFIG) private config: AppConfig, public appCache: AppCache,
    public printerDeviceDao: PrinterDeviceDao, public print: PrintProvider, public nativeProvider: NativeProvider, public bluetoothSerial: BluetoothSerial,
    public viewCtrl: ViewController, private util: UtilProvider, public orderProvider: OrderProvider, public http: HttpProvider, public ble: BLE,
    public platform: Platform, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrinterDeviceBluetoothPage');
  }
  isIosOrMd() {
    if (this.platform.versions().ios) {

    } else {

    }
  }

  ionViewWillEnter() {
    this._viewCtrl = this.navParams.get('viewCtrl');
    this.printerType = this.navParams.get('printerType');
    this.device = this.navParams.get('device');
    if (this.device.size) {

    } else {
      this.device.size = 1;
    }
    switch (this.printerType) {
      case String(PrinterType.receiptPrinter): {
        this.desc = '小票打印机';
        break;
      }
      case String(PrinterType.kitchenPrinter): {
        this.desc = '厨房打印机';
        this.isSelect = true;
        break;
      }
      case String(PrinterType.imgPrinter): {
        this.desc = '图片打印机';
        break;
      }
      default:
    }
    let currTime = this.nativeProvider.bluetoothMap.get("currTime");
    if (currTime) {
      let dif = (new Date().getTime() - currTime) / (60 * 1000);
      console.log(dif)
      if (dif < 1.5) {
        this.bluetoothSerialDevices = this.nativeProvider.bluetoothMap.get("list");
      }
    }
    this.getList();
  }

  ionViewWillLeave() {
    if (this.observer) {
      this.observer.unsubscribe();
    }
    this.nativeProvider.bluetoothMap.set("currTime", new Date().getTime());
    this.nativeProvider.bluetoothMap.set("list", this.bluetoothSerialDevices);
  }

  //获取蓝牙设备列表
  getList() {
    if (this.platform.versions().ios) {
      if (!this.bluetoothSerial) {
        return;
      }
    } else {
      if (!this.ble) {
        return;
      }
    }
    this.bluetoothSerialDevices.length=0;
    if (this.platform.versions().ios) {
      this.ble.isEnabled().then(data => {
        this.searchBtn = true;
        if (this.observer == null) {
          this.ble.startScan([]).subscribe(device => {
            console.log('ios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            console.log(device);
            console.log('ios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            if (!this.contain(device['id'])) { 
              this.bluetoothSerialDevices.push(device); }
            this.content.resize()
          });
          // console.log('ios++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
          // console.log(this.bluetoothSerialDevices);
          setTimeout(() => {
            this.ble.stopScan();
            this.searchBtn = false;
          }, 5000);
        }
      })
    } else {
      this.bluetoothSerial.isEnabled().then(data => {
        this.searchBtn = true;

        // this.bluetoothSerial.list().then(devices => {
        //   this.bluetoothSerialDevices = devices
        // });
        if (this.observer == null) {
          this.observer = this.bluetoothSerial.setDeviceDiscoveredListener().subscribe(device => {
            if (!this.contain(device['id'])) {
              this.bluetoothSerialDevices.push(device);
              this.content.resize()
            }

          })
          console.log('md++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
          console.log(this.bluetoothSerialDevices);
        }

        this.bluetoothSerial.discoverUnpaired().then(devices => {
          this.searchBtn = false
        }).catch((err) => {
          this.searchBtn = false;
          console.log('discover devices failture：' + err);
        });
      }, error => {
        this.searchBtn = false;

        this.bluetoothSerial.enable().then(data => {
          this.getList()
        })
      })
    }

  }

  contain(id) {
    for (let i = 0, length = this.bluetoothSerialDevices.length; i < length; i++) {
      if (this.bluetoothSerialDevices[i].id == id) {
        return true;
      }
    }
    return false;
  }

  doScan() {
    this.searchBtn = true;

    this.bluetoothSerial.discoverUnpaired().then(devices => {
      this.searchBtn = false

    }).catch((err) => {
      this.searchBtn = false;
      console.log('discover devices failture：' + err);
    });
  }

  //选择蓝牙设备
  selecteBluetoothDevice(item) {
    this.device.name = item.name;
    this.device.id = null;
    if (item.address) {
      this.device.address = item.address;
    } else {
      this.device.address = item.id;
    }


  }

  deleteDevice() {
    if (this.device.printerType == String(PrinterType.receiptPrinter) && (this.orderProvider.isReceiptPrint_waimai || this.orderProvider.isReceiptPrint_table)) {
      this.http.showToast("当前打印机配置使用中，不能删除!");
      return;
    }

    if (this.device.printerType == String(PrinterType.kitchenPrinter) && (this.orderProvider.iskitchenPrint_waimai || this.orderProvider.iskitchenPrint_table)) {
      this.http.showToast("当前打印机配置使用中，不能删除!");
      return;
    }

    this.util.showConfirm("提示", "确认删除打印机").then(res => {
      if (res.res == "yes") {
        this.printerDeviceDao.removeByStoreIdAndPrintType(this.device.printerType);
        this.device = PrinterDevice.toJson();
        //更新全局打印机设置
        this.setDevice();
        if (this.printerType == String(PrinterType.receiptPrinter)) {
          this.orderProvider.receiptPrintStatus = false;
        } else {
          this.orderProvider.kitchenPrintStatus = false;
        }
        this.navCtrl.popToRoot();
      }
    })
  }

  //保存或更新
  addDevice() {
    this.device.sellerId = this.appCache.store.id||this.util.getUUID();
    this.device.printerType = this.printerType;
    this.device.linkTypeDesc = '蓝牙打印机';
    this.device.linkType = String(linkType.bluetooth);


    if (this.printerType == String(PrinterType.kitchenPrinter)) {
      this.device.printerTypeDesc = this.device.name;
      this.navCtrl.push(PRINTER_KT_ADD_PAGE, {
        device: this.device,
        viewCtrl: this.viewCtrl
      })
      return;
    } else {
      if (this.printerType == String(PrinterType.receiptPrinter)) {
        this.device.printerTypeDesc = '小票打印机';
        if (this.print.tagPrinter && this.print.tagPrinter.linkType == String(linkType.bluetooth)) {
          //this.nativeProvider.showShortCenter('小票或者标签打印只能有一个选择蓝牙打印机!');
          this.http.showToast('小票或者标签打印只能有一个选择蓝牙打印机!')
          return;
        }
      } else {
        if (this.print.receiptPrinter && this.print.receiptPrinter.linkType == String(linkType.bluetooth)) {
          //this.nativeProvider.showShortCenter('小票或者标签打印只能有一个选择蓝牙打印机!');
          this.http.showToast('小票或者标签打印只能有一个选择蓝牙打印机!')
          return;
        }
        this.device.printerTypeDesc = '标签打印机';
      }
      console.log('蓝牙驱动——————————--------------------------------------————————————————————————————');
      console.log(this.device);
      console.log('蓝牙驱动——————————--------------------------------------————————————————————————————');
    }

    if (this.device.id == null) {
      this.printerDeviceDao.queryByPrinterType(this.printerType, this.appCache.store.id).then(data => {
        console.log('数据库打印驱动————————————————————————————————————————————————————————————————————————————————————————————————————————————————');
        console.log(JSON.stringify(data));
        if (data.length > 0) {
          this.device.id = data[0].id
        }
        this.device.id = Md5.hashStr(new Date().getTime().toString()).toString();
        this.printerDeviceDao.clearPrintByPrinterType(this.printerType).then(id => {
          this.printerDeviceDao.set(this.device).then(id => {
            this.device.id = id;
            //更新全局打印机设置
            this.setDevice()
          })
        });
      })
    } else {
      this.printerDeviceDao.clearPrintByPrinterType(this.printerType).then(id => {
        this.printerDeviceDao.set(this.device).then(id => {
          //更新全局打印机设置
          this.setDevice()
        })
      })
    }

    if (this._viewCtrl != null) {
      this.navCtrl.removeView(this._viewCtrl)
    }
  }

  changePrinter() {
    this.navCtrl.push(PRINTER_DEVICE_SELECT_PAGE, { printerType: this.printerType, preView: this.viewCtrl })
  }

  //更新全局打印机设置
  setDevice() {
    /*if(this.print.bluetoothSerial.isConnected()){
      this.print.bluetoothSerial.disconnect();
    }*/
    switch (this.printerType) {
      case String(PrinterType.receiptPrinter): {
        this.print.receiptPrinter = this.device;
        this.orderProvider.receiptPrintStatus = true;
        break;
      }
      case String(PrinterType.kitchenPrinter): {
        this.print.kichentPrinter = this.device;
        this.orderProvider.kitchenPrintStatus = true;
        break;
      }
      case String(PrinterType.tagPrinter): {
        this.print.tagPrinter = this.device;
        this.orderProvider.tagPrintStatus = true;
        break;
      }
      default:
    }

    this.print.closeBLSPrinter().then(res => {
      this.navCtrl.pop();
    }, err => {
      this.navCtrl.pop();
    })
  }

  testPrint() {
    console.log(this.device);

    if (this.printerType == String(PrinterType.receiptPrinter)) {
      if (this.print.tagPrinter && this.print.tagPrinter.linkType == String(linkType.bluetooth)) {
        this.http.showToast('小票或者标签打印只能有一个选择蓝牙打印机!')
        return;
      }
    } else {
      if (this.print.receiptPrinter && this.print.receiptPrinter.linkType == String(linkType.bluetooth)) {
        this.http.showToast('小票或者标签打印只能有一个选择蓝牙打印机!')
        return;
      }
    }
    this.device.linkTypeDesc = '蓝牙打印机';
    this.device.linkType = String(linkType.bluetooth);
    this.device.printerType = this.printerType;
    this.device.printerModel = "0";
    let device = Object.assign({}, this.device);
    if (!device || !device.address) {
      this.nativeProvider.showShortCenter('请选择打印机!');
      return;
    }
    // 3秒倒计时
    this.retry = true;
    this.interval = setInterval(() => {
      this.timeCount = this.timeCount - 1;

      if (this.timeCount <= 0) {
        clearInterval(this.interval);
        this.retry = false;
        this.timeCount = 3;
      }
    }, 1000);

    // console.log(device);
    this.print.closeBLSPrinter().then(res => {
      setTimeout(res => {
        if (this.printerType == String(PrinterType.receiptPrinter)) {
          this.print.testReceiptPrint(device);
        } else if (this.printerType == String(PrinterType.tagPrinter)) {
          this.print.testTagPrint(device);
        } else {
          this.print.testKitchPrint(device);
        }
      }, 1000)
    }, err => {
      this.nativeProvider.showShortCenter('打印机连接失败，请检查!');
    })
    /*if(this.printerType==String(PrinterType.imgPrinter)) {
      this.imgPrintProvider.test(device);
      return;
    }*/

  }
}
