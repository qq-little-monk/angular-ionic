import { NgModule } from '@angular/core';
import { SaleService } from './saleService ';
import { ShoppingService } from './shoppingService ';
import { WebSocketService } from './webSocketService';
import { WoOrderService } from './wo.order.service';
import { WoShopService } from './wo.shop.service';
import { TableService } from './tableService';
import { MessageServiceBase } from './MessageServiceBase';
import { MobileMessageService } from './mobile/MobileMessageService';
import { LogService } from './logService';
import { PrintService } from './printService';
import { SalesCampaignService } from './salesCampaign.service';
import { ShopCarService } from './shopCar.service';

@NgModule({
  providers: [WebSocketService, SaleService, ShoppingService, WoOrderService, WoShopService, LogService, PrintService,
    TableService, MessageServiceBase, MobileMessageService, SalesCampaignService, ShopCarService]
})
export class ServiceModule { }
