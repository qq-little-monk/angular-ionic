import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayCouponQueryPage } from './payCouponQuery';
import { SharesModule } from '../../../../share/shares.module';

@NgModule({
  declarations: [
    PayCouponQueryPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(PayCouponQueryPage),
  ],
})
export class PayCouponQueryPageModule { }
