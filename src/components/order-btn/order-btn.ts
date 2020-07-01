import { Component, OnInit, Input, ViewChild, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { WoShopService } from '../../service/wo.shop.service';
import { AppShopping } from '../../app/app.shopping';
import { SalesDetail } from '../../domain/salesDetail';

/**
 * Generated class for the OrderBtnComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'order-btn',
  templateUrl: 'order-btn.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OrderBtnComponent),
    multi: true
  }]
})
export class OrderBtnComponent implements OnInit, ControlValueAccessor {

  numTmp: number = 0;
  @Output() add = new EventEmitter<any>();
  @Output() sub = new EventEmitter<any>();
  @ViewChild("subEle") subEle: any;
  @ViewChild("addEle") addEle: any;
  propagateChange: any = {};

  @Input() itemQty: number = 0;
  @Input() com: {} = {};

  constructor(public woShopService: WoShopService, public appShopping: AppShopping) { }

  /*实现ControlValueAccessor接口部分*/
  writeValue(val: number): void {
    this.itemQty = val;
    this.numTmp = val;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  ngOnInit() { }

  subData() {
    this.itemQty > 0 ? this.itemQty-- : '';
    this.sub.emit({ num: this.itemQty });
  }

  addData(event) {
    this.itemQty++;
    this.add.emit({ event: event, num: this.itemQty });
  }

  getCarCom() {
    let comSpu=this.com;
    this.appShopping.salesDetailList.forEach(element => {
      if (comSpu['id'] == element.spuId) {
        return element;
      }
    });
    // return new SalesDetail;
  }

}
