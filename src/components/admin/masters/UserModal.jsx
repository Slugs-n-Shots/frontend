import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function UserModal({ state, setState }) {
  return <>UserModal</>
}
/*
function UserModal({ state, setState }) {
  // user, readOnly, visible, setShow, onSave
  const [formData, setFormData] = useState({ ...state.user });

  // const [dob, setDob] = useState(new Date());
  console.log(state);

  useEffect(() => {
    setFormData(state.user);
    // setDob(state?.user.dob);
  }, [state.user]);

  const handleClose = () => setState({ ...state, visible: false });
  const handleSave = () => {
    if (state?.saveEvent) {
      state?.saveEvent(formData);
    }
    handleClose();
  };

  // pre-checks - if modal's been shown

  if (state?.visible) {
    if (state?.readOnly && !state?.user) console.log("readonly empty user");
  }

  // Handle form input changes
  const handleChange = (event) => {
    console.log("handleChange", formData);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const title = formData.id
    ? `${formData.name || "[névtelen]"} ${
        state?.readOnly ? " megtekintése" : " szerkesztése"
      }`
    : "Új felhasználó";

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
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Név</Form.Label>
              <Form.Control
                type="text"
                {...(state?.readOnly ? { readOnly: true } : {})}
                value={formData.name || ""}
                onChange={handleChange}
                name="name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="text"
                {...(state?.readOnly ? { readOnly: true } : {})}
                value={formData.email || ""}
                onChange={handleChange}
                name="email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicGender">
              <Form.Label>Nem</Form.Label>
              <Form.Check
                type="radio"
                id="gender-unknown"
                label="ismeretlen"
                name="gender"
                value="unknown"
                checked={formData.gender === "unknown"}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                id="gender-male"
                label="férfi"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                id="gender-female"
                label="nő"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDob">
              <Form.Label>Születési dátum</Form.Label>
              <Form.Control
                type="date"
                {...(state?.readOnly ? { readOnly: true } : {})}
                value={formData.dob || ""}
                onChange={handleChange}
                name="dob"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Label>Ország</Form.Label>
              <Form.Control
                type="text"
                {...(state?.readOnly ? { readOnly: true } : {})}
                value={formData.country || ""}
                onChange={handleChange}
                name="country"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCity">
              <Form.Label>Város</Form.Label>
              <Form.Control
                type="text"
                {...(state?.readOnly ? { readOnly: true } : {})}
                value={formData.city || ""}
                onChange={handleChange}
                name="city"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAddress1">
              <Form.Label>Cím 1.</Form.Label>
              <Form.Control
                type="text"
                {...(state?.readOnly ? { readOnly: true } : {})}
                value={formData.address1 || ""}
                onChange={handleChange}
                name="address1"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAddress2">
              <Form.Label>Cím 2.</Form.Label>
              <Form.Control
                type="text"
                {...(state?.readOnly ? { readOnly: true } : {})}
                value={formData.address2 || ""}
                onChange={handleChange}
                name="address2"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPostcode">
              <Form.Label>Irányítószám</Form.Label>
              <Form.Control
                type="text"
                {...(state?.readOnly ? { readOnly: true } : {})}
                value={formData.postcode || ""}
                onChange={handleChange}
                name="postcode"
              />
            </Form.Group>
          </Form>{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Bezár
          </Button>
          {!state?.readOnly && (
            <Button variant="primary" onClick={handleSave}>
              Mentés
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
*/
export default UserModal;
