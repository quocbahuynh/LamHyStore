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
      <Container className="py-5">
        {/* Placeholder Title */}
        <div className="text-center mb-4">
          <Placeholder as="h2" animation="wave">
            <Placeholder xs={4} />
          </Placeholder>
        </div>

        {/* Product Grid */}
        <Row className="g-4">
          {[...Array(8)].map((_, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <Placeholder
                  as={Card.Img}
                  variant="top"
                  animation="wave"
                  style={{ height: "200px" }}
                />
                <Card.Body>
                  <Placeholder as={Card.Title} animation="wave">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="wave">
                    <Placeholder xs={7} /> <Placeholder xs={4} />
                  </Placeholder>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
