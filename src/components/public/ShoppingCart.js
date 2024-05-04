import { Table, Button } from "react-bootstrap";
import { useCart } from "contexts/CartContext";
import CounterInput from "react-bootstrap-counter";
import "./drinks.css";
import { useTranslation } from "contexts/TranslationContext";

export default function ShoppingCart() {
  const { detailedCartItems, removeFromCart, addToCart, calculateCartTotal, makeOrder } = useCart();
  const { __, formatNumber } = useTranslation();
  const cartItems = detailedCartItems();
  console.log('cartItems', cartItems)
  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length ? (
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
                  <td className="text-end">{item.unitPrice} Ft</td>
                  <td className="text-end">
                    {formatNumber(item.quantity)} {item.unit ?? __('glass')}
                  </td>
                  <td>
                    <div className="counter-input-wrapper">
                      <CounterInput
                        max={99}
                        value={item.orderedQuantity}
                        onChange={(value) =>
                          addToCart(item.id, item.quantity, item.unit, value, "set")
                        }
                      />
                    </div>
                  </td>
                  <td className="text-end">{item.total} Ft</td>
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
            </tbody>
          </Table>
          <p>
            {__('Total Price')}: {calculateCartTotal()}
          </p>
          <Button
            variant="secondary"
          onClick={() => makeOrder()}
          >
            Order for ___ Ft !
          </Button>
        </>

      ) : (<div>{__('Your cart is empty, why don\'t you order something?')}</div>)}
    </div>
  );
}
