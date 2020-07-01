import {IBaseEntity} from "./iBaseEntity";

export interface ISimpleStocking extends IBaseEntity {
  id:string,
  createdBy: string,
  createdTime: string,
  imageQty: number,
  isDelete: number,
  itemCode: string,
  itemId: string,
  itemName: string,
  lastUpdateBy: string,
  lastUpdateTime: string,
  purchasePrice: string,
  remark: string,
  retailPrice: string,
  sortNo:string,
  stkCode: string,
  stkId: string,
  stockQty: number,//商品云库存
  stkQty: number,//实际商品库存
  storeId: string,
  unitName: string,
}

export class SimpleStocking implements ISimpleStocking {
  id:string;
  createdBy: string;
  createdTime: string;
  imageQty: number;
  isDelete: number;
  itemCode: string;
  itemId: string;
  itemName: string;
  lastUpdateBy: string;
  lastUpdateTime: string;
  purchasePrice: string;
  remark: string;
  retailPrice: string;
  sortNo:string;
  stkCode: string;
  stkId: string;
  stockQty: number;//商品云库存
  stkQty: number;//实际商品库存
  storeId: string;
  unitName: string;

  static tableName: string = 'tb_simple_stocking';
  static create: string = 'CREATE TABLE IF NOT EXISTS [tb_simple_stocking] (' + 
    '[id] VARCHAR2(50) PRIMARY KEY UNIQUE NOT NULL, ' +
    '[createdBy] VARCHAR2(50),' +
    '[createdTime] VARCHAR2(19), ' +
    '[imageQty] NUMERIC, ' +
    '[isDelete] INTEGER, ' +
    '[itemCode] VARCHAR2(50), ' +
    '[itemId] VARCHAR2(50), ' +
    '[itemName] VARCHAR2(50), ' +
    '[lastUpdateBy] VARCHAR2(50), ' +
    '[lastUpdateTime] VARCHAR2(19), ' +
    '[purchasePrice] VARCHAR2(50), ' +
    '[retailPrice] VARCHAR2(50), ' +
    '[sortNo] VARCHAR2(50), ' +
    '[stkCode] VARCHAR2(50), ' +
    '[stkId] VARCHAR2(50), ' +
    '[remark] VARCHAR2(50), ' +
    '[stockQty] NUMERIC, ' +
    '[stkQty] NUMERIC, ' +
    '[storeId] VARCHAR2(50), ' +
    '[unitName] VARCHAR2(50) ' +
    ')';


  static toJson() {
    return {
      id:null,
      createdBy: null,
      createdTime: null,
      imageQty: 0,
      isDelete: 0,
      itemCode: null,
      itemId: null,
      itemName: null,
      lastUpdateBy: null,
      lastUpdateTime: null,
      purchasePrice: null,
      remark: null,
      retailPrice: null,
      sortNo:null,
      stkCode: null,
      stkId: null,
      stockQty: null,//商品云库存
      stkQty: null,//实际商品库存
      storeId: null,
      unitName: null,
    }
  }
}
