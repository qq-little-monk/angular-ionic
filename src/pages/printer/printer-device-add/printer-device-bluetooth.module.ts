import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrinterDeviceBluetoothPage } from './printer-device-bluetooth';

@NgModule({
  declarations: [
    PrinterDeviceBluetoothPage,
  ],
  imports: [
    IonicPageModule.forChild(PrinterDeviceBluetoothPage),
  ],
})
export class PrinterDeviceBluetoothPageModule {}
