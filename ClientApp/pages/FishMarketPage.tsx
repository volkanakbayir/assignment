import "@Styles/main.scss";
import * as React from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router";
import { ApplicationState } from "@Store/index";
import { connect } from "react-redux";
import { PagingBar } from "@Components/shared/PagingBar";
import Loader from "@Components/shared/Loader";
import bind from "bind-decorator";
import { ModalComponent } from "@Components/shared/ModalComponent";
import { FishStore } from "@Store/FishStore";
import { IStockModel } from "@Models/IStockModel";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import OrderEditor from "@Components/fishMarket/OrderEditor";
import { getPromiseFromAction } from "@Utils";
import { IOrderModel } from "@Models/IOrderModel";
import { TopActionBar } from "@Components/shared/topActionBar";
import { StockRow } from "@Components/fishMarket/stockRow";
import { Ui } from "@Ui";

type Props = RouteComponentProps<{}> &
  typeof FishStore.actionsCreators &
  FishStore.IState &
  Function;

interface IState {
  editingOrder: IOrderModel;
  searchTerm: string;
  pageNum: number;
  limitPerPage: number;
  rowOffset: number;
}

class FishMarketPage extends React.Component<Props, IState> {
  private pagingBar: PagingBar;

  private elModalAdd: ModalComponent;

  private orderEditorAdd: OrderEditor;

  private debouncedSearch = AwesomeDebouncePromise(() => {
    this.getPagedData();
  }, 500);

  constructor(props: Props) {
    super(props);

    this.state = {
      editingOrder: {} as IOrderModel,
      searchTerm: "",
      pageNum: 1,
      limitPerPage: 5,
      rowOffset: 0
    };
  }

  componentWillMount() {
    this.props.loadSpecies();
    this.getPagedData();
  }

  getPagedData() {
    this.props.search(
      this.state.searchTerm,
      this.state.limitPerPage,
      this.state.rowOffset
    );
  }

  @bind
  onChangeSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    var val = e.target.value;

    this.setState(
      {
        searchTerm: val,
        pageNum: 1
      },
      () => {
        this.debouncedSearch();
      }
    );
  }

  @bind
  onClickShowAddModal(e: React.MouseEvent<HTMLButtonElement>) {
    this.setState(
      {
        editingOrder: {} as IOrderModel
      },
      () => {
        this.elModalAdd.show();
      }
    );
  }

  @bind
  onChangePage(pageNum: number): void {
    let rowOffset = Math.ceil((pageNum - 1) * this.state.limitPerPage);
    this.setState({ pageNum, rowOffset }, () => {
      this.getPagedData();
    });
  }

  @bind
  onBuyStock(stock: IStockModel) {
    this.setState(
      {
        editingOrder: {
          specie: stock.specie,
          type: "buy"
        } as IOrderModel
      },
      () => {
        this.elModalAdd.show();
      }
    );
  }

  @bind
  onSellStock(stock: IStockModel) {
    this.setState(
      {
        editingOrder: {
          specie: stock.specie,
          type: "sell"
        } as IOrderModel
      },
      () => {
        this.elModalAdd.show();
      }
    );
  }

  @bind
  renderRows(data: IStockModel[]) {
    return data.map(stock => (
      <StockRow
        key={stock.id}
        stock={stock}
        onBuy={this.onBuyStock}
        onSell={this.onSellStock}
      />
    ));
  }

  @bind
  async onClickAddNewOrder__saveBtn(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!this.orderEditorAdd.elForm.isValid()) {
      // Form is not valid.
      return;
    }

    const orderData = this.orderEditorAdd.elForm.getData() as IOrderModel;

    const order: IOrderModel = {
      ...orderData,
      specie: this.props.species.find(s => s.id == (orderData.specie as any))
    };

    const call =
      order.type === "buy" ? this.props.addBuyOrder : this.props.addSellOrder;

      // handled at server sided
    // if (order.type === "buy") {      
    //   const buyOrder = order as IBuyOrderModel;
    //   const stock = this.props.stock.find(
    //     d => d.specie.id === buyOrder.specie.id
    //   );
    //   if (!stock) {
    //     Ui.showErrors(`There aren't any stock for ${buyOrder.specie.name} right now.`);
    //     return;
    //   }

    //   if (stock.quantity < buyOrder.quantity) {
    //     Ui.showErrors(`There aren't enough stock for ${buyOrder.specie.name} to complete this buy order.`);
    //     return;
    //   }
    // }

    const result = await getPromiseFromAction(call(order as any));

    if (!result.hasErrors) {
      this.elModalAdd.hide(); 
    } else {
      Ui.showErrors(...result.errors);
    }
  }

  public render() {
    return (
      <div>
        <Helmet>
          <title>Fish Market</title>
        </Helmet>

        <Loader show={this.props.indicators.operationLoading} />

        <TopActionBar
          onActionButtonClick={this.onClickShowAddModal}
          onSearchChange={this.onChangeSearchInput}
          actionButtonText="New Order"
          searchPlaceholder="Search for fish..."
        />

        <table className="table fish-table">
          <thead>
            <tr>
              <th className="main-column">Name</th>
              <th className="image-column">Photo</th>
              <th className="info-column">Stock (kg)</th>
              <th className="info-column">Latest Price ($)</th>
              <th className="action-column" />
            </tr>
          </thead>
          <tbody>{this.renderRows(this.props.stock)}</tbody>
        </table>

        {/* Add modal */}
        <ModalComponent
          ref={x => (this.elModalAdd = x)}
          buttons={
            <div>
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.onClickAddNewOrder__saveBtn}
              >
                Save
              </button>
            </div>
          }
          title="Add New Order"
        >
          <OrderEditor
            ref={x => (this.orderEditorAdd = x)}
            data={this.state.editingOrder as IOrderModel}
            stocks={this.props.stock}
            species={this.props.species}
          />
        </ModalComponent>

        <PagingBar
          ref={x => (this.pagingBar = x)}
          totalResults={this.props.totalCount}
          limitPerPage={this.state.limitPerPage}
          currentPage={this.state.pageNum}
          onChangePage={this.onChangePage}
        />
      </div>
    );
  }
}

const component = connect((state: ApplicationState) => state.fishMarket, {
  ...FishStore.actionsCreators
})(FishMarketPage as any);

export default (withRouter(component as any) as any) as typeof FishMarketPage;
