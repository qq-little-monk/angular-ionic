import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,ToastController  } from 'ionic-angular';
import { AppShopping } from "../../../../app/app.shopping";
import { WebSocketService } from "../../../../service/webSocketService";
import { WoShopService } from "../../../../service/wo.shop.service";
import { HttpProvider } from "../../../../providers/http";
import { nodeValue } from '@angular/core/src/view';
import { AppPermission } from '../../../../app/app.permission';
@IonicPage()
@Component({
    selector: 'page-customer',
    templateUrl: 'customer.html'
})

export class CustomerPage {
    searchVaule: string;
    customerObj: any = {
        custCode: '',
        custName: '',
        balance: '',
        beforeTTLPoint: '',
        discountTypeName: '',
        gradeName: '',
    };//会员信息
    payMentArray: Array<any> = [];
    isPay: Boolean = false;//显示支付方式列表
    newPayMent:any;//支付方式
    payId: any;
    payWay: any;
    payName: any;
    payNum: any;
    orderNo: any;
    payCode: any;
    updateOrderNo: any;

    myNewData:any;

    constructor(
        public woShopService: WoShopService,
        public webSocketService: WebSocketService,
        public http: HttpProvider,
        public appShopping: AppShopping,
        public navCtrl: NavController,
        public navParams: NavParams,
        public appPer: AppPermission,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController
    ) {

    }
    ngOnInit() {
        //过滤一些充值方式
        let payArray = this.appShopping.payMentList;
        let noDisplay = ['AD', 'SZ', 'RE', 'YHJ', 'FS', 'PC', 'XFJ', 'JF'];
        payArray = payArray.filter((item) => {
            return noDisplay.indexOf(item.payCode) < 0;
        })
        console.log(payArray);
        this.payMentArray = payArray;
    }

    ionViewWillEnter() {
        this.customerObj = this.navParams.get('myNewKey')|| {
            custCode: '',
            custName: '',
            balance: '',
            beforeTTLPoint: '',
            discountTypeName: '',
            gradeName: '',
        };
        this.isHavePayMent();
    }
    goToSearch() {
        this.navCtrl.push('CustomerSearchPage',{isReCharge: true});
    }

    //充值
    customeRecharger(e) {
        this.isHavePayMent();
        e.stopPropagation();
        if(this.appPer.staffPermission('2304')){
            if(this.customerObj.status == 'Y'){
                if (this.customerObj.id) {
                    this.isPay = true;
                    // console.log(this.appShopping);
                } else {
                    this.http.showToast('请先选择会员!');
                }
            }else{
                this.http.showToast('该会员已被禁用');
            }
        }else{
            this.http.showToast('无【会员充值】权限');
        }
        
    }

    //会员信息
    customerInfo(e) {
        e.stopPropagation();
        if (this.customerObj.id) {
            console.log('修改会员信息');
        } else {
            this.http.showToast('请先选择会员!');
        }
    }

    //会员密码
    customerPassword(e) {
        e.stopPropagation();
        if (this.customerObj.id) {
            console.log('修改会员密码');
        } else {
            this.http.showToast('请先选择会员!');
        }
    }

    //新增会员
    goTonewAddCustomer() {
        if(this.appPer.staffPermission('2306')){
            this.navCtrl.push('NewAddCustomerPage');
        }else{
            this.http.showToast('无【新增会员】权限');
        }
    }

    //去支付
    goToPay(payMent) {
        this.newPayMent = payMent;
        this.isHavePayMent();
        payMent.disabled = true;
        console.log(payMent);
        let prompt = this.alertCtrl.create({
            title: '充值金额',
            message: "请输入充值的金额",
            inputs: [
                {
                    name: 'money',
                    placeholder: '请输入0.01~999999之间的额度'
                }
            ],
            enableBackdropDismiss: false,//点击背景幕是否可以隐藏弹框，默认为true
            buttons: [
                {
                    text: '取消',
                    handler: data => {
                        payMent.disabled = false;
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: '充值',
                    handler: data => {
                        let falg = /^\d{1,9}$|^\d{1,9}[.]\d{1,2}$/;
                        if(falg.test(data.money)){
                            if(payMent.payCode == "RB"){
                                this.payId = payMent.id;
                                this.payName = payMent.payName;
                                this.payNum = data.money;
                                this.payCode = payMent.payCode; 
                                this.customerRechargeOperation({},false);
                            }else{
                                this.payId = payMent.id;
                                this.payWay = payMent.payCode;
                                this.payCode = payMent.payCode; 
                                this.payName = payMent.payName;
                                this.payNum = data.money;
                                this.updateOrderNo = payMent.tmpIsUpdateOrderNO
                                console.log(data);
                                this.navCtrl.push('CommodityQrScanPage', { QRcallback: this.QRcallback });
                            }
                        }else{
                            this.http.showToast('请输入正确的充值金额！');
                            payMent.disabled = false;
                        }
                        
                    }
                }
            ]
        });
        prompt.present();
    }

    QRcallback: (param: any) => Promise<any> = (params) => new Promise(resolve => {
        if (this.isNumber(params.code)) {
            this.callPayMent(params.code);
        } else {
            this.http.showToast('该二维码不是支付二维码，请重新扫描');
        }
    });

    //支付
    callPayMent(param) {
        let codePage = "QrCodePayPage";
        this.navCtrl.push(codePage, {
            qrcode: param,
            payWay: this.payWay,
            payName: this.payName,
            payNum: this.payNum,
            isVip: true,
            // orderNo: this.orderNo,
            updateOrderNo: this.updateOrderNo,
            call: (data) => {
                console.log(data);
                //拿到备注，第三方流水，payOrderNo
                if (data.isPay) {
                    console.log('已支付成功，请往后操作');
                    this.customerRechargeOperation(data,true);
                } else {
                    this.isPay = false;
                    this.http.showToast('会员充值已取消，若要充值请点击会员充值');
                }
            }
        }).then(() => {
            const startIndex = this.navCtrl.getActive().index - 1;
            this.navCtrl.remove(startIndex, 0);
        });
    }

    //会员充值操作
    customerRechargeOperation(d,isOnline){
        let data;
        if (isOnline) {
            data = {
                payId: this.payId,//支付方式id
                payName: this.payName,//支付方式
                customerInfo: this.customerObj,
                rechargeVal: this.payNum,
                freeVal: 0,
                remark: d.remark,
                payTransId: d.payTransId,
                tradeId: d.payOrderNo,
                payCode: this.payCode
            }
        } else {
            data = {
                payId: this.payId,
                payName: this.payName,
                customerInfo: this.customerObj,
                rechargeVal: this.payNum,
                freeVal: 0,
                payCode: this.payCode
            }
        }
        this.webSocketService.customerRecharge(data).subscribe((res) => {
            console.log(res);
            // let returnData = {
            //     id: res.data.data.posCustrechargeledger.id,
            //     custId: res.data.data.customer.id
            // }
            // console.log(returnData);
            if(res.success){
                this.customerObj = res.data.data.customer;
                this.http.showToast(res.data.msg=="操作成功"?"会员充值成功":res.data.msg);
                this.newPayMent.disable = false;
                this.isPay = false;
                // this.newPayMent.disable = false;
            }else{
                const prompt = this.alertCtrl.create({
                    title: '会员充值消费异常调单',
                    buttons: [
                      {
                        text: '强制完成',
                        handler: data => {
                          console.log('强制完成');
                        }
                      },
                      {
                        text: '调单',
                        handler: data => {
                          console.log('调单');
                        }
                      },
                      {
                        text: '取消',
                        handler: data => {
                          console.log('取消');
                        }
                      }
                    ]
                  });
                prompt.present();
            }

        })
    }

    //支付方式高亮
    isHavePayMent() {
        this.payMentArray.forEach(payMent => {
            payMent.disabled = false;
            
        })
    }

    /*--------------FUNCTION -------------- */
    //判断是否为数字
    isNumber(str) {
        let num: any = Number(str);
        let flag = /^[0-9]*$/;
        if (flag.test(num)) {
            return true;
        } else {
            return false;
        }
    }
}
