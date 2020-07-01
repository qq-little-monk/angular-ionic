import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WoCommodityDetailPage } from './wo-commodity-detail';
import { SharesModule } from '../../../../share/shares.module';
@NgModule({
  declarations: [
    WoCommodityDetailPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(WoCommodityDetailPage),
  ],
})
export class WoCommodityDetailPageModule {}
