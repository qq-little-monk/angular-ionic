
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewAddCustomerPage } from './newAddCustomer';


@NgModule({
  declarations: [
    NewAddCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(NewAddCustomerPage),
  ],
})
export class CustomerSearchPageModule { }
