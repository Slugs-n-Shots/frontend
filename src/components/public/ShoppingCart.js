import { Table, Button } from "react-bootstrap";
import { useCart } from "contexts/CartContext";
import "./drinks.css";
import { useTranslation } from "contexts/TranslationContext";
import QuantityEdit from "components/common/QuantityEdit";
import config from "models/config";

export default function ShoppingCart() {
  const { detailedCartItems, removeFromCart, addToCart, calculateCartTotal, makeOrder } = useCart();
  const { __, formatNumber } = useTranslation();
  const cartItems = detailedCartItems();
  console.log('cartItems', cartItems)
  return (
    <div>
      <h1>{__('Shopping Cart')}</h1>
      {cartItems?.length ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>{__('Name')}</th>
                <th>{__('Unit Price')}</th>
                <th>{__('Unit')}</th>
                <th>{__('Qty')}</th>
                <th>{__('Total')}</th>
                <th>{__('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td className="text-end">{index + 1}</td>
                  <td>#{item.id} {item.name}</td>
                  <td className="text-end">{item.unitPrice} {config.currency}</td>
                  <td className="text-end">
                    {formatNumber(item.quantity)} {item.unit}
                  </td>
                  <td>
                    <QuantityEdit style={{ maxWidth: 200 }}
                      min={1}
                      max={25}
                      value={item.orderedQuantity}
                      onChange={(value) =>
                        addToCart(item.id, item.quantity, item.unit, value, "set")
                      }
                    />
                  </td>
                  <td className="text-end">{item.total} {config.currency}</td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        removeFromCart(item.id, item.quantity, item.unit)
                      }
                    >
                      {__('Remove')}
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="text-end fw-medium fs-5">{__('Total')}:</td>
                <td className="text-end fw-medium fs-5">{calculateCartTotal()} {config.currency}</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan="7" className="text-end">
                  <Button className="fs-5"
                    variant="success"
                    onClick={() => makeOrder()}
                  >
                    {__('Order it!')}
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </>

      ) : (<div className="text-center">{(cartItems === undefined ?
        __('Your cart is loading, please wait..') :
        __('Your cart is empty, why don\'t you order something?'))}</div>)}
    </div>
  );
}
