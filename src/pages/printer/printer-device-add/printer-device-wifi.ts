import { Component, Inject, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Md5 } from "ts-md5/dist/md5";
import { IPrinterDevice, PrinterDevice } from '../../../domain/printerDevice';
import { APP_CONFIG, AppConfig } from '../../../app/app.config';
import { AppCache } from '../../../app/app.cache';
import { PrinterDeviceDao } from '../../../dao/PrinterDeviceDao';
import { PrintProvider } from '../../../providers/print';
import { NativeProvider } from '../../../providers/native';
import { UtilProvider } from '../../../providers/util/util';

import { HttpProvider } from '../../../providers/http';
import { PrinterType, linkType } from '../../../domain/enum';
import { PRINTER_DEVICE_SELECT_PAGE } from '../../pages.constants';
import { OrderProvider } from '../../../providers/order/order';


/**
 * Generated class for the PrinterDeviceWifiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-printer-device-wifi',
    templateUrl: 'printer-device-wifi.html',
})
export class PrinterDeviceWifiPage {
    printerType: string;
    device: IPrinterDevice = PrinterDevice.toJson();
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    @ViewChild('inputaddress1') inputaddress1;
    @ViewChild('inputaddress2') inputaddress2;
    @ViewChild('inputaddress3') inputaddress3;
    @ViewChild('inputaddress4') inputaddress4;
    retry: boolean = false;
    interval: any;
    timeCount: number = 3;  //3秒倒计时

    _viewCtrl: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(APP_CONFIG) private config: AppConfig, public appCache: AppCache,
        public printerDeviceDao: PrinterDeviceDao, public print: PrintProvider, public nativeProvider: NativeProvider,
        public viewCtrl: ViewController, private util: UtilProvider, public orderProvider: OrderProvider, public printProvider: PrintProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PrinterDeviceWifiPage');
    }

    ionViewWillEnter() {
        this._viewCtrl = this.navParams.get('viewCtrl');

        this.printerType = this.navParams.get('printerType');
        this.device = this.navParams.get('device');
        if (this.device.size) {

        } else {
            this.device.size = 1;
        }
        if (!this.device.printerModel) {
            this.device.printerModel = this.config.PRINTER_MODEL_SPLIT
        }

        if (this.device.address) {
            let addresss = this.device.address.split(".");
            if (addresss.length == 4) {
                this.address1 = addresss[0];
                this.address2 = addresss[1];
                this.address3 = addresss[2];
                this.address4 = addresss[3];
            }
        }
    }

    checkValue(value, index, event) {
        //alert(event.which)
        if (value) {
            value += "";
            let len = value.length;
            let isSkip = false;
            if (len == 1) {
                if (value == ".") {
                    value = ""
                } else {
                    if (!this.util.checkNumber(value)) {
                        this.nativeProvider.showShortCenter('请输入数字');
                        return;
                    }
                }
            } else {
                if (value.substring(len - 1, len) == ".") {
                    value = value.substring(0, len - 1);
                    isSkip = true;
                }
                if (!this.util.checkNumber(value)) {
                    this.nativeProvider.showShortCenter('请输入数字');
                    return;
                }
            }
            if (value.length > 3) {
                value = value.substring(0, len - 1);
                isSkip = true;
            } else if (value.length == 3) {
                isSkip = true;
            }
            if (index == 1) {
                this.address1 = value;
                if (isSkip) {
                    this.inputaddress2.setFocus();
                }
            } else if (index == 2) {
                this.address2 = value;
                if (isSkip) {
                    this.inputaddress3.setFocus();
                }
            } else if (index == 3) {
                this.address3 = value;
                if (isSkip) {
                    this.inputaddress4.setFocus();
                }
            } else if (index == 4) {
                this.address4 = value;
            }
        }
    }

    //保存或更新
    addDevice() {
        let address = `${this.address1}.${this.address2}.${this.address3}.${this.address4}`;

        if (!HttpProvider.checkIP(address)) {
            this.nativeProvider.showShortCenter("请输入合法的IP地址");

            return;
        }

        this.device.address = address;
        this.device.sellerId = this.appCache.seller.id;
        this.device.printerType = this.printerType;

        if (this.printerType == String(PrinterType.receiptPrinter)) {
            this.device.printerTypeDesc = '小票打印机'
        } else if (this.printerType == String(PrinterType.kitchenPrinter)) {
            this.device.printerTypeDesc = '厨房打印机'
        } else if (this.printerType == String(PrinterType.tagPrinter)) {
            this.device.printerTypeDesc = '标签打印机'
        }

        this.device.linkType = String(linkType.wifi);
        this.device.linkTypeDesc = 'wifi打印机';

        if (this.device.id == null) {
            this.printerDeviceDao.queryByPrinterType(this.printerType, this.appCache.seller.id).then(data => {
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
                this.printerDeviceDao.set(this.device);
                //更新全局打印机设置
                this.setDevice()
            })
        }

        if (this._viewCtrl != null) {
            this.navCtrl.removeView(this._viewCtrl)
        }
        // this.orderProvider.checkStatus();
        this.navCtrl.pop()

        // this.navCtrl.setPages([
        //   {page: ContactPage},
        //   {page: PRINTER_DEVICE_PAGE},
        // ], {animate: true, direction: 'back'})
    }

    deleteDevice() {
        if (this.device.printerType == String(PrinterType.receiptPrinter) && (this.orderProvider.isReceiptPrint_waimai || this.orderProvider.isReceiptPrint_table)) {
            this.util.showAlert("提示", "当前打印机配置使用中，不能删除!");
            return;
        }

        if (this.device.printerType == String(PrinterType.kitchenPrinter) && (this.orderProvider.iskitchenPrint_waimai || this.orderProvider.iskitchenPrint_table)) {
            this.util.showAlert("提示", "当前打印机配置使用中，不能删除!");
            return;
        }

        this.util.showConfirm("提示", "确认删除打印机").then(res => {
            if (res.res == "yes") {
                this.address1 = "";
                this.address2 = "";
                this.address3 = "";
                this.address4 = "";
                this.printerDeviceDao.remove(this.device.id);
                this.device = PrinterDevice.toJson();
                //更新全局打印机设置
                this.setDevice();
                if (this.printerType == String(PrinterType.receiptPrinter)) {
                    this.orderProvider.receiptPrintStatus = false;
                } else {
                    this.orderProvider.kitchenPrintStatus = false;
                }
                this.navCtrl.pop();
            }
        })
    }


    clearDevice() {
        this.address1 = "";
        this.address2 = "";
        this.address3 = "";
        this.address4 = "";
        this.device = PrinterDevice.toJson();
        this.device.printerModel = this.config.PRINTER_MODEL_SPLIT
    }


    //更新全局打印机设置
    setDevice() {
        switch (this.printerType) {
            case String(PrinterType.receiptPrinter): {
                this.print.receiptPrinter = this.device;
                break;
            }
            case String(PrinterType.kitchenPrinter): {
                this.print.kichentPrinter = this.device;
                break;
            }
            case String(PrinterType.tagPrinter): {
                this.print.tagPrinter = this.device;
                break;
            }
            default:
        }
    }

    changePrinter() {
        this.navCtrl.push(PRINTER_DEVICE_SELECT_PAGE, { printerType: this.printerType, preView: this.viewCtrl })
    }

    testPrint() {
        let device = Object.assign({}, this.device);
        device.linkType = String(linkType.wifi);
        device.address = `${this.address1}.${this.address2}.${this.address3}.${this.address4}`;

        if (!HttpProvider.checkIP(device.address)) {
            this.nativeProvider.showShortCenter("请输入合法的IP地址");

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

        if (this.printerType == String(PrinterType.receiptPrinter)) {
            this.print.testReceiptPrint(device)
        } else if (this.printerType == String(PrinterType.tagPrinter)) {
            this.print.testTagPrint(device);
        } else {
            this.print.testKitchPrint(device)
        }
    }
}
