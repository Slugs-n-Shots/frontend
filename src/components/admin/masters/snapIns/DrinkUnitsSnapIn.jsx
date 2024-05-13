import { Fragment } from "react";
import { TextField, SelectField, CurrencyField } from "../DataModal";
import { drinkUnits } from "models/units";
import { useTranslation } from "contexts/TranslationContext.js";
import { Col, Row, Button, Table } from "react-bootstrap";
import config from "models/config";

const DrinkUnitsSnapIn = (props) => {
    const { __ } = useTranslation();
    const formData = props.value;
    const units = props.value
    const objectId = props.objectId
    console.log('units', units)

    const setUnits = (units) => {
        if (props.onFieldChange !== undefined) {
            props.onFieldChange(props.name, units);
        }
    }

    const handleAdd = () => {
        setUnits([...units, {
            id: null,
            drink_id: objectId,
            quantity: 1,
            unit_en: "glass",
            unit_hu: __("glass"),
            unit_price: 1,
        }])
    }

    const handleChange = (event, field, idx, newValue) => {
        const newUnits = [...units];
        newUnits[idx][field] = newValue
        if (field === 'unit') {
            newUnits[idx]['unit_en'] = newValue;
            newUnits[idx]['unit_hu'] = __(newValue, [], 'hu');
        }
        setUnits(newUnits)
    }

    const handleDelete = (unit) => {
        setUnits(units.filter(u =>
            unit.id === u.id &&
            unit.drink_id === u.drink_id &&
            unit.quantity === u.quantity &&
            unit.unit_en === u.unit_en
        ));
    }
    console.log('units before render', units)
    return (
        <>
            <h3>{__('Units')}</h3>
            <Row>
                <Col>
                    <Button onClick={handleAdd} >{__('Add Unit')}</Button>
                </Col>
            </Row>
            <Table size="sm">
                <colgroup>
                    <col style={{ width: "10%" }}></col>
                    <col style={{ width: "25%" }}></col>
                    <col style={{ width: "40%" }}></col>
                    <col style={{ width: "20%" }}></col>
                </colgroup>
                <thead>
                    <tr>
                        <th>{__('Quantity')}</th>
                        <th>{__('Unit')}</th>
                        <th>{__('Unit Price')}</th>
                        <th>{__('Actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {units !== undefined && units.map((e, i) => (
                        <DrinkUnit key={i} idx={i} unit={e} handleChange={handleChange} handleDelete={handleDelete} />
                    ))}
                </tbody>
            </Table >

            <pre>{JSON.stringify(formData, null, 4)}</pre>
        </>
    )
}

const DrinkUnit = ({ idx, unit, handleChange, handleDelete }) => {
    const { __ } = useTranslation();

    return (
        <tr>
            <td>
                <TextField
                    className="text-end"
                    onChange={(event) => handleChange(event, 'quantity', idx, event.target.value)}
                    value={unit.quantity || ""}
                    name={`units-${idx}-quantity`} />
            </td>
            <td style={{ minWidth: "8rem" }}>
                <SelectField
                    options={drinkUnits}
                    onChange={(event) => handleChange(event, 'unit', idx, event.target.value)}
                    value={unit.unit || ""}
                    name={`units-${idx}-unit`} />
            </td>
            <td>
                <CurrencyField
                    className="text-end"
                    onChange={(event) => handleChange(event, 'unit_price', idx, event.target.value)}
                    value={unit.unit_price || ""}
                    name={`units-${idx}-unit_price`}
                    currency={config.currency}
                />
            </td>
            <td>
                <Button onClick={() => handleDelete(unit)}>{__('Delete')}</Button>
            </td>
        </tr>
    )
}

export default DrinkUnitsSnapIn;
