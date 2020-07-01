import { Injectable } from "@angular/core";
import { isNumber } from "ionic-angular/umd/util/util";

@Injectable()
export class AppConstants {
    readonly SYSCODE: string = 'VB';
    //readonly VERSION:string = '1.02';
    readonly VERSION: string = '0.0.11';
    readonly SYS_SELLER_ID: string = '10000';
    readonly ID_UESR_TB: string = "eaece0f2f50b4714b5676356e6b633dd";

    readonly MSG_SOUND: string = 'assets/sounds/new_msg.mp3';

    readonly PRINTER_TYPE_SOCKET: string = '0'; //socket 打印机
    readonly PRINTER_TYPE_BLUETOOTH: string = '1'; //蓝牙打印机
    readonly PRINTER_MODEL_SPLIT: string = '0'; //分单
    readonly PRINTER_MODEL_MERGE: string = '1'; //合并
    readonly PRINTER_CHECK_INTERVAL: number = 600000;//打印机状态查询时间周期
    readonly WAIMAICOUNT_INTERVAL: number = 1000; //外卖订单查询时间周期
    readonly WAIMAICOUNT_PERIOD: number = 30000;  //外卖订单查询间隔
    readonly TABLECOUNT_INTERVAL: number = 1000; //桌台订单查询时间周期
    readonly TABLECOUNT_PERIOD: number = 30000; //桌台订单查询间隔
    readonly REQ_TIMEOUT: number = 30000;  //请求超时时间
 
    readonly APP_STORE_URL: string = 'https://itunes.apple.com/us/app/爱宝点菜宝(旗舰版)/id1476232182?l=zh&ls=1&mt=8';

    readonly MULT_REPORT_CACHE: string = "MULT_REPORT_CACHE";
    readonly MULT_REPORT_KEY_CACHE: string = "MULT_REPORT_KEY_CACHE";
    readonly SINGLE_REPORT_CACHE: string = "SINGLE_REPORT_CACHE";

    readonly MSG_PAGE_SIZE: number = 20;

    /**日志类型 */
    readonly OPERATION_TYPE = { 'YH': '优惠', 'TC': '退菜', 'JC': '加菜', 'QD': '取单', 'XD': '下单', 'CT': '撤台', 'ZT': '转台', 'ZF': '支付', 'JZ': '结账' };
    readonly OPERATION_TYPE_KEY = ['YH', 'TC', 'JC', 'QD', 'XD', 'CT', 'ZT', 'ZF', 'JZ'];

    //更新日志
    readonly LOG = '1，新增支持总店管理分店功能<br/>2，新增管理商品调价单功能<br/>3，新增连锁商品资料，单位，品牌，分类，供应商复制功能<br/>4，新增商品批量操作功能<br/>5，配合后台修改部分页面';

    //类型对象
    //'-1': '挂起',
    readonly SALES_STATUS = { '0': '下单', '1': '完成', '2': '作废' };//销售单据状态值
    //readonly SALES_STATUS2 = { '0': '未审核', '1': '已审核'};//库存盘点状态值

    readonly SALES_PROM_STATUS = { '0': '未审核', '1': '已审核', '2': '终止' };//促销计划状态值
    //readonly SALES_TYPE = { 'S': '零售', 'W':'批发', 'R': '退货', 'V': '取消' };
    readonly SALES_TYPE = { 'S': '堂食', 'T': '外带', 'W': '批发' };
    readonly RECHARGE_TYPE = { 'RCA': '充值', 'RCU': '消费', 'RCT': '转移' };
    readonly CUST_TYPE = { '1': '非会员', '2': '会员' };//客户类型
    readonly TRADE_TYPE = { '1': '餐饮行业' };
    readonly TIMES_TYPE = { 'TP': '购买', 'TU': '消费' };
    // readonly DISCOUNT_TYPE = {'1': '启用', '0': '未启用'};
    //readonly DISCOUNT_TYPE = {'1': '启用', '0': '禁用'};//会员列表详情启用状态
    readonly STATUS = { 'N': '禁用', 'Y': '启用' };//会员列表详情启用状态
    readonly SEX = { '1': '男', '0': '女' };
    readonly POINT_TYPE = { 'S': '销售积分', 'E': '兑换积分', 'A': '积分调整' };
    readonly TRANS_TYPE = { 'S': '销售', 'TS': '次卡销售', 'CA': '储值卡充值' };
    readonly HANDOVER_STATUS = { '0': '未交班', '1': '已交班' };
    //货流
    readonly ORDER_STATUS = { '0': '未完成', '1': '已完成' };//单据状态
    // readonly ORDER_TYPE = { 'CTrans': '调货单', 'CIn': '进货单','COut': '出库单', 'CReturn': '退货单' };//货单类型
    // readonly TRAN_STATUS = { '0': '待确认出货', '1': '已完成出货','2': '已拒绝出货', '3': '待确认收货','4': '已完成收货', '5': '已拒绝收货','7': '已完成退货' };//处理状态
    readonly CARGO_STATUS = { '0': '待审核', '1': '配货中', '2': '已配货', '3': '已拒绝', '4': '已作废' };//配货状态
    readonly SET_STATUS = { '0': '待确认', '1': '待对账', '2': '待结算', '3': '已结算' };//供应商结算状态


    readonly MEMBER_STATUS = { 'Y': '启用', 'N': '禁用' };

    readonly ITEM_TYPE = { 'N': '普通商品', 'G': '组合商品', 'S': '服务', };

    readonly MODEE = { 'S': '特价', 'C': '第二件特价', 'F': '满减' };//促销报表的促销方式
    readonly STOCKSTATUS = { '-1': '库存不足', '0': '库存正常', '1': '库存过量' };
    readonly OUTINTYPE = { 'OUT': '出库', 'IN': '入库' };
    readonly TRAN_TYPE = {
        'S': '销售单', 'W': '批发单', 'R': '销售退货', 'I': '初始库存', 'PD': '盘点', 'IN': '入库', 'OUT': '出库', 'PR': '采购收货',
        'RO': '采购退货', 'E': '积分兑换', 'COT': '出库单', 'CIN': '进货单', 'CRT': '货流退货', 'GD': '商品报损', 'CT': '调货单', 'V': '销售取消'
    };

    readonly MEASURE = { 'P': '普通', 'Z': '计重', 'S': '计数' };
    // readonly TRANTYPE =[{'S': '销售单'}, {'R': '销售退货'},{'I': '初始库存'}, {'PD': '盘点'},{'IN': '入库'}, {'OUT': '出库'},{'PR': '采购收货'}, 
    // {'RO': '采购退货'},{'E': '积分兑换'}, {'COT': '出库单'},{'CIN': '进货单'}, {'CRT': '货流退货'},{'GD': '商品报损'}, {'CT': '调货单'}];

    readonly STAFFTYPENO = { 'W': '配送员', 'C': '收银员', 'S': '导购员', 'A': '管理员' };
    readonly DISABLED = { '0': '正常', '1': '停用' };
    readonly STATE_EMPLOYEES = { '0': '正常', '1': '禁用' };

    readonly SELECT_MODE = { 'A': '按门店会员', 'B': '按会员消费' };
    readonly TRANS_STATUS = { '1': '已还款', '0': '未还款', '2': '已作废', '3': '部分还款' };
    readonly ADJUST_PRICE_STATUS = { '1': '已执行', '0': '未执行' };
    readonly ADJUST_PRICE_STYLE = { 'PP': '进货价调整', 'RP': '销售价调整', 'VIPP': '会员价调整', 'WSP': '批发价调整' };
    readonly DOCTYPE = { '0': '未收货', '1': '部分收货', '2': '全部收货' };
    readonly PURCHASE_STATUS = { '0': '待审核', '1': '已审核', };
    readonly PURCHASE_TYPE = { 'PO': '采购申请', 'PR': '采购收货', 'RO': '采购退货' };
    readonly P_ORDER_TYPE = { 'CIn': '门店进货单', 'CReturn': '门店退货单', 'CTransOut': '调拨出货单', 'CTransIn': '调拨进货单', 'COut': '普通出库单' };
    readonly G_ORDER_TYPE = { 'CTrans': '调货单', 'CIn': '进货单', 'COut': '出库单', 'CReturn': '退货单' };
    // ,'6':'待确认退货','8':'已拒绝退货'
    readonly G_ORDER_STATUS = { '0': '待确认出货', '1': '已完成出货', '2': '已拒绝出货', '3': '待确认收货', '4': '已完成收货', '5': '已拒绝收货', '7': '已完成退货' };
    readonly REDUCT_ITEM_TYPE = { 'ALL': '全部商品', 'SKU': '商品', 'BRAND': '品牌', 'CATEGORY': '分类' };

    //销售分类统计类型
    readonly IS_CHECK_BRAND = { '0': '类别', '1': '品牌', '2': '供应商', };
    readonly IN_OUT_TYPE = { 'I': '收入', 'O': '支出', };
    readonly STK_TYPE = { '0': '全场盘点', '1': '按类别盘点', '2': '按品牌盘点', '3': '按供应商盘点', '4': '按单品盘点', };
    readonly RECHARGE_ITEM = { 'B': '通用余额', };
    //是否允许会员赊账
    readonly CHARGE_ACCOUNT = { '0': '否', '1': '是' };

    readonly DISCOUNT_TYPES = { '0': '无', '2': '折扣率', '1': '会员价1', '3': '会员价2', '4': '会员价3', '5': '会员价4', '6': '会员价5' };
    readonly TRADE_PRICE_TYPES = { '1': '批发价1', '2': '批发价2', '3': '批发价3', '4': '批发价4', '5': '批发价5' };

    readonly ORDER_TYPES = { 'CTrans': '调货单', 'COut': '出库单', 'CIn': '进货单', };
    readonly S_ORDER_TYPES = { 'N': '销售单', 'R': '退货单', 'V': '取消单', };

    readonly NUM_MAX_LENGTH = 99999.99;
    readonly NUM_LENGHT_ERROR_HINT = '请输入0~99999.99之间的数值';
    getKeys(obj: {}): any[] {
        let keys: any[] = [];
        for (let key in obj) {
            keys.push(key);
        }
        return keys;
    }

    stringCutOut(st: string, start, end) {
        return st.substring(start, end)
    }
    // getArray(obj:{}):any[] {
    //     let Array:any[] = [];
    //     for(let key in obj) {
    //         Array.push(key);
    //     }
    //     return Array;
    // }
}