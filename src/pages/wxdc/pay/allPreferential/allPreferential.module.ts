import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllPreferentialPage } from './allPreferential';
import { SharesModule } from '../../../../share/shares.module';

@NgModule({
  declarations: [
    AllPreferentialPage,
  ],
  imports: [
    SharesModule,
    IonicPageModule.forChild(AllPreferentialPage),
  ],
})
export class AllPreferentialPageModule { }
