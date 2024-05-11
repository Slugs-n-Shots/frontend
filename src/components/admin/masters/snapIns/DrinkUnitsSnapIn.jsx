import { Fragment, useState } from "react";
import { TextField, SelectField } from "../DataModal";
import { drinkUnits } from "models/units";

const DrinkUnitsSnapIn = (props) => {

    const formData = props.value;
    const units = props.value
    console.log('units', units)

    const handleChange = (event, field, idx, newValue) => {
        // console.log('oldUnits', units)
        const newUnits = [...units];
        newUnits[idx][field] = newValue
        if (props.onFieldChange !== undefined) {
            props.onFieldChange(props.name, newUnits);

        }
        // console.log('handleChange', {newValue, field, idx, oldValue, newValue})
        // console.log('newUnits', newUnits)
    }
    console.log('units before render', units)
    return (
        <>
            <div>DrinkUnitsSnapIn</div>
            {units !== undefined && units.map((e, i) => (
                <Fragment key={i}>
                    <TextField
                        title="#"
                        readOnly
                        onChange={(event) => handleChange(event, 'id', i, event.target.value)}
                        value={e.id || ""}
                        name={`units[${i}].id`} />
                    <TextField
                        title="quantity"

                        onChange={(event) => handleChange(event, 'quantity', i, event.target.value)}
                        value={e.quantity || ""}
                        name={`units[${i}].quantity`} />
                    {e.unit_price}
                    <TextField
                        title="unit_price"

                        onChange={(event) => handleChange(event, 'unit_price', i, event.target.value)}
                        value={e.unit_price || ""}
                        name={`units[${i}].unit_price`} />
                    <SelectField
                        title="unit"
                        options={drinkUnits}
                        onChange={(event) => handleChange(event, 'unit', i, event.target.value)}
                        value={e.unit || ""}
                        name={`units[${i}].unit`} />
                </Fragment>
            ))}
            <pre>{JSON.stringify(formData, null, 4)}</pre>
        </>
    )
}

export default DrinkUnitsSnapIn;
