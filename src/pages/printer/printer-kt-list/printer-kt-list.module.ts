import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrinterKtListPage } from './printer-kt-list';

@NgModule({
  declarations: [
    PrinterKtListPage,
  ],
  imports: [
    IonicPageModule.forChild(PrinterKtListPage),
  ],
})
export class PrinterKtListPageModule {}
