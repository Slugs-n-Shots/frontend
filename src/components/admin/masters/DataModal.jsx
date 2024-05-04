import { useData } from "components/admin/masters/DataTable";
import { useTranslation } from "contexts/TranslationContext";
import { capitalize } from "models/MiscHelper";
import { useEffect, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";


function DataModal({ state }) {
  const { model, fields, error, events } = useData()
  const [formValid, setFormValid] = useState(false);
  const { __ } = useTranslation();
  // object, readOnly, visible, setShow, onSave
  const [formData, setFormData] = useState({ ...state.object });
  useEffect(() => {
    setFormData(state.object);
    setFormValid(false)
  }, [state.object]);

  const handleClose = () => events.close(formData);
  const handleSave = async () => {
    if (state?.saveEvent) {
      const result = await state?.saveEvent(formData)
      setFormValid(false)
      if (result) {
        setFormValid(true)
        handleClose();
      }
    }
  };

  // pre-checks - if modal's been shown

  if (state?.visible) {
    if (state?.readOnly && !state?.object) console.log("readonly empty object");
  }

  // Handle form input changes
  const handleChange = (event) => {
    if (!(state?.readOnly ?? false)) {
      const field = event.target.name;
      const value = event.target.type !== "checkbox" ? event.target.value : event.target.checked
      const newFormData = { ...formData, [field]: value };
      setFormData(newFormData);
    }
  };

  const title = __(state?.readOnly ? 'View :model' : (formData.id ? 'Edit :model' : 'New :model'), { model: __(model.name) })

  const fieldErrors = ((e) => {
    // console.log(error)
    const ret = {};

    if (error && Object.keys(error)) {
      ret['message'] = error?.statusText ?? "";
      ret['fields'] = error?.response?.data?.errors ?? {};
    }
    return ret;
  })();

  // console.log('fieldErrors', fieldErrors);

  return (
    <>
      <Modal
        show={+state?.visible}
        // show="true"
        onHide={handleClose}
        backdrop="static"
      //keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {JSON.stringify(fieldErrors)} */}
          <Form

            valid={formValid? "valid": "invalid"}
            onSubmit={() => {
              console.log("submit!");
            }}
          >{fields.filter(e => e.displayIn.includes('form')).map((e, i) => {
            switch (e.dataType) {
              case 'number':
              case 'string':
                return <TextField key={i}
                  title={e.title}
                  readOnly={e.readOnly ?? false}
                  onChange={handleChange}
                  value={formData[e.name] || ""}
                  valid={!(fieldErrors?.fields?.[e.name] ?? []).length}
                  messages={fieldErrors?.fields?.[e.name] ?? []}
                  name={e.name} />
              case 'longstring':
                return <LongTextField key={i}
                  title={e.title}
                  readOnly={e.readOnly ?? false}
                  onChange={handleChange}
                  value={formData[e.name] || ""}
                  valid={!(fieldErrors?.fields?.[e.name] ?? []).length}
                  messages={fieldErrors?.fields?.[e.name] ?? []}
                  name={e.name} />
              case 'boolean':
                return <BooleanField key={i}
                  title={e.title}
                  readOnly={e.readOnly ?? false}
                  onChange={handleChange}
                  value={formData[e.name]}
                  valid={!(fieldErrors?.fields?.[e.name] ?? []).length}
                  messages={fieldErrors?.fields?.[e.name] ?? []}
                  name={e.name} />
              case 'master':
                return <SelectField key={i}
                  title={e.title}
                  readOnly={e.readOnly ?? false}
                  onChange={handleChange}
                  value={formData[e.name] || ""}
                  valid={!(fieldErrors?.fields?.[e.name] ?? []).length}
                  messages={fieldErrors?.fields?.[e.name] ?? []}
                  name={e.name} />

              default:
                return <></>

            }
          }
          )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {__('Close')}
          </Button>
          {!state?.readOnly && (
            <Button variant="primary" onClick={handleSave}>
              {__('Save')}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DataModal;

const SelectField = (props) => {
  const { fields, masterData } = useData()
  const { __, language } = useTranslation();

  const field = fields.filter(e => e.name === props.name)[0] ?? undefined;
  const master = masterData[field.dataModel] ?? undefined;

  if (master === undefined) {
    console.warn(props.name, field)
  }

  return (
    <Form.Group className="mb-3" controlId={"form" + capitalize(props.name)}>
      <Form.Label>{__(props.title)}</Form.Label>
      <Form.Select
        type="text"
        readOnly={props.readOnly ?? false}
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        validated={false}
        >
        {master && Object.entries(master).map(([key, value], i) => <option key={i} value={key}>{value[language]}</option>)}
      </Form.Select>
      <Form.Control.Feedback role="alert" type={props.valid ? "valid" : "invalid"}>
      {props.messages.map((msg, i) => <div key={i}>*{msg}</div>)}
    </Form.Control.Feedback>
    </Form.Group>
  )
}

const BooleanField = (props) => {
  const { __ } = useTranslation();
  // console.log('boolean field', props)
  const handleCheckboxChange = (e) => {
    props.onChange(e)
  };
  // value={props.value}
  return (
    <Form.Group className="mb-3" controlId={"form" + capitalize(props.name)}>
      <Form.Label>{__(props.title)}</Form.Label>
      <Form.Check
        type="checkbox"
        disabled={props.readOnly ?? false}
        label={__(props.title)}
        onChange={handleCheckboxChange}
        name={props.name}
        checked={props.value === true}
      />
      <Form.Control.Feedback role="alert" type={props.valid ? "valid" : "invalid"}>
        {props.messages.map((msg, i) => <div key={i}>*{msg}</div>)}
      </Form.Control.Feedback>
    </Form.Group>)
}

const TextField = (props) => {
  const { __ } = useTranslation();

  return (<Form.Group className="mb-3" controlId={"form" + capitalize(props.name)}>
    <Form.Label>{__(props.title)}</Form.Label>
    {/* <div>{JSON.stringify({messages: props.messages, valid: props?.valid ?? "?"})}</div> */}
    <Form.Control
      type="text"
      readOnly={props.readOnly ?? false}
      value={props.value}
      onChange={props.onChange}
      name={props.name}
      validated={false}
    />
    <Form.Control.Feedback role="alert" type={props.valid ? "valid" : "invalid"}>
      {props.messages.map((msg, i) => <div key={i}>*{msg}</div>)}
    </Form.Control.Feedback>
  </Form.Group>
  )
}

const LongTextField = (props) => {
  const { __ } = useTranslation();

  return (<Form.Group className="mb-3" controlId={"form" + capitalize(props.name)}>
    <Form.Label>{__(props.title)}</Form.Label>
    <Form.Control
      as="textarea"

      rows={3}
      value={props.value}
      onChange={props.onChange}
      name={props.name}
    />
    <Form.Control.Feedback role="alert" type={props.valid ? "valid" : "invalid"}>
      {props.messages.map((msg, i) => <div key={i}>*{msg}</div>)}

    </Form.Control.Feedback>
  </Form.Group>
  )
}

