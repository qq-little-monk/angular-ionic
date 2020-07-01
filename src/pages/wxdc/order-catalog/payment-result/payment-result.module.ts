import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentResultPage } from './payment-result';

@NgModule({
  declarations: [
    PaymentResultPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentResultPage),
  ],
})
export class PaymentResultPageModule {}
