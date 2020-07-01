import { Component } from '@angular/core';
import {
  IonicPage,
} from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-updateVersionLogPage',
  templateUrl: 'updateVersionLog.html',
})
export class UpdateVersionLogPage {

  constructor(

    ) {
  }



  // toggleFunHB(id) {
  //   let me = this
  //   console.log(id);
  //   let configuration = {
  //     id: id,
  //     value: !me.appCache.Configuration[id],
  //     storeId: me.appCache.store.id,
  //     salesId: me.appShopping.staff.id,
  //   }

  //   console.log(configuration);
  //   me.configurationDao.set(configuration).then(res => {
  //     me.appCache.Configuration[id] = configuration.value;
  //   })
  // }
}
