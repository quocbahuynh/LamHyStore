"use client";
import Breadcrumb from "@/components/Ecommerce/Breadcrumb";
import PreviewProduct from "@/components/Ecommerce/PageCheckout/PreviewProduct";
import { selectCartTotal, updateProductInfo } from "@/slices/cartSlice";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Modal,
  Nav,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MdDoubleArrow } from "react-icons/md";
import { IoStorefront } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { IoMdRadioButtonOn } from "react-icons/io";
import { IoMdRadioButtonOff } from "react-icons/io";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import axios from "axios";
import apiLinks from "@/utils/api-links";
import { useCart } from "@/store/store";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

type CheckoutInputs = {
  fullName: string | null;
  contactNumber: string | null;
  deliveryAddress: string | null;
  pickupAddress: string | null;
  address: string | null;
  province: string | null;
  district: string | null;
  commune: string | null;
  description: string | null;
  paymentMethod: string | null;
  costDelivery: number | null;
  totalPayment: number | null;
};

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [feeShipping, setFeeShippping] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "VNBANK" | "VNPAYQR"
  >("COD");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [branches, setBranches] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CheckoutInputs | null>(null);
  const [onCalDelivery, setOnCalDelivery] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const totalPrice = useSelector(selectCartTotal);
  const cart = useCart();
  const router = useRouter();
  const formatMoney = useVNDFormatter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CheckoutInputs>({
    defaultValues: {
      fullName: null,
      contactNumber: null,
      deliveryAddress: null,
      pickupAddress: null,
      province: null,
      district: null,
      commune: null,
      description: null,
      paymentMethod: null,
      costDelivery: null,
      address: null,
    },
  });

  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");
  const selectedCommune = watch("commune");

  useEffect(() => {
    fetch("/api/province")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  useEffect(() => {
    if (deliveryMethod == "pickup") {
      fetch("/api/branches")
        .then((res) => res.json())
        .then((data) => {
          let branchesData = data.data;
          let branchesActive = branchesData.filter(
            (b: any) => b.branchName !== "Kho",
          );
          setValue("costDelivery", 0);
          setValue("address", null);
          setValue("commune", null);
          setValue("province", null);
          setValue("district", null);
          setFeeShippping(0);
          setBranches(branchesActive);
        })
        .catch((error) => console.error("Error fetching branches:", error));
    }
  }, [deliveryMethod]);

  useEffect(() => {
    setValue("district", null);
    setValue("commune", null);
    setDistricts([]);
    setCommunes([]);

    if (selectedProvince) {
      const { id } = JSON.parse(selectedProvince);
      fetch(`/api/district?idProvince=${id}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectedProvince, setValue]);

  useEffect(() => {
    setValue("commune", null);
    setCommunes([]);

    if (selectedDistrict) {
      const { id } = JSON.parse(selectedDistrict);
      fetch(`/api/commune/?idDistrict=${id}`)
        .then((res) => res.json())
        .then((data) => setCommunes(data))
        .catch((error) => console.error("Error fetching communes:", error));
    }
  }, [selectedDistrict, setValue]);

  useEffect(() => {
    setValue("costDelivery", null);
    const calculateShipping = async () => {
      if (deliveryMethod == "pickup") {
        setValue("costDelivery", 0);
      }

      if (
        selectedProvince &&
        selectedDistrict &&
        selectedCommune &&
        deliveryMethod == "delivery"
      ) {
        setOnCalDelivery(true);
        const province = JSON.parse(selectedProvince);
        const district = JSON.parse(selectedDistrict);
        try {
          const queryParams = new URLSearchParams({
            province: province.name,
            district: district.name,
            pick_province: "Bình Dương",
            pick_district: "Thủ Dầu Một",
            pick_ward: "Phú Hoà",
            pick_street: "Phú Lợi",
            weight: "1000",
            deliver_option: "none",
          }).toString();

          const response = await fetch(`/api/delivery?${queryParams}`);
          if (!response.ok) {
            throw new Error(`Error fetching shipping fee: ${response.status}`);
          }

          const result = await response.json();
          if (result.success) {
            setFeeShippping(result.fee.fee);
            setValue("costDelivery", result.fee.fee);
          } else {
            console.error("Error in response:", result);
          }
        } catch (error) {
          console.error("Error calculating shipping fee:", error);
        }
      }
      setOnCalDelivery(false);
    };

    calculateShipping();
  }, [selectedProvince, selectedDistrict, selectedCommune, deliveryMethod]);

  const validateStep = (currentStep: number) => {
    let nextStep = currentStep;
    const values = getValues();

    // Determine the final address based on the delivery method
    const finalAddress =
      deliveryMethod === "delivery"
        ? values.deliveryAddress
        : values.pickupAddress;
    // Reset previous errors
    clearErrors();

    if (currentStep === 1) {
      if (!values.fullName) {
        setError("fullName", {
          type: "manual",
          message: "Vui lòng nhập họ và tên.",
        });
      }
      if (!values.contactNumber) {
        setError("contactNumber", {
          type: "manual",
          message: "Vui lòng nhập số điện thoại.",
        });
      }
      if (values.fullName && values.contactNumber) {
        nextStep = 2;
      }
    }

    if (currentStep === 2) {
      if (deliveryMethod === "delivery") {
        // Validate delivery address fields
        if (!values.deliveryAddress) {
          setError("deliveryAddress", {
            type: "manual",
            message: "Vui lòng nhập địa chỉ.",
          });
        }
        if (!values.province) {
          setError("province", {
            type: "manual",
            message: "Vui lòng chọn tỉnh/thành phố.",
          });
        }
        if (!values.district) {
          setError("district", {
            type: "manual",
            message: "Vui lòng chọn quận/huyện.",
          });
        }
        if (!values.commune) {
          setError("commune", {
            type: "manual",
            message: "Vui lòng chọn phường/xã.",
          });
        }
        if (!values.costDelivery) {
          setError("costDelivery", {
            type: "manual",
            message: "Vui lòng chọn phí vận chuyển.",
          });
        }

        if (
          values.deliveryAddress &&
          values.province &&
          values.district &&
          values.commune &&
          values.costDelivery
        ) {
          nextStep = 3;
        }
      } else if (deliveryMethod === "pickup") {
        // Validate pickup address field
        if (!values.pickupAddress) {
          setError("pickupAddress", {
            type: "manual",
            message: "Vui lòng chọn chi nhánh cửa hàng.",
          });
        } else {
          nextStep = 3;
        }
      }
    }

    if (currentStep === 3) {
      if (!values.paymentMethod) {
        setError("paymentMethod", {
          type: "manual",
          message: "Vui lòng chọn phương thức thanh toán.",
        });
      } else {
        nextStep = currentStep;
      }
    }

    setValue("address", finalAddress);
    setStep(nextStep);
  };

  const displayPaymentMethod = (code: string) => {
    if (code == "COD") return "Thanh toán khi nhận hàng";
    if (code == "BANK") return "Thẻ ngân hàng";
    if (code == "QR") return "Quét mã QR";
  };

  const onSubmit: SubmitHandler<CheckoutInputs> = async (data) => {
    const total = totalPrice + feeShipping;

    const orderDetails = cart.map((item) => ({
      productId: item.id, // Use the product code from the cart
      quantity: item.quantity, // Use the quantity from the cart
      productCode: item.code,
      price: item.basePrice, // Calculate price as basePrice * quantity
    }));

    const processedData = {
      ...data,
      totalPayment: total,
      paymentMethod: paymentMethod,
      description: "",
      province: data.province ? JSON.parse(data.province).name : null,
      district: data.district ? JSON.parse(data.district).name : null,
      commune: data.commune ? JSON.parse(data.commune).name : null,
      orderDetails: orderDetails,
    };

    setFormData(processedData);
    setShowModal(true);
  };

  const handleConfirmCheckout = async () => {
    try {
      const res = await axios.post(apiLinks.order.createOrderVNPAY, formData);
      if (paymentMethod !== "COD") {
        window.location.href = res.data;
      } else {
        setShowModal(false);
        setShowCompleted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOKCOD = () => {
    setShowCompleted(false);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <>
      <Breadcrumb title="Thanh toán" />
      <section className="container-xl pb-14 pb-lg-19">
        <div className="text-center">
          <h2 className="mb-6">THANH TOÁN</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="pt-12">
          <div className="row">
            <div className="col-lg-4 pb-lg-0 pb-14 order-lg-last">
              <PreviewProduct deliveryFee={feeShipping} />
            </div>
            <div className="col-lg-8 order-lg-first">
              {step == 1 && (
                <div className="checkout">
                  <h4 className="fs-4 pt-4 mb-7">1. Điền thông tin liên hệ</h4>
                  <div className="mb-7">
                    <div className="row">
                      <div className="col-6 mb-md-0 mb-7">
                        <label className="mb-5 fs-13px letter-spacing-01 fw-semibold text-uppercase">
                          Tên của bạn
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Điền tên của bạn..."
                          {...register("fullName", {
                            required: "Tên không được để trống",
                          })}
                        />
                        {errors.fullName && (
                          <p className="text-danger">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div className="col-6 mb-md-0 mb-7">
                        <label className="mb-5 fs-13px letter-spacing-01 fw-semibold text-uppercase">
                          Số điện thoại
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Điền số điện thoại..."
                          {...register("contactNumber", {
                            required: "Số điện thoại không được để trống",
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Số điện thoại không hợp lệ",
                            },
                          })}
                        />
                        {errors.contactNumber && (
                          <p className="text-danger">
                            {errors.contactNumber.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end justify-content-center">
                    <button
                      type="button"
                      onClick={() => validateStep(1)}
                      className="btn btn-dark btn-hover-bg-primary btn-hover-border-primary px-11 mt-md-7 mt-4"
                    >
                      Bước 2: Phương thức nhận hàng <MdDoubleArrow />
                    </button>
                  </div>
                </div>
              )}
              {step == 2 && (
                <div className="checkout">
                  <h4 className="fs-4 pt-4 mb-7">
                    2. Chọn phương thức nhận hàng
                  </h4>
                  <div className="mb-7">
                    <div className="row">
                      <Tab.Container
                        id="left-tabs-example"
                        defaultActiveKey={"delivery"}
                        activeKey={deliveryMethod}
                        onSelect={(k: any) => setDeliveryMethod(k)}
                      >
                        <Nav variant="pills" className="flex-row">
                          <Nav.Item className="nav-item">
                            <Nav.Link
                              eventKey="delivery"
                              className="btn btn-payment px-12 mx-2 py-6 me-7 my-3 nav-link"
                            >
                              <TbTruckDelivery size={23} />
                              <span className="ms-4 fw-semibold fs-6">
                                Nhận hàng tại địa chỉ
                              </span>
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey="pickup"
                              className="btn btn-payment px-12 mx-2 py-6 me-7 my-3 nav-link"
                            >
                              <IoStorefront size={23} />
                              <span className="ms-4 fw-semibold fs-6">
                                Nhận hàng tại cửa hàng
                              </span>
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>
                        <Tab.Content>
                          <Tab.Pane eventKey="delivery">
                            <div className="mb-7 pt-5">
                              <div className="row">
                                <div className="col-md-4 mb-md-0 mb-7">
                                  <label
                                    htmlFor="city"
                                    className="mb-5 fs-13px letter-spacing-01 fw-semibold text-uppercase"
                                  >
                                    Tỉnh/Thành phố
                                  </label>
                                  <select
                                    className="dropdown form-select dropdown-toggle "
                                    {...register("province", {
                                      required:
                                        deliveryMethod === "delivery"
                                          ? "Vui lòng chọn tỉnh/thành phố"
                                          : false,
                                    })}
                                  >
                                    <option value="" disabled>
                                      Chọn Tỉnh/Thành Phố
                                    </option>
                                    {provinces.map((p) => (
                                      <option
                                        key={p.idProvince}
                                        value={JSON.stringify({
                                          id: p.idProvince,
                                          name: p.name,
                                        })}
                                      >
                                        {p.name}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.province && (
                                    <p className="text-danger">
                                      {errors.province.message}
                                    </p>
                                  )}
                                </div>
                                <div className="col-md-4 mb-md-0 mb-7">
                                  <label className="mb-5 fs-13px letter-spacing-01 fw-semibold text-uppercase">
                                    Quận/Huyện
                                  </label>
                                  <select
                                    required
                                    className="dropdown form-select dropdown-toggle"
                                    {...register("district", {
                                      required:
                                        deliveryMethod === "delivery"
                                          ? "Vui lòng chọn quận/huyện"
                                          : false,
                                    })}
                                    disabled={!selectedProvince}
                                  >
                                    <option value="" disabled>
                                      Chọn Quận/Huyện
                                    </option>
                                    {districts.map((d) => (
                                      <option
                                        key={d.idDistrict}
                                        value={JSON.stringify({
                                          id: d.idDistrict,
                                          name: d.name,
                                        })}
                                      >
                                        {d.name}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.district && (
                                    <p className="text-danger">
                                      {errors.district.message}
                                    </p>
                                  )}
                                </div>
                                <div className="col-md-4">
                                  <label
                                    htmlFor="zip"
                                    className="mb-5 fs-13px letter-spacing-01 fw-semibold text-uppercase"
                                  >
                                    Xã/Phường
                                  </label>
                                  <select
                                    required
                                    className="dropdown form-select dropdown-toggle"
                                    {...register("commune", {
                                      required:
                                        deliveryMethod === "delivery"
                                          ? "Vui lòng chọn xã/phường"
                                          : false,
                                    })}
                                    disabled={!selectedDistrict}
                                  >
                                    <option value="" disabled>
                                      Chọn Xã/Phường
                                    </option>
                                    {communes.map((c) => (
                                      <option
                                        key={c.idCommune}
                                        value={JSON.stringify({
                                          id: c.idCommune,
                                          name: c.name,
                                        })}
                                      >
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.commune && (
                                    <p className="text-danger">
                                      {errors.commune.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="mb-7">
                              <div className="row">
                                <div className="col-md-12 mb-md-0 mb-7">
                                  <label
                                    htmlFor="street-address"
                                    className="mb-5 fs-13px letter-spacing-01 fw-semibold text-uppercase"
                                  >
                                    Địa chỉ cụ thể
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Điền địa chỉ..."
                                    {...register("deliveryAddress", {
                                      required:
                                        deliveryMethod === "delivery"
                                          ? "Địa chỉ không được để trống"
                                          : false,
                                    })}
                                  />
                                  {errors.address && (
                                    <p className="text-danger">
                                      {errors.address.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Tab.Pane>
                          <Tab.Pane eventKey="pickup">
                            <div className="mb-7 pt-5">
                              <div className="row">
                                <div className="col-md-12 mb-md-0 mb-7">
                                  <label
                                    htmlFor="city"
                                    className="mb-5 fs-13px letter-spacing-01 fw-semibold text-uppercase"
                                  >
                                    Chọn chi nhánh cửa hàng
                                  </label>
                                  <select
                                    className="dropdown form-select dropdown-toggle "
                                    {...register("pickupAddress", {
                                      required:
                                        deliveryMethod === "pickup"
                                          ? "Vui lòng chọn chi nhánh cửa hàng"
                                          : false,
                                    })}
                                  >
                                    <option value="" disabled>
                                      Chọn chi nhánh cửa hàng
                                    </option>
                                    {branches.map((p) => (
                                      <option key={p.id} value={p.branchName}>
                                        {p.branchName} ({p.address})
                                      </option>
                                    ))}
                                  </select>
                                  {errors.address && (
                                    <p className="text-danger">
                                      {errors.address.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Tab.Pane>
                        </Tab.Content>
                      </Tab.Container>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-sm-row  justify-content-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-dark btn-hover-bg-primary btn-hover-border-primary mt-md-7 mt-4"
                    >
                      Quay lại
                    </button>
                    <button
                      type="button"
                      onClick={() => validateStep(2)}
                      className="btn btn-dark btn-hover-bg-primary btn-hover-border-primary px-11 mt-md-7 mt-4"
                    >
                      Bước 3: phương thức thanh toán <MdDoubleArrow />
                    </button>
                  </div>
                </div>
              )}

              {step == 3 && (
                <div className="checkout">
                  <h4 className="fs-4 pt-4 mb-7">
                    3. Chọn phương thức thanh toán
                  </h4>
                  <div className="mb-7">
                    <div className="row">
                      <Tab.Container
                        defaultActiveKey={"COD"}
                        activeKey={paymentMethod}
                        onSelect={(k: any) => setPaymentMethod(k)}
                      >
                        <Row>
                          <Col sm={5}>
                            <Nav
                              variant="pills"
                              className="flex-column justify-content-start"
                            >
                              <Nav.Item className="nav-item">
                                <Nav.Link
                                  eventKey="COD"
                                  className="btn btn-payment mx-2 py-6 me-7 my-3 nav-link d-flex justify-content-start align-items-center"
                                >
                                  {paymentMethod == "COD" ? (
                                    <IoMdRadioButtonOn size={23} />
                                  ) : (
                                    <IoMdRadioButtonOff size={23} />
                                  )}
                                  <span className="ms-6 fw-semibold fs-6">
                                    Thanh toán khi nhận hàng
                                  </span>
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link
                                  eventKey="VNBANK"
                                  className="btn btn-payment mx-2 py-6 me-7 my-3 nav-link d-flex justify-content-start align-items-center"
                                >
                                  {paymentMethod == "VNBANK" ? (
                                    <IoMdRadioButtonOn size={23} />
                                  ) : (
                                    <IoMdRadioButtonOff size={23} />
                                  )}
                                  <span className="ms-6 fw-semibold fs-6">
                                    Thẻ ngân hàng
                                  </span>
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link
                                  eventKey="VNPAYQR"
                                  className="btn btn-payment mx-2 py-6 me-7 my-3 nav-link d-flex justify-content-start align-items-center"
                                >
                                  {paymentMethod == "VNPAYQR" ? (
                                    <IoMdRadioButtonOn size={23} />
                                  ) : (
                                    <IoMdRadioButtonOff size={23} />
                                  )}
                                  <span className="ms-6 fw-semibold fs-6">
                                    Quét mã QR
                                  </span>
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </Col>
                          <Col sm={7}>
                            <Tab.Content>
                              <Tab.Pane eventKey="COD">
                                <div className="mb-7 pt-5">
                                  <div className="row fs-14px">
                                    <h5 className="fw-bold">
                                      Hướng dẫn thanh toán khi nhận hàng
                                    </h5>
                                    <p>
                                      1. Chọn phương thức thanh toán{" "}
                                      <strong>
                                        Thanh toán khi nhận hàng (COD)
                                      </strong>
                                      .
                                    </p>
                                    <p>
                                      2. Nhập đầy đủ thông tin giao hàng và xác
                                      nhận đơn hàng.
                                    </p>
                                    <p>
                                      3. Nhân viên giao hàng sẽ liên hệ với bạn
                                      khi giao hàng.
                                    </p>
                                    <p>
                                      4. Thanh toán bằng tiền mặt khi nhận hàng.
                                    </p>
                                    <p>
                                      Lưu ý: Vui lòng chuẩn bị đúng số tiền cần
                                      thanh toán để thuận tiện hơn khi nhận
                                      hàng.
                                    </p>
                                  </div>
                                </div>
                              </Tab.Pane>
                              <Tab.Pane eventKey="VNBANK">
                                <div className="mb-7 pt-5">
                                  <div className="row fs-14px">
                                    <h5 className="fw-bold">
                                      Hướng dẫn thanh toán bằng thẻ ngân hàng
                                    </h5>
                                    <p>
                                      1. Chọn phương thức thanh toán{" "}
                                      <strong>Thẻ ngân hàng</strong>.
                                    </p>
                                    <p>
                                      2. Nhập thông tin thẻ ngân hàng của bạn,
                                      bao gồm số thẻ, tên chủ thẻ, ngày hết hạn
                                      và mã CVV.
                                    </p>
                                    <p>
                                      3. Xác nhận giao dịch qua mã OTP được gửi
                                      đến điện thoại của bạn.
                                    </p>
                                    <p>
                                      4. Sau khi thanh toán thành công, bạn sẽ
                                      nhận được xác nhận đơn hàng qua email.
                                    </p>
                                    <p>
                                      Lưu ý: Hệ thống hỗ trợ thanh toán qua thẻ
                                      ATM nội địa (có Internet Banking) và thẻ
                                      tín dụng/ghi nợ quốc tế.
                                    </p>
                                  </div>
                                </div>
                              </Tab.Pane>
                              <Tab.Pane eventKey="VNPAYQR">
                                <div className="mb-7 pt-5">
                                  <div className="row fs-14px">
                                    <h5 className="fw-bold">
                                      Hướng dẫn thanh toán bằng mã QR
                                    </h5>
                                    <p>
                                      1. Chọn phương thức thanh toán{" "}
                                      <strong>Quét mã QR</strong>.
                                    </p>
                                    <p>
                                      2. Sau khi đặt hàng, một mã QR sẽ xuất
                                      hiện trên màn hình.
                                    </p>
                                    <p>
                                      3. Mở ứng dụng ngân hàng hoặc ví điện tử
                                      có hỗ trợ quét mã QR.
                                    </p>
                                    <p>4. Quét mã QR và xác nhận thanh toán.</p>
                                    <p>
                                      5. Sau khi thanh toán thành công, bạn sẽ
                                      nhận được thông báo xác nhận đơn hàng.
                                    </p>
                                    <p>
                                      Lưu ý: Hãy đảm bảo số tiền thanh toán khớp
                                      với tổng giá trị đơn hàng trước khi xác
                                      nhận giao dịch.
                                    </p>
                                  </div>
                                </div>
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-dark btn-hover-bg-primary btn-hover-border-primary mt-md-7 mt-4"
                      onClick={() => setStep(2)}
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      className="btn btn-dark btn-hover-bg-primary btn-hover-border-primary px-11 mt-md-7 mt-4"
                    >
                      Thanh toán đơn hàng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* React Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              background: "#f8f9fa",
            }}
          >
            {/* 🏷️ Customer Info */}
            <h5
              style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}
            >
              Thông tin khách hàng
            </h5>
            <p>
              <strong>Họ và tên:</strong> {getValues().fullName || "Chưa nhập"}
            </p>
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {getValues().contactNumber || "Chưa nhập"}
            </p>

            {/* 🚚 Delivery/Pickup Info */}
            <h5
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
                marginTop: "10px",
              }}
            >
              Thông tin nhận hàng
            </h5>
            {deliveryMethod === "delivery" ? (
              <>
                <p>
                  <strong>Hình thức:</strong> Giao hàng tận nơi
                </p>
                <p>
                  <strong>Địa chỉ giao hàng:</strong>{" "}
                  {getValues().deliveryAddress || "Chưa nhập"}
                </p>
                <p>
                  <strong>Tỉnh/Thành phố:</strong>{" "}
                  {JSON.parse(getValues().province ?? "{}").name || "Chưa chọn"}
                </p>
                <p>
                  <strong>Quận/Huyện:</strong>{" "}
                  {JSON.parse(getValues().district ?? "{}").name || "Chưa chọn"}
                </p>
                <p>
                  <strong>Phường/Xã:</strong>{" "}
                  {JSON.parse(getValues().commune ?? "{}").name || "Chưa chọn"}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Hình thức:</strong> Nhận tại cửa hàng
                </p>
                <p>
                  <strong>Chi nhánh nhận hàng:</strong>{" "}
                  {getValues().pickupAddress || "Chưa chọn"}
                </p>
              </>
            )}

            {/* 💰 Payment & Notes */}
            <h5
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
                marginTop: "10px",
              }}
            >
              Thanh toán
            </h5>
            <p>
              <strong>Phương thức thanh toán:</strong>{" "}
              {displayPaymentMethod(paymentMethod) || "Chưa chọn"}
            </p>
            <p>
              <strong>Tạm tính:</strong>{" "}
              {formatMoney(totalPrice) || "Chưa chọn"}
            </p>
            {deliveryMethod === "delivery" && (
              <p>
                <strong>Phí vận chuyển:</strong>{" "}
                {getValues().costDelivery
                  ? `${formatMoney(getValues().costDelivery)}`
                  : "Chưa chọn"}
              </p>
            )}

            <p className="fw-bold text-primary">
              <strong>Tổng tiền:</strong>{" "}
              {formatMoney(totalPrice + feeShipping) || "Chưa chọn"}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button className="bg-primary" onClick={handleConfirmCheckout}>
            Xác nhận & Thanh toán
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={onCalDelivery} centered backdrop="static">
        <Modal.Body className=" d-flex justify-content-center align-items-center flex-column">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            className="mt-4"
          >
            <span className="visually-hidden">Đang tính phí vận chuyển...</span>
          </Spinner>
          <p className="mt-3">Đang tính phí vận chuyển...</p>
        </Modal.Body>
      </Modal>

      <Modal
        show={showCompleted}
        onHide={() => setShowCompleted(false)}
        centered
      >
        <Modal.Body className="text-center p-4 py-4">
          <FaCheckCircle size={60} className="text-success mb-3" />
          <h4 className="mb-2">LamHy.Store cảm ơn nhooo!</h4>
          <p>Tư vấn viên sẽ gọi điện để xác nhận đơn hàng á.</p>
          <Button variant="success" onClick={handleOKCOD}>
            Ok
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
