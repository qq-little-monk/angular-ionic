import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WoPlaceOrderPage } from './wo-place-order';
import { SharesModule } from '../../../../share/shares.module';
@NgModule({
  declarations: [
    WoPlaceOrderPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(WoPlaceOrderPage),
  ],
})
export class WoPlaceOrderPageModule {}
