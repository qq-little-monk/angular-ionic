import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManNumberPage } from './man-number';
import { SharesModule } from '../../../../share/shares.module';

@NgModule({
  declarations: [
    ManNumberPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(ManNumberPage),
  ],
})
export class ManNumberPageModule { }
