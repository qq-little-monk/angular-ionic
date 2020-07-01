import { Component, OnInit, Input, ViewChild, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { WoShopService } from '../../service/wo.shop.service';
import { AppShopping } from '../../app/app.shopping';
import { SalesDetail } from '../../domain/salesDetail';
import { min } from 'rxjs/operator/min';

/**
 * Generated class for the OrderBtnComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'combo-btn',
  templateUrl: 'combo-btn.html',
})
export class ComboBtnComponent {

  @Input() name: '';
  @Input() com: any = {};
  @Output() add = new EventEmitter<any>();
  @Output() sub = new EventEmitter<any>();
  @Output() setNumber = new EventEmitter<any>();

  constructor() {

  }
  ngOnInit() { }

  subData() {
    let minNum = this.com.tmpQty;
    console.log(this.com.tmpQty);
    // 当数量小于1份时不再减少
    if(minNum > 1){
      console.log(this.com.tmpQty);
      this.sub.emit();
    }
    
  }

  addData(event) {
    this.add.emit();
  }

  setNumberData() {
    if (this.setNumber) {
      this.setNumber.emit();
    }
  }

}