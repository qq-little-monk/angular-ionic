import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayMentPage } from './payMent';
import { SharesModule } from '../../../../share/shares.module';
@NgModule({
  declarations: [
    PayMentPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(PayMentPage),
  ],
})
export class PayMentPageModule { }
