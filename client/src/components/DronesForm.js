import React, { useState, useEffect } from "react";
import {
  Offcanvas,
  Button,
  Form,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import { createDrone, getMyDrones } from "../http/droneAPI";

const DronesForm = ({ show, handleClose, onDroneCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    serial: "",
    model: "",
  });

  const [zonePoints, setZonePoints] = useState([]);

  useEffect(() => {
    if (zonePoints.length >= 3) {
      setFormData((prev) => ({
        ...prev,
        zone_data: JSON.stringify(zonePoints),
      }));
    }
  }, [zonePoints]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createDrone(formData);
      console.log(formData);
      onDroneCreated();
      handleClose();
    } catch (err) {
      console.error("Ошибка при создании дрона:", err);
    }
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="start"
      backdrop={false}
      className="bg-dark text-white"
      style={{ width: "500px", zIndex: 1050 }}
    >
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title>Добавить дрон</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Название дрона</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Label>Серийный номер</Form.Label>
              <Form.Control
                type="number"
                name="serial"
                value={formData.serial}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>Модель</Form.Label>
              <Form.Control
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={formData.name === "" || formData.serial === "" || formData.model === ""}
          >
            Отправить заявку
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

const Drones = ({ show, handleClose }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [drones, setDrones] = useState([]);

  const fetchDrones = async () => {
    try {
      const data = await getMyDrones();
      setDrones(data);
    } catch (error) {
      console.error("Ошибка при загрузке дронов:", error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchDrones();
    }
  }, [show]);

  const handleOpenRequestForm = () => setShowRequestForm(true);
  const handleCloseRequestForm = () => setShowRequestForm(false);

  return (
    <>
      {/* Основной оффканвас со списком дронов */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        backdrop={false}
        className="bg-dark text-white"
        style={{ width: "500px", zIndex: 1040 }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Мои дроны</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Button variant="primary" className="mb-3" onClick={handleOpenRequestForm}>
            ➕ Добавить дрон
          </Button>

          <ListGroup variant="flush">
            {drones.map((drone) => (
              <ListGroup.Item key={drone.id} className="bg-secondary text-white mb-2 rounded">
                <div><strong>{drone.name}</strong></div>
                <div>Серийный: {drone.serial}</div>
                <div>Модель: {drone.model}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Поверхностный оффканвас для создания дрона */}
      <DronesForm
        show={showRequestForm}
        handleClose={handleCloseRequestForm}
        onDroneCreated={fetchDrones}
      />
    </>
  );
};

export default Drones;
