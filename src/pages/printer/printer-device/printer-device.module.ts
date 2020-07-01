import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrinterDevicePage } from './printer-device';

@NgModule({
  declarations: [
    PrinterDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(PrinterDevicePage),
  ],
})
export class PrinterDevicePageModule {}
