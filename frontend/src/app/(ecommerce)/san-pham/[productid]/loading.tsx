"use client";
import Breadcrumb from "@/components/Ecommerce/Breadcrumb";
import {
  Row,
  Col,
  Placeholder,
  Button,
  Card,
  Container,
} from "react-bootstrap";
export default function loading() {
  return (
    <>
      <Breadcrumb title={"Sản phẩm..."} />
      <Container>
        <Card className="p-4 mt-9 border-0 w-100">
          <Row className="justify-content-between align-items-center">
            {/* Product Image Placeholder */}
            <Col xs={12} md={6} className="text-center">
              <Placeholder as="div" animation="wave">
                <Placeholder className="w-100" style={{ height: "500px" }} />
              </Placeholder>
            </Col>

            {/* Product Info Placeholder */}
            <Col xs={12} md={6}>
              <Placeholder as="h2" animation="glow">
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={4} /> <Placeholder xs={3} />
              </Placeholder>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={4} /> <Placeholder xs={3} />
              </Placeholder>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={4} /> <Placeholder xs={3} />
              </Placeholder>

              <Placeholder.Button variant="primary" xs={6} />
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}
