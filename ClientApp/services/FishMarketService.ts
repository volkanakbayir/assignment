import { ServiceBase } from "@Services/ServiceBase";
import Result from "@Models/Result";
import { IStockModel } from "../models/IStockModel";

export default class FishMarketService extends ServiceBase {
    public static async search(term: string = null): Promise<Result<IStockModel[]>> {
        if (term == null) {
            term = "";
        }
        var result = await this.requestJson<IStockModel[]>({
            url: `/api/FishMarket/Search?term=${term}`,
            method: "GET"
        });
        return result;
  }
}