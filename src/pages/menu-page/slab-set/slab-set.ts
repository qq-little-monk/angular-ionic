import { Component } from '@angular/core';
import {
  IonicPage,
} from 'ionic-angular';
import { AppCache } from '../../../app/app.cache';
import { AppShopping } from '../../../app/app.shopping';
import { ConfigurationDao } from '../../../dao/configurationDao';
import { ScreenOrientation } from "@ionic-native/screen-orientation";



@IonicPage()
@Component({
  selector: 'page-slabsetPage',
  templateUrl: 'slab-set.html',
})
export class SlabSetPage {

  constructor(
    public appCache: AppCache,
    public appShopping: AppShopping,
    public configurationDao: ConfigurationDao,
    public screenOrientation: ScreenOrientation,
  ) {
  }
  // 切换图片模式
  toggleFunNoImg(configValue) {
    let me = this;
    let configuration = {
      id: configValue,
      value: !me.appCache.Configuration[configValue],
      storeId: me.appCache.store.id,
      salesId: me.appShopping.staff.id,
    };
    me.configurationDao.set(configuration).then(res => {
      me.appCache.Configuration[configValue] = configuration.value;
    });
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
      if(id=='DP_LAND'){
       this.landOrPort();
      }
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

  landOrPort() {
    if (this.appCache.Configuration && this.appCache.Configuration.DP_LAND) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    } else {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
}
