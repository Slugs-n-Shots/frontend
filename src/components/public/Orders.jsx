import { useApi } from "contexts/ApiContext";
import { useMessages } from "contexts/MessagesContext";
import { useTranslation } from "contexts/TranslationContext";
import { Fragment, useEffect, useState } from "react";
import { Col, Row, Table, Button } from "react-bootstrap";
import config from "models/config";
import "./Orders.css";

const Orders = () => {

  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const { addMessage } = useMessages();
  const { language, __, formatDateTime } = useTranslation();

  useEffect(() => {
    const controller = new AbortController();
    get('orders/active', { signal: controller.signal })
      .then(response => {
        setOrders(response.data)
      })
      .catch(error => {
        if (error.code !== 'ERR_CANCELED') {
          console.warn(error);
          addMessage("danger", error.statusText);
        }
      })
    return () => controller.abort();
  }, [addMessage, get, language])
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
                <td className="text-end">{item.details.reduce((total, det) => total + det.ordered_quantity * det.drink_unit.unit_price, 0)} {config.currency}</td>
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
            <td className="text-end">{det.ordered_quantity * det.drink_unit.unit_price} {config.currency}</td>
            <td className="text-center"><Button size="sm">{__('Order it again')}</Button></td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td className="text-end fw-semibold" colSpan={2}>{__('Total')}:</td>
          <td className="text-end fw-semibold">{subTotal} {config.currency}</td>
          <td></td>
        </tr>
      </tfoot>
    </Table>
  )
}

export default Orders;
