// import {Component, Inject, ViewChild} from '@angular/core';
// import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
// import {IPrinterDevice, PrinterDevice} from "../../../../domain/printerDevice";
// import {linkType, PrinterType} from "../../../../domain/enum";
// import {HttpProvider} from "../../../../providers/csy/csyhttp";
// import {APP_CONFIG, AppConfig} from "../../../../app/app.config";
// import {UtilProvider} from "../../../../providers/util/util";
// import {PrinterDeviceDao} from "../../../../dao/PrinterDeviceDao";
// import {PrintProvider} from "../../../../providers/csy/csyprint";
// import {OrderProvider} from "../../../../providers/order/order";
// import {NativeProvider} from "../../../../providers/native";
// import {CommodityTypeDao} from "../../../../dao/commodityTypeDao";
// import {COMMODITY_TYPE_ADD_PAGE} from "../../../pages.constants";
// import { AppCache } from '../../../../app/app.cache';

// /**
//  * Generated class for the PrinterKtAddPage page.
//  *
//  * See https://ionicframework.com/docs/components/#navigation for more info on
//  * Ionic pages and navigation.
//  */

// @IonicPage()
// @Component({
//   selector: 'page-printer-kt-add',
//   templateUrl: 'printer-kt-add.html',
// })
// export class PrinterKtAddPage {
//   device: IPrinterDevice = PrinterDevice.toJson();
//   typeList: any[];

//   address1: string;
//   address2: string;
//   address3: string;
//   address4: string;

//   @ViewChild('inputaddress1') inputaddress1;
//   @ViewChild('inputaddress2') inputaddress2;
//   @ViewChild('inputaddress3') inputaddress3;
//   @ViewChild('inputaddress4') inputaddress4;

//   retry: boolean = false;
//   interval: any;
//   timeCount: number = 3;  //3秒倒计时
//   _viewCtrl: any;
//   isBluetooth:boolean=false;
//   constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(APP_CONFIG) private config: AppConfig,
//               public printerDeviceDao: PrinterDeviceDao, public print: PrintProvider, public nativeProvider: NativeProvider,
//               private util: UtilProvider, public orderProvider: OrderProvider, public printProvider: PrintProvider,
//               public alertCtrl: AlertController, public http: HttpProvider, public commodityTypeDao: CommodityTypeDao,
//               public modalCtrl: ModalController, public appCache:AppCache) {
//   }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad PrinterKtAddPage');
//   }

//   ionViewWillEnter() {
//     this.device = this.navParams.get('device');
//     this._viewCtrl = this.navParams.get('viewCtrl');
//     if (!this.device.printerModel) {
//       this.device.printerModel = this.config.PRINTER_MODEL_SPLIT
//     }
//     if(this.device.linkType==String(linkType.bluetooth)){//蓝牙
//       this.isBluetooth=true;
//     }
//     if (this.device.id) {
//       this.commodityTypeDao.queryTypesByKtId(this.device.id, this.appCache.seller.id).then(data => {
//         this.typeList = data
//       });

//       let addresss = this.device.address.split(".");
//       if (addresss.length == 4) {
//         this.address1 = addresss[0];
//         this.address2 = addresss[1];
//         this.address3 = addresss[2];
//         this.address4 = addresss[3];
//       }
//     }
//   }

//   checkValue(value, index, event) {
//     if (value) {
//       value += "";
//       let len = value.length;
//       let isSkip = false;

//       if (len == 1) {
//         if (value == ".") {
//           value = ""
//         } else {
//           if (!this.util.checkNumber(value)) {
//             this.nativeProvider.showShortCenter('请输入数字');
//             return;
//           }
//         }
//       } else {
//         if (value.substring(len - 1, len) == ".") {
//           value = value.substring(0, len - 1);
//           isSkip = true;
//         }

//         if (!this.util.checkNumber(value)) {
//           this.nativeProvider.showShortCenter('请输入数字');
//           return;
//         }
//       }

//       if (value.length > 3) {
//         value = value.substring(0, len - 1);
//         isSkip = true;
//       } else if (value.length == 3) {
//         isSkip = true;
//       }

//       if (index == 1) {
//         this.address1 = value;

//         if (isSkip) {
//           this.inputaddress2.setFocus();
//         }
//       } else if (index == 2) {
//         this.address2 = value;

//         if (isSkip) {
//           this.inputaddress3.setFocus();
//         }
//       } else if (index == 3) {
//         this.address3 = value;

//         if (isSkip) {
//           this.inputaddress4.setFocus();
//         }
//       } else if (index == 4) {
//         this.address4 = value;
//       }
//     }
//   }

//   //保存或更新
//   addOrReplaceKtPrinter() {
//     if (HttpProvider.isEmptyString(this.device.name)) {
//       this.nativeProvider.showShortCenter("请输入厨打名称");

//       return;
//     }

//     if (this.device.name.length > 12) {
//       this.nativeProvider.showShortCenter("厨打名称不能超过12个字符");

//       return;
//     }

//     if(this.device.linkType==String(linkType.bluetooth)){//蓝牙
//       this.device.linkTypeDesc = '蓝牙打印机';
//     }else{
//       let address = `${this.address1}.${this.address2}.${this.address3}.${this.address4}`;
//       if (!HttpProvider.checkIP(address)) {
//         this.nativeProvider.showShortCenter("请输入合法的IP地址");

//         return;
//       }
//       this.device.linkType = String(linkType.wifi);
//       this.device.linkTypeDesc = 'wifi打印机';
//       this.device.address = address;
//       this.device.printerTypeDesc = '厨房打印机';
//     }
//     this.device.sellerId = this.appCache.seller.id;
//     this.device.printerType = String(PrinterType.kitchenPrinter);
//     this.device.printerModelDesc = this.device.printerModel == '1' ? '合并打印' : '分单打印';

//     this.printerDeviceDao.queryByNameOrAddress(this.device).then(data => {
//       if (data.length > 0) {
//         this.nativeProvider.showShortCenter("厨打名称或地址已存在");

//         return;
//       } else {
//         if (this.device.id != null) {
//           this.http.updateKtPrinter(this.device).subscribe(res => {
//             this.printerDeviceDao.set(this.printerDeviceDao.initEntity(PrinterDevice.toJson(), res['wxKprinterDeviceEntity']))
//               .then(() => {
//                 this.printProvider.initKichentPrinter();
//                 if (this._viewCtrl != null) {
//                   this.navCtrl.removeView(this._viewCtrl)
//                 }
//                 this.navCtrl.pop()
//               })
//           })
//         } else {
//           this.http.addKtPrinter(this.device).subscribe(res => {
//             this.printerDeviceDao.set(this.printerDeviceDao.initEntity(PrinterDevice.toJson(), res['wxKprinterDeviceEntity']))
//               .then(() => {
//                 this.printProvider.initKichentPrinter();
//                 if (this._viewCtrl != null) {
//                   this.navCtrl.removeView(this._viewCtrl)
//                 }
//                 this.navCtrl.pop()
//               })
//           })
//         }
//       }
//     })

//     // this.orderProvider.checkStatus();
//   }

//   deleteDevice() {
//     if (this.device.printerType == String(PrinterType.kitchenPrinter)&&(this.orderProvider.iskitchenPrint_waimai||this.orderProvider.iskitchenPrint_table)) {
//       if(this.printProvider.kitchenPrinterMap.size==1){
//         this.util.showAlert("提示","当前打印机配置使用中，不能删除!");
//         return;
//       }
//     }
//     this.commodityTypeDao.queryTypesByKtId(this.device.id, this.appCache.seller.id).then(data => {
//       if (data.length > 0) {
//         this.nativeProvider.showShortCenter(`该打印机已被分类使用， 不能删除`)
//       } else {
//         let alert = this.alertCtrl.create({
//           title: '提示',
//           message: '确定删除打印机?',
//           buttons: [
//             {
//               text: '取消',
//               role: 'cancel',
//               handler: () => {
//                 console.log('Cancel clicked');
//               }
//             },
//             {
//               text: '确定',
//               handler: () => {
//                 this.http.deleteKtPrinter(this.device).subscribe(res => {
//                   this.printerDeviceDao.remove(this.device.id).then(() => {
//                     this.printProvider.initKichentPrinter();
//                     this.navCtrl.pop()
//                   })
//                 })
//               }
//             }
//           ]
//         });

//         alert.present();
//       }
//     })
//   }

//   //更新全局打印机设置
//   setDevice() {

//   }

//   editType(item) {
//     let modal = this.modalCtrl.create(COMMODITY_TYPE_ADD_PAGE, {type: item, typeList: this.typeList});
//     modal.present();

//     modal.onDidDismiss(() => {
//       this.commodityTypeDao.queryTypesByKtId(this.device.id, this.appCache.seller.id).then(data => {
//         this.typeList = data
//       });
//     })
//   }

//   /**
//    * 测试厨房打印机
//    */
//   testPrint() {
//     let device = Object.assign({}, this.device);
//     if(this.device.linkType==String(linkType.wifi)){
//       device.address = `${this.address1}.${this.address2}.${this.address3}.${this.address4}`;
//       if (!HttpProvider.checkIP(device.address)) {
//         this.nativeProvider.showShortCenter("请输入合法的IP地址");

//         return;
//       }
//     }
//     // 3秒倒计时
//     this.retry = true;
//     this.interval = setInterval(() => {
//       this.timeCount = this.timeCount - 1;

//       if (this.timeCount <= 0) {
//         clearInterval(this.interval);

//         this.retry = false;
//         this.timeCount = 3;
//       }
//     }, 1000);
//     console.log(device);
//     this.print.testKitchPrint(device)
//   }
// }
