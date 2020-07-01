import { SysMsg } from "../domain/sysMsg";
import { Injectable } from "@angular/core";
// import { SimpleStockingDao } from "../dao/simpleStockingDao";
// import { SimpleStocking } from "../domain/simpleStocking";


@Injectable()
export class AppCache {

    user: any = null;
    store: any = null;
    macId: string = '';

    startRight: number = 20;
    startBottom: number = 30;
    userToken: any = {};
    selSeller: any = {};
    seller: any;
    processing_table: boolean;
    processing_waimai: any;
    badgeNum: any;
    totalMsgNum: any;
    sysMsg0: any;
    subSellers: any;
    sysMsgs: any;
    processing_cash: any;
    sysMsg1: any;
    msgShowed: any;
    rootPage: string = '';
    // 显示图片模式
    showNoImgMode: boolean = false;
    isBackgroundMode: boolean = false; //记录设备是否进入后台

    //配置信息
    Configuration: any = {
        DY_GKD: true,
        DY_TD: true,
        DY_YJD: true,
        DY_JZD: true,
        DY_JCD: true,
        DY_TCD: true,
        DY_SPMS: 0,

        DP_MS: true,
        DP_HB: false,
        DP_DP: false,
        DP_DPNUM: 2,

        DP_LAND: false,//横屏
        DP_NOIMG: false,  // 图片模式 ,true无图，false有图
        JC_ORDER_ONCHANG: true,
    };


    //切换店铺须清除缓存
    changStoreResetData() {


    }
    resetData() {
        this.user = null;
        this.store = null;
        this.macId = null;
        this.rootPage = '';
        this.Configuration = {
            DY_GKD: true,//顾客单
            DY_TD: true,//台单
            DY_YJD: true,//预结单
            DY_JZD: true,//结账单
            DY_JCD: true,//加菜单
            DY_TCD: true,//退菜单
            DY_SPMS: 0,//品名字体大小

            DP_MS: true,//true：点餐页面 fales：桌台页面
            DP_HB: false,//true：合并普通商品 默认不合并
            DP_DP: false,//true：开启大屏显示 默认不开启
            DP_DPNUM: 2,//大屏显示列数
            DP_LAND: false,
            DP_NOIMG: false,  // 图片模式 ,true无图，false有图
            JC_ORDER_ONCHANG: true,
        };
    };

}