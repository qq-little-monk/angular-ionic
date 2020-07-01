
import { WoMtOrderListPage } from './wo-mt-order-list';
import { SharesModule } from '../../../../share/shares.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    WoMtOrderListPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(WoMtOrderListPage),
  ],
})
export class WoMtOrderListPageModule {}
