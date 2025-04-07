"use client";
import Breadcrumb from "@/components/Ecommerce/Breadcrumb";
import apiLinks from "@/utils/api-links";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import moment from "moment";
import ProductListGom from "@/components/Ecommerce/PageGomOrder/ProductListGom";
import { useGomOrderCart } from "@/store/store";
import axios from "axios";
import { FiCheckCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectGomCartTotal } from "@/slices/gomOrderSlice";

interface LiveStreamCart {
  id: string;
  productExternalID: string;
  liveStreamId: string;
}

interface GomOrder {
  id: string;
  name: string;
  slug: string;
  startDate: string; // Consider using Date type if you plan to work with Date objects
  endDate: string; // Consider using Date type if you plan to work with Date objects
  productExternalIds: string[];
}

interface GomOrderComponent {
  gomOrderData: GomOrder;
}

export default function GomOrderMain({ gomOrderData }: GomOrderComponent) {
  const direct = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [gomOrder, setGomOrder] = useState<GomOrder | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const cartItems = useGomOrderCart(); // Get cart items
  const totalPrice = useSelector(selectGomCartTotal);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    deliveryAddress: "",
    paymentMethod: "Chuyển khoản",
    deliveryMethod: "Giao hàng",
  });

  useEffect(() => {
    if (formData.deliveryMethod === "Lấy tại chi nhánh") {
      setFormData((prevState) => ({
        ...prevState,
        deliveryAddress: "LAMHY THỦ DẦU MỘT", // Set default address
      }));
    }
  }, [formData.deliveryMethod]);

  // Format products for the modal
  const formattedProducts = cartItems
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} - ${item.basePrice.toLocaleString()} (x${item.quantity})`,
    )
    .join("\n");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    if (cartItems.length >= 1 && gomOrder) {
      e.preventDefault();
      setCreating(true);

      const orderDetails = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        productCode: item.code,
        price: item.basePrice,
      }));

      const orderPayload = {
        ...formData,
        products: formattedProducts,
        totalPayment: totalPrice,
        orderDetails: orderDetails,
      };

      try {
        await axios.post(
          apiLinks.order.addOrderToSheet + gomOrder.id,
          orderPayload,
        );

        console.log("Order Data:", orderPayload);

        setCreating(false);
        setShowModal(false); // Close the order modal
        setShowThankYouModal(true); // Open thank-you modal

        direct.push("/");
      } catch (error) {
        alert("Có lỗi xảy ra!");
        console.error("Order submission failed:", error);
      }
    }
  };

  useEffect(() => {
    if (!gomOrderData) return;

    const fetchGomOrder = async () => {
      try {
        const data = gomOrderData;
        const formattedStartDate = moment(data.startDate, "YYYY-MM-DD").format(
          "DD-MM-YYYY",
        );
        const formattedEndDate = moment(data.endDate, "YYYY-MM-DD").format(
          "DD-MM-YYYY",
        );
        setGomOrder({
          ...data,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });

        if (data.endDate) {
          const currentDate = moment();
          const orderEndDate = moment(data.endDate, "YYYY-MM-DD");
          console.log(orderEndDate.isBefore(currentDate));
          setIsExpired(orderEndDate.isBefore(currentDate));
        }
      } catch (error) {
        console.error("Error fetching Gom Order:", error);
      }
    };

    fetchGomOrder();
  }, [gomOrderData]);

  if (isExpired) {
    return (
      <>
        <Breadcrumb title={gomOrder?.name} />
        <Container className="d-flex flex-column justify-content-center custom-container">
          <div className="text-center">
            <p className="fs-6 fs-lg-5 fw-semibold text-body-emphasis mb-9 font-primary px-6">
              Nhận đặt hàng từ <b>{gomOrder?.startDate}</b> đến{" "}
              <b>{gomOrder?.endDate}</b>
            </p>
            <h2 className="fs-30px fs-xl-80px fs-lg-60px fw-semibold text-uppercase">
              ĐỢT ORDER ĐÃ KẾT THÚC!
            </h2>
          </div>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <Breadcrumb title={gomOrder?.name} />
        <Container className="d-flex flex-column justify-content-center custom-container pb-6">
          <div className="text-center">
            <p className="fs-6 fs-lg-5 text-body-emphasis mb-9 font-primary px-6">
              Nhận đặt hàng từ <b>{gomOrder?.startDate}</b> đến{" "}
              <b>{gomOrder?.endDate}</b>
            </p>
            <h2 className="fs-30px fs-xl-80px fs-lg-50px fw-semibold text-uppercase">
              {gomOrder?.name}
            </h2>
          </div>
          <div className="widget widget-post mb-6">
            <h4 className="widget-title fs-5 mb-6">Giỏ hàng</h4>
            {gomOrder && (
              <ProductListGom
                idList={gomOrder.productExternalIds}
                type="display"
              />
            )}
          </div>
          <div className="d-grid gap-2 pb-6">
            <Button
              className="btn btn-primary text-uppercase"
              type="button"
              onClick={() => setShowModal(true)}
              disabled={cartItems.length < 1}
            >
              Đặt hàng
            </Button>
          </div>
        </Container>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Thông tin đặt hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cartItems && (
              <>
                <p>Chuyên viên kinh doanh sẽ liên hệ để xác nhận đơn hàng.</p>
                <ProductListGom
                  idList={cartItems.map((c) => c.id)}
                  type="cart"
                />
                <hr />
              </>
            )}
            <Form onSubmit={handleSubmit} className="mt-3">
              <Form.Group className="mb-3 row">
                <div className="col-md-6">
                  <Form.Label>Tên khách hàng</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <Form.Label>Số điện thoại (Có Zalo)</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3 row">
                <div className="col-md-6">
                  <Form.Label>Phương thức thanh toán</Form.Label>
                  <Form.Select
                    name="paymentMethod"
                    onChange={handleChange}
                    required
                  >
                    <option value="Chuyển khoản">Chuyển khoản</option>
                    <option value="Thanh toán khi nhận hàng">
                      Thanh toán khi nhận hàng
                    </option>
                  </Form.Select>
                </div>

                <div className="col-md-6">
                  <Form.Label>Hình thức giao hàng</Form.Label>
                  <Form.Select
                    name="deliveryMethod"
                    onChange={handleChange}
                    required
                  >
                    <option value="Giao hàng">Giao hàng</option>
                    <option value="Lấy tại chi nhánh">Lấy tại chi nhánh</option>
                  </Form.Select>
                </div>
              </Form.Group>
              {formData.deliveryMethod == "Lấy tại chi nhánh" && (
                <Form.Group className="mb-3">
                  <Form.Label>Chọn chi nhánh</Form.Label>
                  <Form.Select
                    name="deliveryAddress"
                    required
                    onChange={handleChange}
                  >
                    <option value="LAMHY THỦ DẦU MỘT">LAMHY THỦ DẦU MỘT</option>
                    <option value="LANHY Phú Lợi">LANHY Phú Lợi</option>
                    <option value="LAMHY Lái Thiêu">LAMHY Lái Thiêu</option>
                  </Form.Select>
                </Form.Group>
              )}
              {formData.deliveryMethod == "Giao hàng" && (
                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ giao hàng</Form.Label>
                  <Form.Control
                    type="text"
                    name="deliveryAddress"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}
              <div className="py-6"></div>
              <Modal.Footer>
                {creating ? (
                  <Button type="button" variant="primary" disabled={true}>
                    Đang xác nhận...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={cartItems.length < 1}
                  >
                    Xác nhận
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showThankYouModal}
          onHide={() => setShowThankYouModal(false)}
          centered
        >
          <Modal.Body className="text-center p-5">
            <FiCheckCircle size={60} className="text-success mb-3" />
            <h4 className="fw-bold text-dark">Đặt hàng thành công!</h4>
            <p className="text-muted">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất có
              thể!
            </p>
            <Button
              variant="success"
              className="px-4 py-2 mt-3"
              onClick={() => setShowThankYouModal(false)}
            >
              Đóng
            </Button>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
