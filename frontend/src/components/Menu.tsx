"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  NavDropdown,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { GoPerson } from "react-icons/go";
import apiLinks from "@/utils/api-links";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCartQuantity, selectCartTotal } from "@/slices/cartSlice";
import { useCart } from "@/store/store";
import ProductInCart from "./Ecommerce/PageCart/ProductInCart";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import { MdAnnouncement, MdPayment } from "react-icons/md";
import { useRouter } from "next/navigation";
import { BiCart, BiHome, BiSearch, BiUser } from "react-icons/bi";

interface Section {
  id: string;
  title: string;
  slug: string;
}

interface Page {
  id: string;
  iconUrl: string;
  title: string;
  position: number;
  pageType: string;
  sections: Section[];
}

const ShoppingBag = ({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) => {
  const totalPrice = useSelector(selectCartTotal);
  const formatMoney = useVNDFormatter();
  const cart = useCart();

  return (
    <Offcanvas show={show} onHide={onHide} placement={"end"} name="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="fs-4">Giỏ hàng</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="me-xl-auto pt-0 mb-2 mb-xl-0">
        <form className="table-responsive-md shopping-cart pb-8 pb-lg-10">
          <table className="table table-borderless">
            <thead>
              <tr className="fw-500">
                <td colSpan={3} className="border-bottom pb-6">
                  <MdAnnouncement className="fs-23px me-4 px-2 py-1  " />
                  Giỏ hàng chưa bao gồm phí vận chuyển.
                </td>
              </tr>
            </thead>
            <tbody>
              {cart.map((c, i) => (
                <ProductInCart key={c.id} item={c} />
              ))}
            </tbody>
          </table>
        </form>
      </Offcanvas.Body>
      <div className="offcanvas-footer flex-wrap">
        <div className="d-flex align-items-center justify-content-between w-100 mb-5">
          <span className="text-body-emphasis">Tổng tiền:</span>
          <span className="cart-total fw-bold text-body-emphasis">
            {formatMoney(totalPrice)}
          </span>
        </div>
        <Link
          href="/thanh-toan"
          onClick={onHide}
          className="btn btn-primary w-100 mb-7"
          title="Thanh toán"
        >
          Thanh toán
        </Link>
      </div>
    </Offcanvas>
  );
};

export default function Menu() {
  const router = useRouter();
  const [menus, setMenus] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShoppingBag, setShowShoppingBag] = useState(false);
  const totalQuantity = useSelector(selectCartQuantity);

  const [searchName, setSearchName] = useState("");

  const [expanded, setExpanded] = useState(false); // Track Navbar open/close state

  const closeNavbar = () => setExpanded(false); // Function to close Navbar

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn chặn reload trang
      if (searchName.trim() !== "") {
        router.push(`/tim-kiem?name=${encodeURIComponent(searchName)}&page=0`);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.trim()) {
      router.push(`/tim-kiem?name=${encodeURIComponent(searchName)}&page=0`);
    }
  };

  const handleCategories = (slug: string) => {
    router.push(`/danh-muc/${slug}`);
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(apiLinks.homepage.menu);
        setMenus(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []); // Runs only once on mount

  const items = [
    "Miễn phí vận chuyển cho đơn hàng từ 200K trở lên!",
    "Miễn phí vận chuyển cho đơn hàng từ 200K trở lên!",
    "Miễn phí vận chuyển cho đơn hàng từ 200K trở lên!",
    "Miễn phí vận chuyển cho đơn hàng từ 200K trở lên!",
    "Miễn phí vận chuyển cho đơn hàng từ 200K trở lên!",
    "Miễn phí vận chuyển cho đơn hàng từ 200K trở lên!",
  ];

  if (loading) return <p></p>;
  if (error) return <p>Đã xảy ra lỗi: {error}</p>;

  return (
    <header id="header" className="header header-sticky-smart">
      <div className="topbar bg-primary d-none d-lg-block moving-text">
        <div className="container-wide container py-4">
          <div className="moving-items">
            {items.map((item, index) => (
              <div key={index} className="moving-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-2">
        <Navbar
          expand="lg"
          className="overflow-hidden px-lg-10 py-1 py-lg-3"
          expanded={expanded}
        >
          <Container fluid className="d-none d-lg-flex">
            <Navbar.Brand>
              <Link href={"/"} onClick={closeNavbar}>
                <img
                  src="/assets/images/logo.png"
                  width="130"
                  height="63"
                  alt="Lamhy.Store"
                />
              </Link>
            </Navbar.Brand>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="mr-6"
              onClick={() => setExpanded(!expanded)}
            />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-between"
            >
              <div></div>
              {/* Search Bar - Center */}
              <Form className="f-flex w-50 mx-auto">
                <FormControl
                  style={{ borderRadius: 40 }}
                  type="search"
                  placeholder="Tên sản phẩm..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyDown={handleKeyDown} // Bắt sự kiện Enter
                />
              </Form>

              {/* Icons - Right */}
              <Nav className="d-flex">
                <Nav.Link href="#">
                  <GoPerson size={25} />
                </Nav.Link>
                <Nav.Link
                  className="position-relative text-decoration-none"
                  onClick={() => setShowShoppingBag(true)}
                >
                  <PiShoppingBagOpenLight size={30} />
                  <span className="badge bg-dark text-white position-absolute top-0 start-90 translate-middle mt-5 ms-9 rounded-circle fs-13px square  px-3 py-2">
                    {totalQuantity}
                  </span>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>

          <Container fluid className="d-flex d-lg-none px-6">
            <Navbar.Brand>
              <Link href={"/"} onClick={closeNavbar}>
                <img
                  src="/assets/images/logo.png"
                  width="130"
                  height="63"
                  alt="Lamhy.Store"
                />
              </Link>
            </Navbar.Brand>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="mr-6"
              onClick={() => setExpanded(!expanded)}
            />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto pt-6">
                {menus.map((m, i) => (
                  <NavDropdown
                    title={
                      <span className="text-uppercase fw-bold">{m.title}</span>
                    }
                    id="collapsible-nav-dropdown"
                    key={m.id}
                  >
                    {m.sections.map((s, i) => (
                      <Link
                        href={"/danh-muc/" + s.slug}
                        key={i}
                        passHref
                        legacyBehavior
                      >
                        <a className="dropdown-item" onClick={closeNavbar}>
                          {s.title}
                        </a>
                      </Link>
                    ))}
                  </NavDropdown>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Navbar className="py-3" expanded={expanded}>
          <Container className="d-flex d-lg-none pb-3 gap-6 justify-content-between">
            <Form className="d-flex w-100 mx-auto px-4">
              <FormControl
                type="search"
                placeholder="Tên sản phẩm..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                style={{ borderTopLeftRadius: 26, borderBottomLeftRadius: 26 }}
              />
              <Button
                onClick={handleSearch}
                style={{
                  borderTopRightRadius: 26,
                  borderBottomRightRadius: 26,
                }}
              >
                <FaSearch />
              </Button>
            </Form>
          </Container>
          <Container className="d-none d-lg-flex justify-content-center">
            <Navbar.Collapse>
              <Nav className="mx-auto">
                {menus.map((m) => (
                  <NavDropdown
                    title={
                      <div className="d-flex align-items-center">
                        <img
                          src={m.iconUrl}
                          alt={m.title}
                          style={{ width: 30, height: 30, marginRight: 6 }} // Kích thước icon
                        />
                        <span className="text-uppercase fw-semibold">
                          {m.title}
                        </span>
                      </div>
                    }
                    id="collapsible-nav-dropdown"
                    key={m.id}
                  >
                    {m.sections.map((s, i) => (
                      <Link
                        href={"/danh-muc/" + s.slug}
                        key={i}
                        passHref
                        legacyBehavior
                      >
                        <a className="dropdown-item" onClick={closeNavbar}>
                          {s.title}
                        </a>
                      </Link>
                    ))}
                  </NavDropdown>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <ShoppingBag
        show={showShoppingBag}
        onHide={() => setShowShoppingBag(false)}
      />

      <div className="d-sm-none fixed-bottom bg-white border-top border-1 border-primary d-flex justify-content-around py-5 overflow-hidden text-primary px-8">
        <Link href="/" className="text-primary">
          <div className="text-center flex-grow-1 ">
            <BiHome size={24} />
            <p className="mb-0">Trang chủ</p>
          </div>
        </Link>
        <div
          className="text-center flex-grow-1"
          onClick={() => setShowShoppingBag(true)}
        >
          <BiCart size={24} onClick={() => setShowShoppingBag(true)} />
          <p className="mb-0">Giỏ hàng ({totalQuantity})</p>
        </div>
        <Link href="/thanh-toan" className="text-primary">
          <div className="text-center flex-grow-1">
            <MdPayment size={24} />
            <p className="mb-0">Thanh toán</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
