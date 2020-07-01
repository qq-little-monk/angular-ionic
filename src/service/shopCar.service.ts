import { Injectable } from '@angular/core';
import { UtilProvider } from '../providers/util/util';
import { AppCache } from '../app/app.cache';
import { HttpProvider } from '../providers/http';
import { HelperService } from '../providers/Helper';
import { SalesDetailDao } from '../dao/salesDeailDao';
import { LogService } from './logService';
import { Events, App } from 'ionic-angular';
import { AppPermission } from '../app/app.permission';
import { WoShopService } from './wo.shop.service';
import { SalesCampaignService } from './salesCampaign.service';
import { AppShopping } from '../app/app.shopping';



/*
  Generated class for the WoShopProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
/**
 * 重构购物车数据结构
 * 上传要重构数据
 * 下载要格式数据
 */
export class ShopCarService {
  public shopInfo: any = {};  //商店信息
  public diners: any = {
    dinersNum: 1,
  }


  constructor(public salesDetailDao: SalesDetailDao,
    public appShopping: AppShopping,
  ) {


  }


}
