import {Component, Inject} from '@angular/core';
import {NavController, ViewController, IonicPage} from 'ionic-angular';
import {HttpProvider} from "../../providers/http";
import {Md5} from "ts-md5/dist/md5";
import {ACCOUNT_AGREEMENT_PAGE, SUCCESS_PAGE} from "../pages.constants";
import {NativeProvider} from "../../providers/native";
import {APP_CONFIG, AppConfig} from "../../app/app.config";
import { AppCache } from '../../app/app.cache';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  readed: boolean = true;
  retry: boolean = false;
  timeCount: number = 59;  //重新获取短信验证码倒计时
  mobile: string;  //手机号
  remoteCode: string;  //服务器的短信验证码
  code: string;  //短信验证码
  remoteCodeId: string; // 短信验证码Id
  password: string;  //密码
  confirm: string; //确认密码
  storeName: string; //门店名称
  interval: any;
  scope: any = {};
  codeDisable: boolean = true;  // 号码未输完整，验证码按钮禁用
  scope_callback: (data: any) => Promise<any> = (params) => new Promise(resolve => {
    this.scope = params;

    resolve('Resolved!');
  });

  constructor(public navCtrl: NavController, public httpProvider: HttpProvider, public nativeProvider: NativeProvider,
              public viewCtrl: ViewController,@Inject(APP_CONFIG) private config: AppConfig, public appCache:AppCache) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SignUpPage');
  }

  ionViewDidLeave() {
    if (this.viewCtrl.isLast()) {
      if (this.interval != null) {
        clearInterval(this.interval)
      }
    }
  }

  //获取验证码
  getVerificationCode() {
    if (HttpProvider.isEmptyString(this.mobile)) {
      this.nativeProvider.showShortCenter('请输入手机号');

      return;
    }

    if(!HttpProvider.isMobile(this.mobile)) {
      this.nativeProvider.showShortCenter('手机号码不正确');

      return;
    }

    this.retry = true;
    this.interval = setInterval(() => {
      this.timeCount = this.timeCount - 1;

      if (this.timeCount <= 0) {
        clearInterval(this.interval);
        this.retry = false;
        this.timeCount = 59;
      }
    }, 1000);

    // this.httpProvider.getVerificationCode({mobile: this.mobile, flag: 'register'}).subscribe(res => {
    //   this.remoteCode = res['code'];
    //   this.remoteCodeId = res['id'];

    //   this.nativeProvider.showShortCenter(res['msg']);
    // })
  }

  signUp() {
    if (HttpProvider.isEmptyString(this.mobile)) {
      this.nativeProvider.showShortCenter('请输入手机号');

      return;
    }

    if(!HttpProvider.isMobile(this.mobile)) {
      this.nativeProvider.showShortCenter('手机号码不正确');

      return;
    }

    if (HttpProvider.isEmptyString(this.code)) {
      this.nativeProvider.showShortCenter('请输入短信验证码');

      return;
    }

    if (this.code != this.remoteCode) {
      this.nativeProvider.showShortCenter('短信验证码错误');

      return;
    }

    if (HttpProvider.isEmptyString(this.password)) {
      this.nativeProvider.showShortCenter('请输入密码');

      return;
    }

    if (!HttpProvider.checkPwd(this.password)) {
      this.nativeProvider.showShortCenter('密码输入错误, 请输入8-20位数字和字母组合');

      return;
    }

    if (HttpProvider.isEmptyString(this.confirm)) {
      this.nativeProvider.showShortCenter('请输入确认密码');

      return;
    }

    if (this.confirm != this.password) {
      this.nativeProvider.showShortCenter('两次输入的密码不一致');

      return;
    }

    if (HttpProvider.isEmptyString(this.storeName)) {
      this.nativeProvider.showShortCenter('请输入门店名称');

      return;
    }

    if (HttpProvider.isEmptyString(this.scope.tradeId)) {
      this.nativeProvider.showShortCenter('请选择主营行业');

      return;
    }

    // this.httpProvider.signUp({
    //   mobile: this.mobile,
    //   password: Md5.hashStr(this.password).toString(),
    //   code: this.code,
    //   id: this.remoteCodeId,
    //   ename: this.storeName,
    //   tradeId: this.scope.tradeId,
    //   circleId:this.appCache.seller.defaultCircleId,
    //   proxyId:this.appCache.seller.defaultProxyId
    // }).subscribe(res => {
    //   this.navCtrl.push(SUCCESS_PAGE, {sellerId: res['sellerId']}).then(() => {
    //     this.navCtrl.removeView(this.viewCtrl)
    //   })
    // })
  }

  //用户协议
  changeAgreement() {
    this.readed = !this.readed
  }

  bizScope() {
    //this.navCtrl.push(BIZ_SCOPE_PAGE, {scope: this.scope, scope_callback: this.scope_callback})
  }

  goToAgreemnetPage(){
    this.navCtrl.push(ACCOUNT_AGREEMENT_PAGE)
  }

  mobileInput(ev) {
    if (ev.target.value&&ev.target.value.length == 11) {
      this.codeDisable = false;
    } else {
      this.codeDisable = true;
    }
  }

}
