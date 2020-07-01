import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QRScanPage } from './qr-scan';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    QRScanPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(QRScanPage),
  ],
})
export class QRScanPageModule {}
