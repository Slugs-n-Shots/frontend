// import Cards from "../components/basics/Cards";
import { Link } from "react-router-dom";
import "./drinks.css";
import { Accordion, Button, Card } from "react-bootstrap";
import { useTranslation } from "contexts/TranslationContext";
import { useCart } from "contexts/CartContext";
import { useState } from "react";
import { useConfig } from "contexts/ConfigContext";
import config from "models/config";

const KEY_ACCORDION_STATES = 'drAcc';
export default function Drinks() {


  const { __ } = useTranslation();
  const { getMenu } = useCart();
  const menu = getMenu();
  const { getConfig, setConfig } = useConfig();
  const [activeKeys, setActiveKeys] = useState(getConfig(KEY_ACCORDION_STATES, []));

  const updateActiveKeys = (e) => {
    let keys = [];
    if (activeKeys.includes(e)) {
      keys = activeKeys.filter(key => key !== e);
    } else {
      keys = [...activeKeys, e];
    }
    setConfig(KEY_ACCORDION_STATES, keys);
    setActiveKeys(keys);
  }

  const collapseClick = () => {
    setConfig(KEY_ACCORDION_STATES, null)
    setActiveKeys([]);
  }

  return menu === null ? (
    <div>{__("Please wait...")}</div>
  ) : (
    <div className="menu">
      <div className="row">
        <h2 className="col">{__('Drinks')}</h2>
        <div className="col text-end pe-4 pt-2 small">
          <i className="fa-solid fa-minimize" onClick={() => collapseClick()} title={__('Collapse all')}></i>
        </div>
      </div>
      <Accordion className="drinks-accordion"
        id="accordionDrinks"
        defaultActiveKey="0"
        activeKey={activeKeys}
        onSelect={(e) => {
          if (e !== null) {
            updateActiveKeys(e)
          }
        }} >
        {menu instanceof Object &&
          Object.keys(menu).map((category, i) => (
            <DrinkMainCategory key={i} eventKey={i + 1} category={menu[category]} />
          ))
        }

      </Accordion>
    </div>
  );
}

function DrinkMainCategory(props) {
  /*
  state függő osztályok:
  button collapsed (kitörölni, ha kinyitott)
  accordion show (kitörölni, ha összecsukott)
  */
  return (
    <Accordion.Item eventKey={props.eventKey}>
      <Accordion.Header>
        {props.category.name}
      </Accordion.Header>
      <Accordion.Body>
        {props.category.drinks.map((drink, i) => (
          <DrinkCard key={i} drink={drink} />
        ))}

        {Object.keys(props.category.subcategory).map((subCategoryId, i) => (
          <DrinkSubCategory
            key={i}
            subCategory={props.category.subcategory[subCategoryId]}
          />
        ))}

      </Accordion.Body>
    </Accordion.Item>
  );
}

function DrinkSubCategory(props) {
  return (
    <>
      <h4>{props.subCategory.name}</h4>
      {props.subCategory.drinks.map((drink, i) => (
        <DrinkCard key={i} drink={drink} />
      ))}
    </>
  );
}

function DrinkCard(props) {
  const { name, units } = props.drink;
  const { addToCart } = useCart();
  const { __, formatNumber } = useTranslation();

  const handleAddToCart = (unit) => {
    addToCart(props.drink.id, unit.quantity, unit.unit_en, 1, "add"); // Mindig csak 1 ital kerül a kosárba
  };

  return (
    <>
      <Card className="mb-2" >
        <Card.Body>
          <Card.Title>
            <Link className="nav-link" to={`/drink/${props.drink.id}`}>
              {name}
            </Link>

          </Card.Title>
          {units.map((unit, index) => (<div key={index}>
            <div className="row gx-1">
              <div className="col-2 nowrap">{formatNumber(unit.quantity)} {unit.unit}</div>
              <div className="col-3 text-end nowrap">{formatNumber(unit.unit_price)} {config.currency}</div>
              <div className="col-7 text-end nowrap"><Button size="xs"
                variant="light"
                onClick={() => handleAddToCart(unit)}
                className="m-1"
              >
                +1
              </Button>
                <Button size="xs"
                  variant="link"
                  onClick={() => handleAddToCart(unit)}
                  className="m-1"
                >
                  {__('Add many')}
                </Button></div>
            </div>
          </div>
          ))}
        </Card.Body>
      </Card>
    </>
  );
}
