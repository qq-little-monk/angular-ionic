import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TakeOrderPage } from './take-order';
import { SharesModule } from '../../../../share/shares.module';
@NgModule({
  declarations: [
    TakeOrderPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(TakeOrderPage),
  ],
})
export class TakeOrderPageModule { }
