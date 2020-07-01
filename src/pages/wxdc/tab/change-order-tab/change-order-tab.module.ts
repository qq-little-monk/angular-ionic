import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeOrderTabPage } from './change-order-tab';

@NgModule({
  declarations: [
    ChangeOrderTabPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeOrderTabPage),
  ],
})
export class ChangeOrderTabPageModule { }
