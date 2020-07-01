import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SystemSetPage } from './system-set';

@NgModule({
  declarations: [
    SystemSetPage,
  ],
  imports: [
    IonicPageModule.forChild(SystemSetPage),
  ],
})
export class SystemSetPageModule {}
