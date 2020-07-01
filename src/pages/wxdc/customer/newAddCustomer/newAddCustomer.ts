
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, ViewController, NavParams,IonicPage,AlertController} from 'ionic-angular';
import { WoShopService } from '../../../../service/wo.shop.service';
import { HttpProvider } from '../../../../providers/http';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import { WebSocketService } from "../../../../service/webSocketService";
/**
 * Generated class for the OrderBtnComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@IonicPage()
@Component({
  selector: 'page-newAddCustomer',
  templateUrl: 'newAddCustomer.html',
})

export class NewAddCustomerPage {
  custCode:any;//会员卡号
  custName:any;//会员姓名
  custMobile:any;//会员手机号
  birthDay:any;//会员生日
  password:any;//会员密码
  customerRePassword:any;//重复确认密码
  email:any;//会员邮箱
  gradeId:any;//会员等级
  status:boolean;//会员是否启用
  sex:any;//会员性别
  chargeAccount:boolean;//会员是否能赊账
  maxChargeAccount:any;//会员赊账额度
  addr:any;//会员地址
  remark:any;//会员备注

  flags:any;//验证方式
  goBack: boolean;//是否返回

  statusVal: boolean = true;
  chargeAccountVal: boolean = false;
  sexVal:any = "1";
  gradeList: Array<any> = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public http: HttpProvider,
    public woShopService: WoShopService,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    public webSocketService: WebSocketService) {
    this.flags = formBuilder.group({
      custCode: ['', Validators.compose([Validators.required,Validators.pattern("^[A-Za-z0-9]+$")])],
      custName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      custMobile: ['', Validators.compose([Validators.minLength(11),Validators.pattern("^(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$")])],
      birthDay: ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      customerRePassword: ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      gradeId: ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      status: ['true', Validators.compose([Validators.required, Validators.minLength(0)])],
      sex: ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      chargeAccount: ['', Validators.compose([Validators.required, Validators.minLength(0)])],
      maxChargeAccount: ['', Validators.compose([Validators.required,Validators.pattern("^\d{1,9}$|^\d{1,9}[.]\d{1,2}$")])],
      addr: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      remark: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
    });
    this.custCode = this.flags.controls['custCode'];
    this.custName = this.flags.controls['custName'];
    this.custMobile = this.flags.controls['custMobile'];
    this.birthDay = this.flags.controls['birthDay'];
    this.password = this.flags.controls['password'];
    this.customerRePassword = this.flags.controls['customerRePassword'];
    this.email = this.flags.controls['email'];
    this.gradeId = this.flags.controls['gradeId'];
    this.status = this.flags.controls['status'];
    this.sex = this.flags.controls['sex'];
    this.chargeAccount = this.flags.controls['chargeAccount'];
    this.maxChargeAccount = this.flags.controls['maxChargeAccount'];
    this.addr = this.flags.controls['addr'];
    this.remark = this.flags.controls['remark'];
  }
  
  ngOnInit(){
    this.goBack = true;
    //请求会员等级
    let data ={}
    this.webSocketService.getCustomerGrade(data).subscribe(res => {
      console.log(res);
      this.gradeList = res.data.data;
    })
    
  }
  ionViewCanLeave(){ 
    if(this.goBack){
      let alert = this.alertCtrl.create({
        title: '取消添加会员？',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
              console.log('取消');
            }
          },
          {
            text: '确定',
            handler: () => {
              this.navCtrl.pop();
              this.goBack = false;
            }
          }
        ]
      });
      alert.present();
      return false;
    }else{
      return true;
    }
  }
  cancel(){
    let alert = this.alertCtrl.create({
      title: '取消添加会员？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('取消');
          }
        },
        {
          text: '确定',
          handler: () => {
            this.goBack = false;
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
    // e.stopPropagation();
  }
  sure(data){
    console.log(this.sexVal)
    if(data.status == '' || data.status == false){
      data.status = 'N'
    }else{
      data.status = 'Y'
    }

    if(data.chargeAccount == '' || data.chargeAccount == false){
      data.chargeAccount = '0'
    }else{
      data.chargeAccount = '1'
    }
    
    if(!this.chargeAccountVal){
      data.maxChargeAccount = 0;
    }
    console.log(data);
    if(data.custCode == ''){
      this.http.showToast("请输入会员卡号！");
      return;
    }else if(data.custName == ''){
      this.http.showToast("请输入会员姓名！");
      return;
    }else if(data.gradeId == ''){
      this.http.showToast("请选择会员等级！");
      return;
    }else if(data.password !== data.customerRePassword){
      this.http.showToast("两次输入的密码不一致！");
      return;
    }else if(data.sex == ''){
      this.http.showToast("请选择会员性别！");
      return;
    }

    // this.webSocketService.addCustomerList(data).subscribe(res => {
    //   console.log(res);
    //   if(res.success){
    //     this.http.showToast("会员添加成功！");
    //     this.goBack = false;
    //     this.navCtrl.pop();
    //   }
    // })
  }
}