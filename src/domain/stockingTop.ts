import {IBaseEntity} from "./iBaseEntity";

export interface IStockingTop extends IBaseEntity {
  aprrovedBy:string,
  aprrovedByName:string,
  aprrovedTime:string,
  createdBy:string,
  createdByName:string,
  createdTime:string,
  id:string,
  lastUpdateBy:string,
  lastUpdateTime:string,
  stkDate:string,
  stkNo:string,
  stkRemark:string,
  storeId:string,
}

export class StockingTop implements IStockingTop {
  aprrovedBy:string;
  aprrovedByName:string;
  aprrovedTime:string;
  createdBy:string;
  createdByName:string;
  createdTime:string;
  id:string;
  lastUpdateBy:string;
  lastUpdateTime:string;
  stkDate:string;
  stkNo:string;
  stkRemark:string;
  storeId:string;

  static tableName: string = 'tb_stocking_top';
  static create: string = 'CREATE TABLE IF NOT EXISTS [tb_stocking_top] (' + 
    '[stkNo] VARCHAR2(50) PRIMARY KEY UNIQUE NOT NULL, ' +
    '[aprrovedBy] VARCHAR2(50),' +
    '[aprrovedByName] VARCHAR2(50),' +
    '[aprrovedTime] VARCHAR2(19), ' +
    '[createdBy] VARCHAR2(50), ' +
    '[createdByName] VARCHAR2(50), ' +
    '[createdTime] VARCHAR2(50), ' +
    '[id] VARCHAR2(50), ' +
    '[lastUpdateBy] VARCHAR2(19), ' +
    '[lastUpdateTime] VARCHAR2(50), ' +
    '[stkDate] VARCHAR2(50), ' +
    '[stkRemark] VARCHAR2(50), ' +
    '[storeId] VARCHAR2(50) ' +
    ')';


  static toJson() {
    return {
      // id:null,
      aprrovedBy:null,
      aprrovedByName:null,
      aprrovedTime:null,
      createdBy:null,
      createdByName:null,
      createdTime:null,
      id:null,
      lastUpdateBy:null,
      lastUpdateTime:null,
      stkDate:null,
      stkNo:null,
      stkRemark:null,
      storeId:null,
    }
  }
}
