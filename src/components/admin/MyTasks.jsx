import { useApi } from "contexts/ApiContext";
import { useMessages } from "contexts/MessagesContext";
import { useTranslation } from "contexts/TranslationContext";
import config from "models/config";
import { Fragment, useEffect, useState } from "react";
import { Col, Row, Table, Button } from "react-bootstrap";

const MyTasks = () => {

  const [loaded, setLoaded] = useState(false);
  const { get, post } = useApi();
  const [orders, setOrders] = useState([]);
  const { addMessage } = useMessages();
  const { language, __, formatDateTime, formatAgo } = useTranslation();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // Update the elapsed times periodically
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  function timeSince(totalSeconds) {

    let seconds = totalSeconds

    const days = Math.floor(seconds / 86400);
    seconds -= days * 86400;

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    let parts = [];
    if (days === 1) {
      parts.push(__(':day day', { day: days }));
    } else if (days > 1) {
      parts.push(__(':days days', { days }));
    }

    if (hours === 1) {
      parts.push(__(':hour hour', { hour: hours }));
    } else if (hours > 1) {
      parts.push(__(':hours hours', { hours }));
    }

    if (minutes === 1) {
      parts.push(__(':minute minute', { minute: minutes }));
    } else if (minutes > 1) {
      parts.push(__(':minutes minutes', { minutes }));
    }

    // if (seconds === 1) {
    //   parts.push(__(':second second', { second: seconds }));
    // } else if (seconds > 1) {
    //   parts.push(__(':seconds seconds', { seconds }));
    // }

    if (totalSeconds < 60) {
      parts = [__('less than 1 minute')];
    }

    return formatAgo(':time ago', { time: parts.join(', ') });
  }

  const colorizeRow = (secs) => {
    const thresholds = {
      300: 'success', // 5 perc
      600: 'info',    // 10 perc
      720: 'warning', // 12 perc
      1000000: 'danger',
    }

    const ret = Object.entries(thresholds).filter(([limit, color]) => Number(secs) < Number(limit));
    // console.log('colorize', secs, ret)
    return ret[0][1];
  }

  useEffect(() => {
    if (true || !loaded) {
      get('orders/my-tasks')
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

  const markAsDone = (id) => {
    post('orders/done/' + Number(id))
      .then(response => {
        addMessage("success", "Order marked as done.", {}, { timeOut: 2000 });
        setLoaded(false)
      })
      .catch(error => {
        console.warn(error);
        addMessage("danger", error.statusText);
      })
  }

  const undoAssignOrder = (id) => {
    post('orders/undo-assign/' + Number(id))
      .then(response => {
        addMessage("success", "Order assignment reverted", {}, { timeOut: 2000 });
        setLoaded(false)
      })
      .catch(error => {
        console.warn(error);
        addMessage("danger", error.statusText);
      })
  }


  return (
    <article>
      <h2>{__('My Open Tasks')}</h2>
      <Table>
        <thead>
          <tr>
            <th>{__('Ordered at')}</th>
            <th>{__('Status')}</th>
            <th>{__('Guest')}</th>
            <th className="text-end">{__('Items in the order')}</th>
            <th className="text-end">{__('Total')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, i) => {
            const secs = Math.floor((currentTime - new Date(item.recorded_at)) / 1000);
            const color = colorizeRow(secs);
            return (
              <Fragment key={i}>
                <tr className={"table-" + color}>
                  <td title={formatDateTime(item.recorded_at)}> {timeSince(secs)}</td>
                  <td>{item.status}</td>
                  <td>{item.guest.name}</td>
                  <td className="text-end">{item.details.reduce((total, det) => total + det.ordered_quantity, 0)}</td>
                  <td className="text-end">{item.details.reduce((total, det) => total + det.ordered_quantity * det.drink_unit.unit_price, 0)} {config.currency}</td>
                  <td className="text-nowrap">
                  <Button size="sm" variant="danger" className="me-sm-2" onClick={() => undoAssignOrder(item.id)}>{__('Undo assignment')}</Button>
                  <Button size="sm" variant="success" onClick={() => markAsDone(item.id)}>{__('Mark as done')}</Button>
                    <Button variant="link"
                      className="waiting-order-details-collapse-button"
                      aria-expanded="false"
                      data-bs-toggle="collapse"
                      data-bs-target={"#waiting-order-details-" + item.id}
                    >
                      {__('Details')}
                    </Button >
                  </td>
                </tr>
                <tr key={i + 10000} className="waiting-order-details-collapsible collapse" id={"waiting-order-details-" + item.id}>
                  <td colSpan={4}>
                    <Row>
                      <Col xs="11" className="align-self-end offset-1">
                        <DetTable item={item} />
                      </Col>
                    </Row>
                  </td>
                </tr>
              </Fragment>)
          }
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
        </tr>
      </thead>
      <tbody>
        {item.details.map((det, iDet) => (
          <tr key={iDet}>
            <td className="text-end">{det.ordered_quantity} x {det.drink_unit.quantity} {det.drink_unit.unit}</td>
            <td>{det.drink_unit.drink.name}</td>
            <td className="text-end">{det.ordered_quantity * det.drink_unit.unit_price} {config.currency}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td className="text-end fw-semibold" colSpan={2}>{__('Total')}:</td>
          <td className="text-end fw-semibold">{subTotal} {config.currency}</td>
        </tr>
      </tfoot>
    </Table>
  )
}

export default MyTasks;