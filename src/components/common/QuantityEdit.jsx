import { useEffect, useState } from "react";
import "./QuantityEdit.css";
import { Form } from "react-bootstrap";

const QuantityEdit = (props) => {

    const [text, setText] = useState(props?.value ?? '');

    useEffect(() => {
        console.log('ue')
        setText(props?.value ?? '')
    }, [props.value])


    // const changeValue = (value) => {
    //     props?.onChange !== undefined && props.onChange(value);
    //     setText(value)
    //     console.log('changeValue', value)
    // }

    // const editChange = (e) => {
    //     e.preventDefault();
    //     const newValue = e.target.value.replace().replace(/^0+([^0].*)$/, '$1');
    //      if (/^-?\d*$/.test(newValue)) {
    //         if (Number(newValue).toString() === newValue) {
    //             if (props?.max !== undefined && props.max < Number(newValue)) {
    //                 console.log(props.max, '<', Number(newValue))
    //                 return;
    //             }
    //             if (props?.min !== undefined && props.min > Number(newValue)) {
    //                 return;
    //             }
    //         } else {
    //             changeValue(Number(newValue))
    //         }
    //     } else {
    //         setText(newValue)
    //     }
    // }

    const buttonClick = (value) => {

        // setText(prevText => {
        //     let newValue;
        //     if (value > 0 && props?.max !== undefined && props.max <= Number(prevText)) {
        //         newValue = props.max;
        //     } else if (value < 0 && props?.min !== undefined && props.min >= Number(prevText)) {
        //         newValue = props.min;
        //     } else {
        //         newValue = Number(prevText) + value;
        //     }
        // })

        let newValue;
        if (value > 0 && props?.max !== undefined && props.max <= Number(text)) {
            newValue = props.max;
        } else if (value < 0 && props?.min !== undefined && props.min >= Number(text)) {
            newValue = props.min;
        } else {
            newValue = Number(text) + value;
            props?.onChange !== undefined && props.onChange(newValue);
            return newValue;
        }
    }

    return <div>
        <div className="quantity-edit input-group">
            <button className="btn btn-outline-secondary" type="button" onClick={() => buttonClick(-1)}>-1</button>
            <Form.Control type="text" value={text} readOnly pattern="[0-9]*" placeholder="" aria-label="x" />
            <button className="btn btn-outline-secondary" type="button" onClick={() => buttonClick(+1)}>+1</button >
        </div>
    </div>
}

// onInput={editChange
export default QuantityEdit;
