import { createContext, useContext, useEffect, useState } from "react";
import { useConfig } from "./ConfigContext";
import { useApi } from "./ApiContext";
import { useMessages } from "./MessagesContext";
import { useTranslation } from "./TranslationContext";

const CartContext = createContext();

const CART_KEY = "cart";

export const CartProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [drinkList, setDrinkList] = useState([]);
  const { get, post } = useApi();
  const { realm } = useConfig();
  const { addMessage } = useMessages();
  const { __ } = useTranslation();
  const { getConfig, setConfig } = useConfig();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (realm !== null) {
      setCartItems(getConfig(CART_KEY));
    }
  }, [getConfig, realm]);

  const loadDrinks = async () => {
    if (!loaded && realm) {
      try {
        const response = await get("menu-tree");
        const drinks = response.data;
        const drinkList = updateDrinkList(drinks);
        setMenu(drinks);
        setDrinkList(drinkList);
        setLoaded(true);
      } catch (error) {
        addMessage("danger", error.statusText);
        console.warn(error);
      }
    }
  };

  const makeOrder = async () => {
    try {
      const cart = Object.keys(cartItems).map((key, idx) => { return { ...(parseKey(key)), ordered_quantity: cartItems[key] } });
      if (post === get) { }
      post('/orders', { cart })
      console.log(cart);
      // empty cart
      setConfig(CART_KEY, null);
      setCartItems([]);
    } catch (error) {
      console.warn('makeOrder', error)
    }
  }

  const updateDrinkList = (drinks) => {
    const drinkList = {};
    Object.keys(drinks ?? {}).forEach((key) => {
      // főkategóriák
      const outCat = drinks[key];
      Object.keys(outCat.drinks ?? {}).forEach((key) => {
        // főkategóris italok
        const drink = outCat.drinks[key];
        drinkList[drink.id] = drink;
      });
      Object.keys(outCat.subcategory ?? {}).forEach((key2) => {
        // alkategóriák
        const inCat = outCat.subcategory[key2];
        Object.keys(inCat.drinks ?? {}).forEach((key) => {
          // főkategóris italok
          const drink = inCat.drinks[key];
          drinkList[drink.id] = drink;
        });
      });
    });
    return drinkList;
  };

  const getMenu = () => {
    loadDrinks();
    return menu;
  };

  const getDrinkList = () => {
    loadDrinks();
    return drinkList;
  };

  const removeFromCart = (drink_id, quantity, unit) => {
    quantity = Number(quantity);
    const key = `${drink_id}|${quantity}|${unit ?? ""}`;
    const newCartItems = { ...cartItems };
    delete newCartItems[key];
    setCartItems(newCartItems);
    setConfig(CART_KEY, newCartItems);
  };

  const addToCart = (drink_id, quantity, unit, quantityToAdd, mode = "add") => {
    const cartItemsCopy = typeof cartItems === 'object' && cartItems !== null ? { ...cartItems } : {};
    quantity = Number(quantity);
    console.log("addToCart", { drink_id, quantity, unit, quantityToAdd, mode });
    const key = `${drink_id}|${quantity}|${unit ?? ""}`;
    const currentQuantity = cartItemsCopy[key] || 0;
    let newQuantity = quantityToAdd;
    if (mode === "add") {
      newQuantity += currentQuantity;
    }

    if (newQuantity < 0) {
      newQuantity = 0;
    }

    cartItemsCopy[key] = newQuantity;

    if (cartItemsCopy[key] <= 0) {
      delete cartItemsCopy[key];
    }

    setCartItems(cartItemsCopy);
    setConfig(CART_KEY, cartItemsCopy);

    const drink = drinkList[drink_id];
    if (drink) {
      const parsedQuantity = parseFloat(quantity);
      const selectedUnit = drink.units.find(
        (u) => parseFloat(u.quantity) === parsedQuantity && u.unit_code === unit
      );
      if (selectedUnit) {
        if (mode === "add" && quantityToAdd > 0) {
          addMessage("success", "Added :drink to cart", { drink: drink.name }, { timeOut: 2000 });
        }
        if (mode === "add" && quantityToAdd < 0) {
          addMessage("success", "Removed :drink from cart", { drink: drink.name }, { timeOut: 2000 });
        }
      } else {
        addMessage(
          "warning",
          `Selected unit not found for drink_id: :drink_id, quantity: :quantity, unit: :unit`, { drink_id, quantity, unit }
        );
      }
    } else {
      addMessage("warning", 'Drink not found');
    }
  };

  const detailedCartItems = () => {
    const drinkList = getDrinkList();
    if (typeof cartItems === 'object' && cartItems !== null) {
      const ret = Object.entries(cartItems)
        .map(([key, orderedQuantity]) => {
          const { drink_id, quantity, unit } = parseKey(key);
          const drink = drinkList[drink_id];
          if (drink) {
            const selectedUnit = drink.units.find(
              (u) => parseFloat(u.quantity) === quantity && u.unit_code === unit
            );
            if (selectedUnit) {
              const unitPrice = Number(selectedUnit.unit_price);
              return {
                id: drink_id,
                name: drink.name || `Drink #${drink_id}`,
                quantity,
                unit,
                unitPrice,
                orderedQuantity: Number(orderedQuantity),
                key,
                total: orderedQuantity * unitPrice,
              };
            } else {
              return null;
            }
          } else {
            return null;
          }
        })
        .filter((item) => item !== null);
      console.log("details", ret);
      return ret;
    }
    // ha nincs benne tétel üres tömb, ha még nincs inicializálva a bevásárlókocsi: undefined.
    return (typeof drinkList === 'object' && drinkList !== null) ? [] : undefined;
  };

  const calculateCartTotal = () => {
    let grandTotal = 0;
    Object.entries(cartItems).forEach(([key, value]) => {
      const { drink_id, quantity, unit } = parseKey(key);
      const drink = drinkList[drink_id];
      // console.log(drink, key);
      let unitPrice = NaN;
      if (drink) {
        const selectedUnit = drink.units.find(
          (u) => parseFloat(u.quantity) === quantity && u.unit === unit
        );
        if (selectedUnit) {
          unitPrice = selectedUnit.unit_price;
        }
      }

      // console.log("cartItem", key, value, "*", drink, "total:", grandTotal);
      grandTotal += Number(value) * Number(unitPrice);
    });

    return grandTotal;
  };

  const drinkCount = () => {
    console.log('drinkCount', cartItems, (typeof cartItems === 'object' && cartItems !== null))

    return (typeof cartItems === 'object' && cartItems !== null) ? Object.entries(cartItems).reduce((total, [k, v]) => total + v, 0) : 0;
  }

  return (
    <CartContext.Provider
      value={{
        getMenu,
        cartItems,
        detailedCartItems,
        calculateCartTotal,
        addToCart,
        removeFromCart,
        getDrinkList,
        makeOrder,
        drinkCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const parseKey = (key) => {
  const [keyId, keyQuantity, keyUnit] = key.split("|");
  const drink_id = Number(keyId);
  const quantity = Number(keyQuantity);
  const unit = keyUnit === "" ? null : keyUnit;
  return { drink_id, quantity, unit };
};

export const useCart = () => useContext(CartContext);
