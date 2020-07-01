import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { EventsProvider } from '../../providers/Events';
import { WoShopService } from "../../service/wo.shop.service";
import { HelperService } from "../../providers/Helper";
import { AppShopping } from "../../app/app.shopping";

/**
 * Generated class for the WoCartModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'wo-cart-modal',
  templateUrl: 'wo-cart-modal.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WoCartModalComponent),
      multi: true
    }
  ]
})
export class WoCartModalComponent {

  @Input() show: boolean = false;
  // height: string = `${document.body.clientHeight}px`;
  // width: string = `${document.body.clientWidth}px`;
  propagateChange: any = {};
  microMembership: any;

  @Output() ionCancle = new EventEmitter<any>();
  @Output() noticeDetail = new EventEmitter<any>();

  @Input() showCardOp: boolean = false;
  @Input() showFooter: boolean = true;
  constructor(public ShopSer: WoShopService,
    public helper: HelperService,
    public eventSer: EventsProvider,
    public appShopping:AppShopping,
  ) {

    // this.eventSer.subscribe(GlobalData.event_membership,(member) =>{
    //   this.microMembership = member || null;
    // })
  }

  @Output() placeOrder = new EventEmitter<any>();

  writeValue(val: boolean): void {
    this.show = val;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  ngOnInit() {
  }

  close() {
    this.ionCancle.emit()
  }

  _placeOrder() {
    this.placeOrder.emit();
  }


  addCart(event, cart) {
    // let itemIndex = this.ShopSer.getItemIndex(cart.itemId);
    // let param = {};
    // param = {
    //   itemId: cart.itemId,
    //   itemQty: event.num,
    // }
    // this.ShopSer.addCart(param,itemIndex,()=>{
    //   this.noticeDetail.emit()
    // });
  }
  subCart(event, cart) {
    // let itemIndex = this.ShopSer.getItemIndex(cart.itemId);
    // let param = {};

    // param = {
    //   itemId: cart.itemId,
    //   itemQty: event.num,
    // }
    // this.ShopSer.subCart(param,itemIndex,()=>{
    //   if(this.ShopSer.cartsInfo.totalNum == 0) {
    //     this.close();
    //   }
    //   this.noticeDetail.emit()
    // });

  }


  clearCart() {
    this.helper.alert('确认清空购物车？', '', () => {
      // this.ShopSer.cartListClear().subscribe(()=>{
      //   this.helper.toast('购物车已清空');
      //   this.close();
      // },()=>{
      //   this.helper.toast('购物车清空失败，请重试');
      // });
    }, () => { })
  }

}
