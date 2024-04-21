// import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
// import Form from "react-bootstrap/Form";

import { useData } from "components/admin/masters/DataTable";
import { useTranslation } from "contexts/TranslationContext.js";
import { capitalize } from "models/MiscHelper.js";
import { useEffect, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";


function DataModal({ state, setState }) {
  const { model, fields, masterData } = useData()
  const { __ } = useTranslation();
  // object, readOnly, visible, setShow, onSave
  const [formData, setFormData] = useState({ ...state.object });

  // const [dob, setDob] = useState(new Date());
  // console.log(state);

  // console.log('masterData', masterData)

  useEffect(() => {
    setFormData(state.object);
    // setDob(state?.object.dob);
  }, [state.object]);

  const handleClose = () => setState({ ...state, visible: false });
  const handleSave = () => {
    if (state?.saveEvent) {
      state?.saveEvent(formData);
    }
    handleClose();
  };

  // pre-checks - if modal's been shown

  if (state?.visible) {
    if (state?.readOnly && !state?.object) console.log("readonly empty object");
  }

  // Handle form input changes 
  const handleChange = (event) => {
    if (!(state?.readOnly ?? false)) {
      const field = event.target.name;
      const value = event.target.type !== "checkbox"? event.target.value: event.target.checked


      console.log("handleChange", 'target:', field, 'value:', value, 'formData:', formData);
      const newFormData = { ...formData, [field]: value };
      console.log("handleChange", 'new:', newFormData);
      setFormData(newFormData);
    }
  };

  const title = __(state?.readOnly ? 'View :model' : (formData.id ? 'Edit :model' : 'New :model'), { model: __(model.name) })
  //  'Edit :model',  __(formData.id
  // //   ? `${formData.name || '[' + __("unnamed") + ']'} ${state?.readOnly ? " megtekintése" : " szerkesztése"
  // //   }`
  // //   : "New :model"), { model_name: 'modelname'});
  // const title = "?";

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
          <Form
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
                  name={e.name} />
              case 'longstring':
                return <LongTextField key={i}
                  title={e.title}
                  readOnly={e.readOnly ?? false}
                  onChange={handleChange}
                  value={formData[e.name] || ""}
                  name={e.name} />
              case 'boolean':
                // console.log('bool', e, formData, formData[e.name])
                return <BooleanField key={i}
                  title={e.title}
                  readOnly={e.readOnly ?? false}
                  onChange={handleChange}
                  value={formData[e.name]}
                  name={e.name} />

              case 'master':
                return <SelectField key={i}
                  title={e.title}
                  readOnly={e.readOnly ?? false}
                  onChange={handleChange}
                  value={formData[e.name] || ""}
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
      >
        {master && Object.entries(master).map(([key, value], i) => <option key={i} value={key}>{value[language]}</option>)}

      </Form.Select>
    </Form.Group>
  )
}

const BooleanField = (props) => {
  const { __ } = useTranslation();
  // console.log('boolean field', props)
  const handleCheckboxChange = (e) => {
    console.log('handleCheckboxChange2', e)
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
    </Form.Group>)
}

const TextField = (props) => {
  const { __ } = useTranslation();

  return (<Form.Group className="mb-3" controlId={"form" + capitalize(props.name)}>
    <Form.Label>{__(props.title)}</Form.Label>
    <Form.Control
      type="text"
      readOnly={props.readOnly ?? false}
      value={props.value}
      onChange={props.onChange}
      name={props.name}
    />
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
  </Form.Group>
  )
}
