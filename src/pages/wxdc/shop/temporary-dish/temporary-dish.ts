import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from "@angular/core";
import { IonicPage,NavController, NavParams} from 'ionic-angular';
import { HttpProvider } from '../../../../providers/http';
import { AppCache } from '../../../../app/app.cache';
import { PrintProvider } from '../../../../providers/print';
import { PrinterDeviceDao } from '../../../../dao/PrinterDeviceDao';
import { PrinterType, linkType } from '../../../../domain/enum';
import { AppShopping } from '../../../../app/app.shopping';
import { WebSocketService } from '../../../../service/webSocketService';
import { TableService } from '../../../../service/tableService';
import { WoShopService } from '../../../../service/wo.shop.service';
import { PrintService } from '../../../../service/printService';
import { from } from "rxjs/observable/from";
import { UtilProvider } from "../../../../../src/providers/util/util";

@IonicPage()
@Component({
    selector: 'temporary-dish',
    templateUrl: 'temporary-dish.html'
})

export class TemporaryDishPage{
    public isAppear:boolean = false;//隐藏弹框
    toggleVal:boolean;//toggle的值
    selectVal:any;//下拉的值
    nuitNameVal:any;//单位的值
    commodityNameVal:any;//商品名称
    commodityPriceVal:any;//商品价格
    kitchenPrinterList:Array<any>=[];//厨房打印机
    spuEntity: any; //spu商品信息
    skuEntitys: any; //sku商品信息
    // nuitName:Array<any>=['本','杯','包','把','床','对','袋','份','g','根','罐','个','盒','件','斤','卷','kg','块','捆','例','粒','瓶','片','排','双','提','台','听','桶','套','条','碗','箱','组','张','扎','只','支'];//菜品的单位
    nuitName:Array<any>;
    kichentStatus: number = 0;
    ktPrints: any[] = [];

    constructor(public http: HttpProvider,
        public printerDeviceDao: PrinterDeviceDao,
        public appCache: AppCache,
        public printProvider: PrintProvider,
        public shopSer: WoShopService,
        public printService: PrintService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public appShopping: AppShopping,
        public tableService: TableService,
        public webSocketService: WebSocketService,
        public util: UtilProvider){

    }
    ngOnInit(){
      //获取商品单位
      this.webSocketService.getCommodityUnit({}).subscribe(res=>{
        console.log(res);
        this.nuitName = res.data.data.units;
      })
      //获取厨房打印机
      this.webSocketService.getKitchenPrinter({}).subscribe(res=>{
        console.log(res);
        this.kitchenPrinterList = res.data.data;
      })
       //获取无码商品
       this.webSocketService.getNoCodeGood().subscribe(res=>{
        console.log(res);
        this.spuEntity = res.data.spuEntity;
        this.skuEntitys = res.data.skuEntitys;
      })
    }

    ionViewWillEnter(){
    }

    //取消
    toCancel(){
        this.navCtrl.pop()
    }

    //添加临时菜
    addTemporaryDish(){
        if(!this.nuitNameVal){
            this.nuitNameVal = "例";
        }
        if(this.commodityNameVal == '' || !this.commodityNameVal){
            this.http.showToast('请输入商品名称！');
            return;
        }
        if(this.commodityPriceVal == '' || !this.commodityPriceVal){
            this.http.showToast('请输入商品价格！');
            return;
        }
        if(!this.toggleVal){
            this.selectVal = "";
        }
        //不存在无码商品 自动构建
        if (!this.spuEntity) {
            this.spuEntity = {};
            this.spuEntity.itemName = '默认商品';
            this.spuEntity.itemCode = '999999999';
            this.spuEntity.isSys = 1;
            this.spuEntity.cateName = '默认分类';
            this.spuEntity.cateId = this.util.genUUID();
            this.skuEntitys = [];
        }

        let itemSku = this.shopSer.selectSkuBySpuId(this.spuEntity.id)[0];
        let comSpuExt = this.shopSer.selectSpuExtById(this.spuEntity.id);

        //处理商品信息
        this.spuEntity.nuitName = this.nuitNameVal;
        this.spuEntity.unitId = this.nuitNameVal;
        this.spuEntity.itemName = this.commodityNameVal;
        this.spuEntity.retailPrice = this.commodityPriceVal;
        this.spuEntity.printerId = JSON.stringify(this.selectVal);
        //规格
        itemSku.nuitName = this.nuitNameVal;
        itemSku.unitId = this.nuitNameVal;
        itemSku.itemName = this.commodityNameVal;
        itemSku.retailPrice = this.commodityPriceVal;

        let data = {
          itemSpu: this.spuEntity,
          itemSku: itemSku,
          comSpuExt: comSpuExt
        }
        this.shopSer.addToCar(data);
        this.navCtrl.pop()
    }

}