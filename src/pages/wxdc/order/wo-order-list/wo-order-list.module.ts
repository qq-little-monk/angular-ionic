import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WoOrderListPage } from './wo-order-list';
import { SharesModule } from '../../../../share/shares.module';
@NgModule({
  declarations: [
    WoOrderListPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(WoOrderListPage),
  ],
})
export class WoOrderListPageModule {}
