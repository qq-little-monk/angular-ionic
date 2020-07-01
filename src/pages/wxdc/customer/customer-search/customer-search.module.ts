
import { CustomerSearchPage } from './customer-search';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';



@NgModule({
  declarations: [
    CustomerSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerSearchPage),
  ],
})
export class CustomerSearchPageModule { }
