import * as React from "react";
import bind from "bind-decorator";
import { Form } from "@Components/shared/Form";
import { Formik } from "formik";
import { IBuyOrderModel } from "@Models/IBuyOrderModel";
import { ISellOrderModel } from "@Models/ISellOrderModel";
import { ISpecieModel } from "@Models/ISpecieModel";
import { IOrderModel } from "@Models/IOrderModel";
import { IStockModel } from "@Models/IStockModel";

export interface IProps {
  data: IOrderModel;
  species: ISpecieModel[];
  stocks: IStockModel[];
}

export default class OrderEditor extends React.Component<IProps, {}> {
  constructor(props) {
    super(props);
  }

  public elForm: Form;

  @bind
  public emptyForm(): void {
    if (this.elForm) {
      this.elForm.emptyForm();
    }
  }

  componentDidMount() {}

  render() {
    return (
      <Formik
        enableReinitialize={true}
        initialValues={
          {
            quantity: this.props.data.quantity,
            price: (this.props.data as ISellOrderModel).price,
            specie: this.props.data.specie,
            type: this.props.data.type
          } as IOrderModel
        }
        onSubmit={(values, { setSubmitting }) => {}}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
          /* and other goodies */
        }) => (
          <Form className="form" ref={x => (this.elForm = x)}>
            <input
              type="hidden"
              name="id"
              defaultValue={(this.props.data.id || 0).toString()}
            />
            <div className="form-group">
              <label className="control-label required" htmlFor="order__type">
                Order Type
              </label>
              <select
                className="form-control"
                id="order__type"
                name={nameof<IOrderModel>(x => x.type)}
                data-value-type="string"
                data-val-required="true"
                data-msg-required="This field is required."
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option defaultChecked key="buy" value="buy">
                  Buy
                </option>
                <option key="sell" value="sell">
                  Sell
                </option>
              </select>
            </div>
            <div className="form-group">
              <label className="control-label required" htmlFor="order__specie">
                Specie
              </label>
              <select
                className="form-control"
                id="order__specie"
                name={nameof<IOrderModel>(x => x.specie)}
                data-value-type="number"
                data-val-required="true"
                data-msg-required="This field is required."
                value={values.specie && values.specie.id}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {this.props.species.map((specie, index) => (
                  <option
                    defaultChecked={index === 0}
                    key={specie.id}
                    value={specie.id}
                  >
                    {specie.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label
                className="control-label required"
                htmlFor="order__quantity"
              >
                Quantity
              </label>
              <input
                type="number"
                className="form-control"
                id="order__quantity"
                name={nameof<IOrderModel>(x => x.quantity)}
                data-value-type="number"
                data-val-required="true"
                data-msg-required="This field is required."
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {values.type === "sell" && (
              <div className="form-group">
                <label
                  className="control-label required"
                  htmlFor="order__price"
                >
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="order__price"
                  name={nameof<ISellOrderModel>(x => x.price)}
                  data-value-type="number"
                  data-val-required="true"
                  data-msg-required="This field is required."
                  value={(values as ISellOrderModel).price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            )}
          </Form>
        )}
      </Formik>
    );
  }
}
