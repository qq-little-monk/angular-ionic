import { Component } from '@angular/core';
import {
  IonicPage,
} from 'ionic-angular';
import { AppCache } from '../../../app/app.cache';
import { AppShopping } from '../../../app/app.shopping';
import { ConfigurationDao } from '../../../dao/configurationDao';



@IonicPage()
@Component({
  selector: 'page-systemsetPage',
  templateUrl: 'system-set.html',
})
export class SystemSetPage {

  constructor(
    public appCache: AppCache,
    public appShopping: AppShopping,
    public configurationDao: ConfigurationDao,
  ) {
  }
  toggleFunHB(id) {
    let me = this
    console.log(id);
    let configuration = {
      id: id,
      value: !me.appCache.Configuration[id],
      storeId: me.appCache.store.id,
      salesId: me.appShopping.staff.id,
    }

    console.log(configuration);
    me.configurationDao.set(configuration).then(res => {
      me.appCache.Configuration[id] = configuration.value;
    })
  }
  fontSize(id) {
    console.log(id);
    let configuration = {
      id: id,
      value: this.appCache.Configuration[id] || 2,
      storeId: this.appCache.store.id,
      salesId: this.appShopping.staff.id,
    }
    console.log(configuration);

    this.configurationDao.set(configuration).then(res => {
      console.log(res);
    })
  }
}
