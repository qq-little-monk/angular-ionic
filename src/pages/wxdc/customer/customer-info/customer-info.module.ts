
import { CustomerInfoPage } from './customer-info';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';



@NgModule({
  declarations: [
    CustomerInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerInfoPage),
  ],
})
export class CustomerInfoPageModule { }
