import { ISpeciesModel } from "@Models/ISpeciesModel";
import { ISellOrderModel } from "@Models/ISellOrderModel";
import { IBuyOrderModel } from "@Models/IBuyOrderModel";
import { AppThunkAction, AppThunkActionAsync } from "@Store/index";
import Result from "@Models/Result";
import { Reducer, Action } from "redux";
import { clone } from "@Utils";
import { IStockModel } from "@Models/IStockModel";
import FishMarketService from "@Services/FishMarketService";
import { wait } from "domain-wait";
import { IPaginatedResult } from "@Models/IPaginatedResult";
import FishSpeciesService from "@Services/FishSpeciesService";

export namespace FishStore {
  export interface IState {
    species: ISpeciesModel[];
    totalCount: number;
    stock: IStockModel[];
    sellOrders: ISellOrderModel[];
    buyOrders: IBuyOrderModel[];
    indicators: {
      operationLoading: boolean;
    };
  }

  export enum Actions {
    Search = "SEARCH",
    SearchRequest = "SEARCH_REQUEST",
    AddSellOrder = "ADD_SELL_ORDER",
    AddBuyOrder = "ADD_BUY_ORDER",
    SetEditorSpecies = "SET_STOCK_EDITOR_SPECIES"
  }

  interface ISearch {
    type: Actions.Search;
    payload: IPaginatedResult<IStockModel>;
  }

  interface ISearchRequest {
    type: Actions.SearchRequest;
  }

  interface IAddSellOrder {
    type: Actions.AddSellOrder;
    payload: ISellOrderModel;
  }

  interface ISetEditorSpecies {
    type: Actions.SetEditorSpecies;
    payload: ISpeciesModel[];
  }

  interface IAddBuyOrder {
    type: Actions.AddBuyOrder;
    payload: IBuyOrderModel;
  }

  type KnownAction =
    | IAddBuyOrder
    | IAddSellOrder
    | ISearch
    | ISearchRequest
    | ISetEditorSpecies;

  export const actionsCreators = {
    search: (
      searchTerm: string,
      limit: number,
      offset: number
    ): AppThunkAction<KnownAction> => async (dispatch, getState) => {
      await wait(async transformUrl => {
        dispatch({ type: Actions.SearchRequest });

        const result = await FishMarketService.search(searchTerm, limit, offset);

        if (!result.hasErrors) {
          dispatch({ type: Actions.Search, payload: result.value });
        }
      });
    },
    loadSpecies: (): AppThunkAction<KnownAction> => async (
      dispatch,
      getState
    ) => {
      const result = await FishSpeciesService.getAll();

      if (!result.hasErrors) {
        dispatch({ type: Actions.SetEditorSpecies, payload: result.value });
      }
    },
    addSellOrder: (
      order: ISellOrderModel
    ): AppThunkActionAsync<KnownAction, Result<IStockModel>> => async (
      dispatch,
      getState
    ) => {
      const result = await FishMarketService.createSellOrder(order);

      if (!result.hasErrors) {
        dispatch({ type: Actions.AddSellOrder, payload: order });
      }

      return result;
    },

    addBuyOrder: (
      order: IBuyOrderModel
    ): AppThunkActionAsync<KnownAction, Result<IStockModel>> => async (
      dispatch,
      getState
    ) => {
      const result = await FishMarketService.createBuyOrder(order);

      if (!result.hasErrors) {
        dispatch({ type: Actions.AddBuyOrder, payload: order });
      }

      return result;
    }
  };

  const initialState: IState = {
    species: [],
    totalCount: 0,
    stock: [],
    sellOrders: [],
    buyOrders: [],
    indicators: {
      operationLoading: false
    }
  };

  export const reducer: Reducer<IState> = (
    currentState: IState = initialState,
    incomingAction: Action
  ) => {
    const action = incomingAction as KnownAction;

    const { indicators, sellOrders, buyOrders, stock } = currentState;

    var cloneIndicators = () => clone(indicators);

    switch (action.type) {
      case Actions.AddSellOrder: {
        const indicators = cloneIndicators();
        indicators.operationLoading = false;
        const specieStock = stock.find(
          s => s.specie.id === action.payload.specie.id
        );

        return {
          ...currentState,
          stock: [
            ...stock.filter((_, index) => index !== stock.indexOf(specieStock)),
            {
              specie: action.payload.specie,
              quantity:
                (specieStock ? specieStock.quantity : 0) +
                action.payload.quantity,
              latestPrice: action.payload.price
            }
          ],
          sellOrders: [...sellOrders, action.payload],
          indicators
        };
      }
      case Actions.AddBuyOrder: {
        const indicators = cloneIndicators();
        indicators.operationLoading = false;
        const specieStock = stock.find(
          s => s.specie.id === action.payload.specie.id
        );

        return {
          ...currentState,
          stock: [
            ...stock.filter((_, index) => index !== stock.indexOf(specieStock)),
            {
              ...specieStock,
              quantity: specieStock.quantity - action.payload.quantity
            }
          ],
          buyOrders: [...buyOrders, action.payload],
          indicators
        };
      }
      case Actions.SearchRequest: {
        const indicators = cloneIndicators();
        indicators.operationLoading = true;
        return { ...currentState, indicators };
      }
      case Actions.Search: {
        const indicators = cloneIndicators();
        indicators.operationLoading = false;

        return {
          ...currentState,
          indicators,
          stock: action.payload.data,
          totalCount: action.payload.total
        };
      }
      case Actions.SetEditorSpecies: {
        return {
          ...currentState,
          species: action.payload
        };
      }
      default:
        const exhaustiveCheck: never = action;
    }

    return currentState;
  };
}
