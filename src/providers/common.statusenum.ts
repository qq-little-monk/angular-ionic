import { Injectable } from '@angular/core';

/*
  Generated class for the CommonStatusenumProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonStatusEnum {

  constructor() { };

    //系统类型 CSY：超市云  ：美超云  ：美食云
    static SysType: any = {
        L: 'CSY',
        MCY: 'MCY',
        MSY: 'MSY'
    }

    //登录类型 m:手机号码  a：平台账号
    static LoginWay: any = {
        m: 'm',
        a: 'a'
    }

    //api请求类型
    static ApiType: any = {
        d: 'default',
        w: 'waimai',
    }

    //当前平台模式  single： 单店  platform： 平台
    static SysMode: any = {
        s: 'single',   
        p: 'platform'
    }

    // 0:无, 2: 零售折扣, 1 会员价1,3:会员价2, 4:会员价3, 5：会员价4, 6:会员价5',
    static DisCountType: any = {
        rp: 0,
        dc: 2,
        v1: 1,
        v2: 3,
        v3: 4,
        v4: 5,
        v5: 6
    }

    static PayWay: any = {
        hd: 1,   // 货到付款
        zx: 2,   // 在线支付
        hy: 3,   // 会员支付
        dd: 4,    // 到店支付
        1: '货到付款',
        2: '在线支付',
        3: '会员支付',
        4: '到店支付'
    }

    //订单状态 0-待付款  1-用户已提交订单（已支付）2-商家已确认 3：用户申请取消 6-已配送 8-已完成 9-已取消-交易关闭 10-退款中'
    static OrderStatus: any = {
        np: 'nopay',  // 待付款
        df: 'daiFaHuo', // 待发货
        ds: 'daiShouHuo', // 待收货
        cp: 'complete', // 已完成
        cc: 'cancel', // 已取消/交易关闭
        0: '待付款',
        1: '已支付',
        2: '商家已确认',
        3: '申请取消',
        6: '已配送',
        7: '商家拒绝接单',
        8: '已完成',
        9: '已取消',
        10: '退款中'
    }

    //订单支付状态 0 未支付 1 支付成功  2支付中 3 支付失败',
    static PayStatus:any = {
        0: '未支付',
        1: '支付成功',
        2: '支付中',
        3: '支付失败'
    } 

    //配送方式 商家自配送 1  众包专送2  3:专送  自取4
    static LogisticsType: any = {
        1: '商家自配送',
        2: '众包专送',
        3: '专送',
        4: '自取',
        ss: 1,
        zb: 2,
        zs: 3,
        zq: 4
    }


}
