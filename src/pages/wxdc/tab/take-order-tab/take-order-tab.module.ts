import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TakeOrderTabPage } from './take-order-tab';

@NgModule({
  declarations: [
    TakeOrderTabPage,
  ],
  imports: [
    IonicPageModule.forChild(TakeOrderTabPage),
  ],
})
export class TakeOrderTabPageModule { }
