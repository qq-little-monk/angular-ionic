import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrinterDeviceSelectPage } from './printer-device-select';

@NgModule({
  declarations: [
    PrinterDeviceSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(PrinterDeviceSelectPage),
  ],
})
export class PrinterDeviceSelectPageModule {}
