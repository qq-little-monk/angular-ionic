import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrinterDeviceWifiPage } from './printer-device-wifi';

@NgModule({
  declarations: [
    PrinterDeviceWifiPage,
  ],
  imports: [
    IonicPageModule.forChild(PrinterDeviceWifiPage),
  ],

})
export class PrinterDeviceWifiPageModule {}
