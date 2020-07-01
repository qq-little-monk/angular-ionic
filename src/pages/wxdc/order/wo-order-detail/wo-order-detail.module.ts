import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WoOrderDetailPage } from './wo-order-detail';
import { SharesModule } from '../../../../share/shares.module';
@NgModule({
  declarations: [
    WoOrderDetailPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(WoOrderDetailPage),
  ],
})
export class WoOrderDetailPageModule {}
