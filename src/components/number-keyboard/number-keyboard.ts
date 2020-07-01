
import { WoShopService } from '../../service/wo.shop.service';
import { AppShopping } from '../../app/app.shopping';
import { UtilProvider } from '../../providers/util/util';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http';


/**
 * Generated class for the OrderBtnComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'number-keyboard',
  templateUrl: 'number-keyboard.html',
})

export class NumberKeyboardComponent {
  str: string = '';
  keyboardNum: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  @Output() confirm = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @Input() number: { number: string, isClear: false } = { number: '', isClear: false };
  @Input() isClear = false;
  @Input() maxLength = 12;
  @Input() havePoint = true;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public http: HttpProvider,
    public navParams: NavParams) {
    this.number.number = String(this.number.number);
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad KeyboardPage');
  }

  close() {
    this.viewCtrl.dismiss(null);
  }

  addStr(n) {
    let indexOf = -1;
    this.number.number = String(this.number.number);
    if (this.number.isClear) { this.clear(); this.number.isClear = false; };
    // console.log(this.number.number.indexOf('0'));
    if (n == '0' && this.number.number.length == 1 && this.number.number.indexOf('0') == 0) {
      return;
    }
    if (this.number.number.length > 0) {
      indexOf = this.number.number.indexOf('.') ? this.number.number.indexOf('.') : 0;
    }
    if (n == '.' && indexOf > -1) {
      return;
    }
    // console.log(this.number.number.length - indexOf);
    if (indexOf > -1 && this.number.number.length - indexOf > 2) {
      return;
    }
    if (this.number.number.length >= this.maxLength) {
      return;
    }
    this.number.number += n.toString();
    this.refresh.emit();
    // if (this.number.number.length == 6) {
    //   this.viewCtrl.dismiss(this.number.number);
    // }
    
  }

  clear() {
    this.number.number = '';
    this.refresh.emit();
    // this.number.number = this.number.number.substring(0, this.number.number.length - 1);
  }
  del() {
    this.number.number = this.number.number.substring(0, this.number.number.length - 1);
    this.refresh.emit();
  }
  doConfirm() {
    let flge = /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/;
    let nums = this.number.number;
    if(flge.test(nums)){
      this.confirm.emit();
    }else{
      this.http.showToast("支付金额不能以.开头！");
      this.clear();
    }
    
  }
}
