import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { HttpProvider } from '../../../providers/http';
import { NativeProvider } from '../../../providers/native';
import { COMMODITY_EDIT_PAGE } from '../../pages.constants';
import { QrScanUtilProvider } from '../../../providers/util/QrScanUtil';
import { Observable } from 'rxjs';



@IonicPage()
@Component({
  selector: 'page-commodity-qr-scan',
  templateUrl: 'commodity-qr-scan.html',
})
export class CommodityQrScanPage {
  light: boolean;//判断闪光灯
  frontCamera: boolean;//判断摄像头
  isShow: boolean = false;//控制显示背景，避免切换页面卡顿
  // @ViewChild(Navbar) navBar: Navbar;

  code: string = "";
  addFlag: boolean = false;
  selectList: any[] = [];
  call:any;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private qrScanner: QRScanner,
    public alertCtrl: AlertController,
    public http: HttpProvider,
    public native: NativeProvider,
    private viewCtrl: ViewController,
    public qrScanUtilProvider: QrScanUtilProvider) {
    //默认为false
    this.light = false;
    this.frontCamera = false;
  }
  
  ngOnInit(){ 
    localStorage.setItem('orderNo',this.navParams.get('orderNo'));
  }
  QRcallback: (param: any) => Promise<any>;

  ionViewWillEnter() {
    console.log(this.navParams);
    this.addFlag = this.navParams.data.addFlag;
    console.log(this.addFlag);
    if (this.navParams.get('selectList')) {
      this.selectList = this.navParams.get('selectList');
      console.log(this.selectList);
    }

  }

  ionViewDidLoad() {
    this.showCamera();
    // this.navBar.backButtonClick = ()=>{
    //   this.backButtonClick();
    // };
  }

  ionViewCanLeave(){
    if(!this.code){
      localStorage.setItem('isSm','n');
    }
    return true;
  }

  ionViewDidEnter() {
    //页面可见时才执行    
    // var idInput = document.getElementById("inp");
    // idInput.onkeyup = (event) => {
    //   if (event.keyCode == 13) {
    //     //执行相应的方法
    //     if (this.addFlag) {
    //       // this.isHaveCommoityByCode();
    //     } else {
    //       this.goBack();
    //     }
    //   }
    // }

    this.QRcallback = this.navParams.get('QRcallback');
    this.code = this.navParams.get('code');
    // this.call = this.navParams.get('call');
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        console.log(status);
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          let scanSub = this.qrScanUtilProvider.scan().subscribe((text: string) => {
            // alert(text);
            this.native.msgVibration(200);
            this.code = text;
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            if (this.addFlag) {
              // this.isHaveCommoityByCode();
            } else {
              this.goBack();
            }
          }, err => {
            console.log(err);
          });
          // show camera preview
          this.qrScanner.show();
          (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
          // this.http.showToast("页面透明方法被调用");
          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          let alert = this.alertCtrl.create({
            cssClass: 'self-alert',
            title: '未打开相机权限，请设置',
            buttons: [
              {
                text: '取消',
                cssClass: 'cancel',
                role: 'cancel',

              },
              {
                text: '确定',
                cssClass: 'confirm',
                handler: data => {
                  this.qrScanner.openSettings();
                }
              }]
          })
        } else {
        }
      })
      .catch((e: any) => {
        console.log('Error is', e);
      });
    setTimeout(() => {
      this.isShow = true;//显示背景
    }, 300);
  }

  /**
   * 闪光灯控制，默认关闭
   */
  toggleLight() {
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
  }

  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }

  /*打开摄像头*/ 
  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }
  /*关闭摄像头*/

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    this.qrScanner.hide();//需要关闭扫描，否则相机一直开着
    this.qrScanner.destroy();//关闭
  }

  ionViewWillLeave() {
    // this.hideCamera();
    //this.isShow = false;
  }

  ionViewDidLeave() {
    this.hideCamera();
    this.isShow = false;
  }

  goBack() {
    console.log(2222);
    localStorage.setItem('isSm','y');
    this.navCtrl.pop();
    // console.log(this.code);
    if (this.code) {
      this.QRcallback({
        selectList: this.selectList,
        code: this.code,
        isContinu: true,
        viewCtrl: this.viewCtrl,
      })
      // this.call(this.code?this.code:'123456789987456321');
      // this.navCtrl.pop()
      // this.addCommodityEditPage();
    }
    else { this.http.showToast('条形码不能为空') }
    return;
  }

  addCommodityEditPage() {
    this.navCtrl.push(COMMODITY_EDIT_PAGE, { code: this.code, viewCtrl: this.viewCtrl, })
  }

  focusInput() {
  }

 
  agen(F) {
    // if (this.openFlag == 1) {
    //   return
    // }
    setTimeout(() => {
      this.qrScanUtilProvider.scan().subscribe((text: string) => {
        this.native.msgVibration(200);
        this.code = text;
        if (this.addFlag) {
          // this.isHaveCommoityByCode();
        } else {
          this.goBack();
        }
      });
    }, F);
  }

  // backButtonClick(){
  //   this.navCtrl.pop();
  // }
}
