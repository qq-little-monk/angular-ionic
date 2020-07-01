import { Component, OnInit,Input,ViewChild, Output, EventEmitter,forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { AlertController } from 'ionic-angular';
import { HelperService } from '../../providers/Helper';

/**
 * Generated class for the WoOrderBtnComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'wo-order-btn',
  templateUrl: 'wo-order-btn.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WoOrderBtnComponent),
    multi: true
  }]
})
export class WoOrderBtnComponent {

  numTmp:number = 0;
  @Output() add = new EventEmitter<any>();
  @Output() sub = new EventEmitter<any>();
  @ViewChild("subEle") subEle: any;
  @ViewChild("addEle") addEle: any;
  propagateChange: any = {};

  @Input() itemQty: number = 0;

  @Input() disabled: boolean = true;

  constructor(private alertCtrl: AlertController,
    public helper: HelperService) { }

   /*实现ControlValueAccessor接口部分*/
   writeValue(val: number): void {
    this.itemQty = val || 0;
    this.numTmp = val || 0;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  ngOnInit() {}

  subData(){
    this.itemQty > 0?this.itemQty --:'';
    this.sub.emit({num:this.itemQty});
  }

  addData(event){
    this.itemQty ++ ;
    this.add.emit({event:event,num:this.itemQty});
  }

  changeNum(event){
    // let alert = this.alertCtrl.create({
    //   title: '修改购买数量',
    //   inputs: [
    //     {
    //       name: 'itemQty',
    //       value: this.itemQty.toString(),
    //       placeholder: '请填写数量',
    //       type: 'number'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: '取消',
    //       role: 'cancel',
    //       handler: data => {
            
    //       }
    //     },
    //     {
    //       text: '加入购物车',
    //       handler: data => {
    //         console.log(Number(data.itemQty));
    //         if(Number(data.itemQty) == this.itemQty) {
    //           this.helper.toast('商品数量未修改');
    //           return false;
    //         } else if (Number(data.itemQty) <= 0) {
    //           this.helper.toast('商品数量不能小于0');
    //           return false;
    //         } else {
    //           this.add.emit({event:event,num:data.itemQty});
    //         }
    //       }
    //     }
    //   ]
    // });
    // alert.present();
  }

}
