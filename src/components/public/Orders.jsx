import { useApi } from "contexts/ApiContext";
import { useMessages } from "contexts/MessagesContext";
import { useTranslation } from "contexts/TranslationContext";
import { Fragment, useEffect, useState } from "react";
import { Col, Row, Table, Button } from "react-bootstrap";
import "./Orders.css";

const Orders = () => {

  const [loaded, setLoaded] = useState(false);
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const { addMessage } = useMessages();
  const { language, __, formatDateTime } = useTranslation();

  useEffect(() => {
    if (true || !loaded) {
      get('orders/active')
        .then(response => {
          setOrders(response.data)
          setLoaded(true)
        })
        .catch(error => {
          console.warn(error);
          addMessage("danger", error.statusText);
        })
    }
  }, [addMessage, get, loaded, language])
  return (
    <article>
      <h2>{__('Orders')}</h2>
      <Table>
        <thead>
          <tr>
            <th>{__('Ordered at')}</th>
            <th>{__('Status')}</th>
            <th className="text-end">{__('Number of items')}</th>
            <th className="text-end">{__('Total')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, i) =>
            <Fragment key={i}>
              <tr>
                <td>{formatDateTime(item.recorded_at)}</td>
                <td>{item.status}</td>
                <td className="text-end">{item.details.reduce((total, det) => total + det.ordered_quantity, 0)}</td>
                <td className="text-end">{item.details.reduce((total, det) => total + det.ordered_quantity * det.drink_unit.unit_price, 0)} Ft</td>
                <td><Button variant="link"
                  className="order-details-collapse-button"
                  aria-expanded="false"
                  data-bs-toggle="collapse"
                  data-bs-target={"#order-details-" + item.id}
                >
                  {__('Details')}
                </Button ></td>
              </tr>
              <tr key={i + 10000} className="order-details-collapsible collapse" id={"order-details-" + item.id}>
                <td colSpan={4}>
                  <Row>
                    <Col xs="11" className="align-self-end offset-1">
                      <DetTable item={item} />
                    </Col>
                  </Row>
                </td>
              </tr>
            </Fragment>
          )}
        </tbody>
      </Table>
      {/* <pre>{JSON.stringify(orders, null, 4)}</pre> */}
    </article>
  )
}

const DetTable = ({ item }) => {
  const { __ } = useTranslation();
  const subTotal = item.details.reduce((total, det) => total + det.ordered_quantity * det.drink_unit.unit_price, 0);
  return (
    <Table responsive striped bordered>
      <thead>
        <tr>
          <th className="text-center">{__('Quantity')}</th>
          <th>{__('Name')}</th>
          <th className="text-end">{__('Price')}</th>
          <th>{__('Actions')}</th>
        </tr>
      </thead>
      <tbody>
        {item.details.map((det, iDet) => (
          <tr key={iDet}>
            <td className="text-end">{det.ordered_quantity} x {det.drink_unit.quantity} {det.drink_unit.unit}</td>
            <td>{det.drink_unit.drink.name}</td>
            <td className="text-end">{det.ordered_quantity * det.drink_unit.unit_price} Ft</td>
            <td className="text-center"><Button size="sm">{__('Order it again')}</Button></td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td className="text-end fw-semibold" colSpan={2}>{__('Total')}:</td>
          <td className="text-end fw-semibold">{subTotal} Ft</td>
          <td></td>
        </tr>
      </tfoot>
    </Table>
  )
}

export default Orders;