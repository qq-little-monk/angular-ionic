import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HangOrderPage } from './hang-order';

@NgModule({
  declarations: [
    HangOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(HangOrderPage),
  ],
})
export class HangOrderPageModule {}
