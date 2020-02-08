import "@Styles/main.scss";
import * as React from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router";
import { ApplicationState, reducers } from "@Store/index";
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

type Props = RouteComponentProps<{}> &
  typeof FishStore.actionsCreators &
  FishStore.IState;

interface IState {
  searchTerm: string;
  pageNum: number;
  limitPerPage: number;
  rowOffset: number;
}

class FishMarketPage extends React.Component<Props, IState> {
  private pagingBar: PagingBar;

  private elModalAdd: ModalComponent;

  private orderEditorAdd: OrderEditor;

  private debouncedSearch: (term: string) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      searchTerm: "",
      pageNum: 1,
      limitPerPage: 5,
      rowOffset: 0
    };
  }

  componentWillMount() {
    this.props.search("");
  }

  componentWillUnmount() {
    if (this.elModalAdd) {
      this.elModalAdd.hide();
    }
  }

  @bind
  onChangeSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    var val = e.currentTarget.value;
    this.debouncedSearch(val);
    this.pagingBar.setFirstPage();
  }

  @bind
  onClickShowAddModal(e: React.MouseEvent<HTMLButtonElement>) {
    this.elModalAdd.show();
  }

  @bind
  onChangePage(pageNum: number): void {
    let rowOffset = Math.ceil((pageNum - 1) * this.state.limitPerPage);
    this.setState({ pageNum, rowOffset });
  }

  @bind
  renderRows(data: IStockModel[]) {
    return data
      .slice(
        this.state.rowOffset,
        this.state.rowOffset + this.state.limitPerPage
      )
      .map(stock => <StockRow key={stock.id} stock={stock} />);
  }

  @bind
  async onClickAddNewOrder__saveBtn(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
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

    const result = await getPromiseFromAction(call(order as any));

    if (!result.hasErrors) {
      this.pagingBar.setLastPage();
      this.elModalAdd.hide();
    } else {
      alert(result.errors);
    }
  }

  public render() {
    return (
      <div>
        <Helmet>
          <title>Fish Market</title>
        </Helmet>

        <Loader show={this.props.indicators.operationLoading} />

        <div className="panel panel-default">
          <div className="panel-body row">
            <div className="col-sm-2">
              <button
                className="btn btn-primary"
                onClick={this.onClickShowAddModal}
              >
                New Order
              </button>
            </div>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                defaultValue={""}
                onChange={this.onChangeSearchInput}
                placeholder={"Search for fish..."}
              />
            </div>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ textAlign: "center" }}>Photo</th>
              <th
                style={{
                  verticalAlign: "middle",
                  textAlign: "right",
                  width: "160px"
                }}
              >
                Stock (kg)
              </th>

              <th
                style={{
                  verticalAlign: "middle",
                  textAlign: "right",
                  width: "160px"
                }}
              >
                Latest Price ($)
              </th>

              <th />
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
          onHide={() => {
            if (this.orderEditorAdd) {
              this.orderEditorAdd.emptyForm();
            }
          }}
        >
          <OrderEditor
            ref={x => (this.orderEditorAdd = x)}
            data={{} as IOrderModel}
            species={this.props.species}
          />
        </ModalComponent>

        <PagingBar
          ref={x => (this.pagingBar = x)}
          totalResults={this.props.stock.length}
          limitPerPage={this.state.limitPerPage}
          currentPage={this.state.pageNum}
          onChangePage={this.onChangePage}
        />
      </div>
    );
  }
}

const StockRow = ({ stock }: { stock: IStockModel }) => {
  return (
    <tr>
      <td style={{ verticalAlign: "middle" }}>
        <b>{stock.specie.name}</b>
      </td>
      <td style={{ textAlign: "center" }}>
        <img height="100px" src={stock.specie.imageSrc} />
      </td>
      <td
        style={{
          verticalAlign: "middle",
          textAlign: "right",
          width: "100px"
        }}
      >
        {stock.quantity.toLocaleString()}
      </td>

      <td
        style={{
          verticalAlign: "middle",
          textAlign: "right",
          width: "100px"
        }}
      >
        {stock.latestPrice.toLocaleString()}
      </td>
      <td
        style={{
          verticalAlign: "middle",
          textAlign: "right"
        }}
      >
        <button
          className="btn btn-primary"
          onClick={e => this.onClickShowEditModal(e, stock)}
        >
          Buy
        </button>&nbsp;
        <button
          className="btn btn-default"
          onClick={e => this.onClickShowDeleteModal(e, stock)}
        >
          Sell
        </button>
      </td>
    </tr>
  );
};

const component = connect(
  (state: ApplicationState) => state.fishMarket,
  FishStore.actionsCreators
)(FishMarketPage as any);

export default (withRouter(component as any) as any) as typeof FishMarketPage;
