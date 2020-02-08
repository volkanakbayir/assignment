import { ServiceBase } from "@Services/ServiceBase";
import Result from "@Models/Result";
import { IStockModel } from "@Models/IStockModel";
import { IPaginatedResult } from "@Models/IPaginatedResult";
import { ISellOrderModel } from "@Models/ISellOrderModel";
import { IBuyOrderModel } from "@Models/IBuyOrderModel";

export default class FishMarketService extends ServiceBase {
  public static async search(
    term: string = null,
    limit: number = 10,
    offset: number = 0
  ): Promise<Result<IPaginatedResult<IStockModel>>> {
    if (term == null) {
      term = "";
    }
    var result = await this.requestJson<IPaginatedResult<IStockModel>>({
      url: `/api/FishMarket/Search?term=${term}&limit=${limit}&offset=${offset}`,
      method: "GET"
    });
    return result;
  }

  public static async createSellOrder(
    order: ISellOrderModel
  ): Promise<Result<IStockModel>> {
    var result = await this.requestJson<IStockModel>({
      url: `/api/FishMarket/CreateSellOrder`,
      method: "POST",
      data: order
    });
    return result;
  }

  public static async createBuyOrder(
    order: IBuyOrderModel
  ): Promise<Result<IStockModel>> {
    var result = await this.requestJson<IStockModel>({
      url: `/api/FishMarket/CreateBuyOrder`,
      method: "POST",
      data: order
    });
    return result;
  }
}
