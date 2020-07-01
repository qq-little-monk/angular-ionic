import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { WebSocketService } from '../../../../service/webSocketService';
import { HttpProvider } from '../../../../providers/http';
import { AppShopping } from '../../../../app/app.shopping';
import { AllPreferentialPage } from '../allPreferential/allPreferential';

@IonicPage()
@Component({
  selector: 'page-qrCodePay',
  templateUrl: 'qrCodePay.html'
})

export class QrCodePayPage {
  // @ViewChild(Navbar) navBar: Navbar;

  public qrCodeValue: any;//支付二维码
  public payWay: string;//支付方式
  public payNum_S: number;//实际应付金额
  public randomOrderNum: number;//随机订单号
  public payNumValue: number;//输入框的金额
  public btnSwitch: boolean = false;//默认隐藏强制和调单
  // public reSM: boolean = false;//重新扫码按钮
  public isPaySucess: object;
  public payName: any;//支付方式中文
  public enSure: boolean = true;//确定支付按钮
  public isAppear: boolean = false;//强制弹框
  public orderNo: any;//支付方式数据序列
  public payChannel: string;//支付渠道
  public isClicked: boolean = false;//是否点击过确定支付按钮
  public isCanleWay: any;//取消支付方式
  public updateOrderNo: any;//特殊支付前缀
  public isBack: boolean;//是否退出支付
  public payTransId: any;//第三方支付流水
  public isVip:boolean;//是否为会员充值

  constructor(

    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public webSocketService: WebSocketService,
    public http: HttpProvider,
    public appShopping: AppShopping,
    public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.isBack = false;
    console.log(this.navCtrl.getActive());
    // console.log(this.appShopping)
    this.isVip = this.navParams.get('isVip')|| false;
    console.log(this.isVip);
    if(this.isVip){
      this.qrCodeValue = this.navParams.get('qrcode');
      this.isCanleWay = this.navParams.get('call');
      this.payWay = this.navParams.get('payWay');
      this.payName = this.navParams.get('payName');
      this.payNumValue = this.navParams.get('payNum');
    }else{
      this.qrCodeValue = this.navParams.get('qrcode');
      this.isCanleWay = this.navParams.get('call');
      this.payWay = this.navParams.get('payWay');
      this.payName = this.navParams.get('payName');
      this.payNumValue = this.navParams.get('payNum');
      this.orderNo = this.navParams.get('orderNo');
      this.updateOrderNo = this.navParams.get('updateOrderNo');
    }
    
    if (this.updateOrderNo) {
      this.webSocketService.isSpecialOrder({ payCode: this.payWay }).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.randomOrderNum = res.returnData.payOrderNo
        }
      })
    } else {
      this.randomOrderNum = this.getRandomOrderNum();
    }
  }

  ionViewCanLeave() {
    if (this.isBack) {
      return true;
    } else {
      this.http.showToast("若想退出请点击取消按钮！");
      return false;
    }
  }

  /*---从custom-popup传来的数据---*/
  according(e) {
    // console.log(e);
    if(this.isVip){
      let reMarkText = e.textarea;
      let pagOrderNo = this.randomOrderNum;
      this.isCanleWay({
        'remark': reMarkText,
        'payOrderNo': pagOrderNo,
        'payTransId': '',
        'isPay': true
      });
    }else{
      let reMarkText = e.textarea;
      let pagOrderNo = this.randomOrderNum;
      let obj = this.appShopping.salesPayList[this.orderNo - 1];
      obj['remark'] = reMarkText;
      obj['payOrderNo'] = pagOrderNo;
      obj['payChannel'] = this.isPayChannel(this.qrCodeValue);
    }
    this.isAppear = false;
    this.isBack = true;
    this.navCtrl.pop();
  }

  cancels(e) {
    this.isAppear = e;
  }

  //取消支付
  cancelPay() {
    let alert = this.alertCtrl.create({
      title: '确定取消' + this.payName + '支付吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            this.isBack = false;
          }
        },
        {
          text: '确定',
          handler: () => {
            if (this.isClicked) {
              let data = {
                payOrderNo: this.randomOrderNum, //订单号
                payCode: this.payWay, //支付类型
                payCodeValue: this.qrCodeValue, //支付码
                payTransId: this.payTransId//第三方支付流水
              }
              this.webSocketService.doLookSingle({ payData: data }).subscribe(res => {
                let resObj = res.returnData;
                if (res.success) {
                  this.http.showToast(resObj.msg == 'Success' ? '支付成功' : resObj.msg);
                  if(this.isVip){
                    this.isCanleWay({
                      'remark': '支付成功',
                      'payOrderNo': this.randomOrderNum,
                      'payTransId': resObj.payTransId ? resObj.payTransId : this.payTransId,
                      'isPay': true
                    });
                  }else{  
                    let obj = this.appShopping.salesPayList[this.orderNo - 1];
                    obj['payTransId'] = resObj.payTransId ? resObj.payTransId : this.payTransId;
                    obj['payOrderNo'] = this.randomOrderNum;
                    obj['payChannel'] = this.isPayChannel(this.qrCodeValue);
                  }
                  this.isBack = true;
                  this.navCtrl.popTo('PayMentPage');
                } else {
                  let alert = this.alertCtrl.create({
                    title: '取消支付',
                    message: '若该支付已成功，请点击[强制完成]，点击[确定]会重新支付，请谨慎操作!',
                    buttons: [
                      {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                          this.isBack = false;
                        }
                      }, {
                        text: '确定',
                        handler: () => {
                          localStorage.setItem(this.payWay, '0');
                          localStorage.removeItem('orderNo');
                          if(this.isVip){
                            this.isCanleWay({
                              'isPay': false
                            });
                          }else{
                            this.isCanleWay(this.orderNo);
                          }
                          this.navCtrl.pop();
                          this.isBack = true;
                        }
                      }
                    ]
                  });
                  alert.present();
                }
              })
            } else {
              localStorage.setItem(this.payWay, '0');
              localStorage.removeItem('orderNo');
              if(this.isVip){
                this.isCanleWay({
                  'isPay': false
                });
              }else{
                this.isCanleWay(this.orderNo);
              }
              this.navCtrl.pop();
              this.isBack = true;
            }
          }
        }
      ]
    });
    alert.present();
  }

  //确定支付
  okPay() {
    var me = this;
    if (this.qrCodeValue && this.qrCodeValue.replace(/(^\s*)|(\s*$)/g, "")) {
      this.isClicked = true;
      let data = {
        payOrderNo: this.randomOrderNum, //订单号
        payAmt: this.payNumValue, //支付金额
        payCodeValue: this.qrCodeValue, //支付码
        payCode: this.payWay, //支付类型
      }
      this.webSocketService.doPayMoney({ payData: data }).subscribe(res => {
        let resObj = res.returnData;
        me.payTransId = resObj.payTransId;
        //支付成功
        var payFinish = function (resObj) {
          let pagOrderNo = me.randomOrderNum;
          if(me.isVip){
            me.isCanleWay({
              'remark': '支付成功',
              'payOrderNo': pagOrderNo,
              'payTransId': resObj.payTransId ? resObj.payTransId : me.payTransId,
              'isPay': true
            });
          }else{
            let obj = me.appShopping.salesPayList[me.orderNo - 1];
            obj['payTransId'] = resObj.payTransId ? resObj.payTransId : me.payTransId;
            obj['payOrderNo'] = pagOrderNo;
            obj['payChannel'] = me.isPayChannel(me.qrCodeValue);
          }
          me.http.showToast("支付成功!");
          me.isBack = true;
          me.navCtrl.pop();
          localStorage.setItem('isPay', 'y');//支付成功后
        }
        //支付失败
        var payFail = function (resObj) {
          if (resObj.code == "PAYFAIL" || resObj.isTimeOut) { //支付失败 、超时
            me.btnSwitch = true;
            me.enSure = false;
            if (resObj.isTimeOut) me.http.showToast("请求超时,请检查网络或重试")
          } else me.http.showToast(resObj.msg || '支付失败')
        }
        // console.log(res);
        if (res.success) {
          if (resObj.code == "PAYING") { //支付中
            //this.http.showToast(resObj.msg)
            me.webSocketService.doPaying({ queryData: data, resultData: resObj.resultData }).subscribe(res => {
              let resObj = res.returnData;
              if (resObj.payTransId) me.payTransId = resObj.payTransId;
              if (res.success) payFinish(resObj); //支付成功
              else payFail(resObj) //支付失败
            });
          } else {
            payFinish(resObj);//支付成功
          }
        } else {
          payFail(resObj) //支付失败
        }
      })
    } else {
      this.http.showToast('支付二维码不能为空！')
    }
  }

  //强制支付
  mandatoryPay() {
    // console.log("mandatoryPay");
    this.isAppear = true;
  }

  //调单
  lookSingle() {
    let data = {
      payOrderNo: this.randomOrderNum, //订单号
      payCode: this.payWay, //支付类型
      payCodeValue: this.qrCodeValue, //支付码
      payTransId: this.payTransId//第三方支付流水
    }
    let alert = this.alertCtrl.create({
      title: '查看当前支付是否完成',
      buttons: [
        {
          text: '取消调单',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: '调单',
          handler: () => {
            this.webSocketService.doLookSingle({ payData: data }).subscribe(res => {
              console.log(res);
              let resObj = res.returnData;
              if (res.success) {
                this.http.showToast(resObj.msg == 'Success' ? '支付成功' : resObj.msg);
                if(this.isVip){
                  this.isCanleWay({
                    'remark': '支付成功',
                    'payOrderNo': this.randomOrderNum,
                    'payTransId': resObj.payTransId ? resObj.payTransId : this.payTransId,
                    'isPay': true
                  });
                }else{
                  let obj = this.appShopping.salesPayList[this.orderNo - 1];
                  obj['payTransId'] = resObj.payTransId ? resObj.payTransId : this.payTransId;
                  obj['payOrderNo'] = this.randomOrderNum;
                  obj['payChannel'] = this.isPayChannel(this.qrCodeValue);
                }
                this.isBack = true;
                this.navCtrl.pop();
              } else {
                this.http.showToast(resObj.msg);
              }
            })
          }
        }
      ]
    });
    alert.present();
  }

  //生成随机订单号
  getRandomOrderNum() {
    let number: number;
    //拿到时间
    const time: any = this.getNowTime();
    //生成三位随机数
    const nums: any = this.mathRand(3);
    return number = time + nums;
  }

  //获取数字时间
  getNowTime() {
    var now = new Date();
    // 获取当前完整年份
    var getFullYear = now.getFullYear();
    // 获取当前月份
    var getMonth = now.getMonth() + 1;
    // 获取当前日
    var getDate = now.getDate();
    // 获取到当前小时：
    var getHours = now.getHours();
    // 获取到当前分钟：
    var getMinutes = now.getMinutes();
    // 获取到当前秒：
    var getSeconds = now.getSeconds();
    // 获取到当前毫秒：
    var getMilliseconds = now.getMilliseconds();
    let nowTimes: string = getFullYear + '' + getMonth + '' + getDate + '' + getHours + '' + getMinutes + '' + getSeconds + '' + getMilliseconds;
    return nowTimes;
  }

  //生成随机数
  mathRand(num: number) {
    let results = "";
    for (var i = 0; i < num; i++) {
      results += Math.floor(Math.random() * 10);
    }
    return results;
  }

  //判断支付渠道
  isPayChannel(code) {
    let wxReg = /^1[0-5]\d{16}$/;
    let zfbReg = /^28\d{16}$/;
    if (wxReg.test(code)) {
      return 'WECHAT';//微信
    } else if (zfbReg.test(code)) {
      return 'ALIPAY';//支付宝
    } else if (code.length >= 16 && code.indexOf('62') === 0) {
      return 'UNIONPAY';//银联
    } else if (code.length >= 16 && code.indexOf('51') === 0) {
      return 'BESTPAY';//冀支付
    } else if (code.length >= 16 && code.indexOf('83') === 0) {
      return 'SUNING'//苏宁
    }

  }
}