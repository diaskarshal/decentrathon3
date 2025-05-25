import React, { useState, useEffect } from "react";
import {
  Offcanvas,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { createDrone } from "../http/droneAPI";

const DronesForm = ({ show, handleClose, onDroneCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    serial: "",
    model: "",
  });

  const [zonePoints, setZonePoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ success: null, message: "" });

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
    setIsLoading(true);
    setFeedback({ success: null, message: "" });
    console.log("🔧 Отправка формы:", formData);

    try {
      const response = await createDrone(formData);
      console.log("✅ Успешно создан дрон:", response);

      setFeedback({ success: true, message: "Дрон успешно создан!" });
      onDroneCreated(); // обновить список
      setTimeout(() => {
        handleClose();
        setFormData({ name: "", serial: "", model: "" });
        setFeedback({ success: null, message: "" });
      }, 1000);
    } catch (err) {
      console.error("❌ Ошибка при создании дрона:", err);
      setFeedback({
        success: false,
        message: "Ошибка при создании дрона. Проверьте данные и попробуйте снова.",
      });
    } finally {
      setIsLoading(false);
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
        {feedback.message && (
          <Alert variant={feedback.success ? "success" : "danger"}>
            {feedback.message}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Название дрона</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
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
                disabled={isLoading}
              />
            </Col>
            <Col>
              <Form.Label>Модель</Form.Label>
              <Form.Control
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Col>
          </Row>

          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={isLoading || formData.name === "" || formData.serial === "" || formData.model === ""}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Отправка...
              </>
            ) : (
              "Отправить заявку"
            )}
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default DronesForm;
