import { IBuyOrderModel } from "./IBuyOrderModel";
import { ISellOrderModel } from "./ISellOrderModel";

export type IOrderModel = (IBuyOrderModel | ISellOrderModel) & {
  type: "buy" | "sell";
};
