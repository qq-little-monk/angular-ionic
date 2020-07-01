import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSeatPage } from './select-seat';

@NgModule({
  declarations: [
    SelectSeatPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectSeatPage),
  ],
})
export class SelectSeatPageModule {}
