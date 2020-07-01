import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommodityQrScanPage } from './commodity-qr-scan';
import { PipesModule } from '../../../pipes/pipes.module';


@NgModule({
  declarations: [
    CommodityQrScanPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(CommodityQrScanPage),
  ],
})
export class CommodityQrScanPageModule { }
