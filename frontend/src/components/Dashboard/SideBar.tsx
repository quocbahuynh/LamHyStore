"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  Accordion,
  Button,
  ListGroup,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { FaHome, FaList } from "react-icons/fa";
import { LuListChecks } from "react-icons/lu";
import { TbLivePhotoFilled } from "react-icons/tb";

export default function SideBar() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="db-sidebar bg-body">
      <Navbar className="navbar navbar-expand-xl navbar-light d-block px-0 header-sticky dashboard-nav py-0">
        <div className="sticky-area border-right">
          <div className="d-flex px-6 px-xl-10 w-100 border-bottom py-7 align-items-center justify-content-between">
            <h5>LAMHY.STORE</h5>
            <Button
              size="sm"
              onClick={handleShow}
              className="d-block d-lg-none"
            >
              <FaList />
            </Button>
            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>LAMHY.STORE</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Accordion
                  defaultActiveKey="0"
                  className="list-group list-group-flush list-group-no-border w-100"
                  alwaysOpen={true}
                >
                  <Accordion.Item
                    eventKey="0"
                    className="list-group-item px-0 py-0 sidebar-item mb-3 border-0"
                  >
                    <Accordion.Header
                      className=" text-heading text-decoration-none lh-1 sidebar-link py-5 px-6 d-flex align-items-center"
                      title="Dashboard"
                    >
                      <span className="sidebar-item-icon w-40px d-inline-block text-white">
                        <FaHome />
                      </span>
                      <span className="sidebar-item-text fs-14px fw-semibold">
                        Thiết kế trang chủ
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ListGroup className="list-unstyled">
                        <ListGroup.Item
                          action
                          className="sidebar-item"
                          href="/admin/dashboard/menu"
                        >
                          Thanh Menu
                        </ListGroup.Item>
                        <Link href="/admin/dashboard/banner">
                          <ListGroup.Item className="sidebar-item">
                            Ảnh Banner
                          </ListGroup.Item>
                        </Link>
                        <Link href="/admin/dashboard/flashsale">
                          <ListGroup.Item className="sidebar-item">
                            Flash Sale
                          </ListGroup.Item>
                        </Link>
                        <Link href="/admin/dashboard/event">
                          <ListGroup.Item className="sidebar-item">
                            Sự kiện Sale
                          </ListGroup.Item>
                        </Link>
                        <Link href="/admin/dashboard/lastest">
                          <ListGroup.Item className="sidebar-item">
                            Sản phẩm mới
                          </ListGroup.Item>
                        </Link>
                        <Link href="/admin/dashboard/bestseller">
                          <ListGroup.Item className="sidebar-item">
                            TOP sản phẩm bán chạy
                          </ListGroup.Item>
                        </Link>
                        <Link href="/admin/dashboard/branding">
                          <ListGroup.Item className="sidebar-item">
                            Thương hiệu
                          </ListGroup.Item>
                        </Link>
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <Accordion
                  defaultActiveKey="1"
                  className="list-group list-group-flush list-group-no-border w-100"
                  alwaysOpen={true}
                >
                  <Accordion.Item
                    eventKey="1"
                    className="list-group-item px-0 py-0 sidebar-item mb-3 border-0"
                  >
                    <Accordion.Header
                      className=" text-heading text-decoration-none lh-1 sidebar-link py-5 px-6 d-flex align-items-center"
                      title="Dashboard"
                    >
                      <span className="sidebar-item-icon w-40px d-inline-block text-white">
                        <LuListChecks />
                      </span>
                      <span className="sidebar-item-text fs-14px fw-semibold">
                        Gom Order
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ListGroup className="list-unstyled">
                        <ListGroup.Item
                          action
                          className="sidebar-item"
                          href="/admin/dashboard/gom-order"
                        >
                          Danh sách Gom Order
                        </ListGroup.Item>
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <Accordion
                  defaultActiveKey="2"
                  className="list-group list-group-flush list-group-no-border w-100"
                  alwaysOpen={true}
                >
                  <Accordion.Item
                    eventKey="2"
                    className="list-group-item px-0 py-0 sidebar-item mb-3 border-0"
                  >
                    <Accordion.Header
                      className=" text-heading text-decoration-none lh-1 sidebar-link py-5 px-6 d-flex align-items-center"
                      title="Dashboard"
                    >
                      <span className="sidebar-item-icon w-40px d-inline-block text-white">
                        <TbLivePhotoFilled />
                      </span>
                      <span className="sidebar-item-text fs-14px fw-semibold">
                        Livestream
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ListGroup className="list-unstyled">
                        <ListGroup.Item
                          action
                          className="sidebar-item"
                          href="/admin/dashboard/livestream"
                        >
                          Danh sách Livestream
                        </ListGroup.Item>
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
          <div className="d-none d-lg-block">
            <div
              className="collapse navbar-collapse bg-body position-relative z-index-5"
              id="primaryMenuSidebar"
            >
              <Accordion
                defaultActiveKey="0"
                className="list-group list-group-flush list-group-no-border w-100"
                alwaysOpen={true}
              >
                <Accordion.Item
                  eventKey="0"
                  className="list-group-item px-0 py-0 sidebar-item mb-3 border-0"
                >
                  <Accordion.Header
                    className=" text-heading text-decoration-none lh-1 sidebar-link py-5 px-6 d-flex align-items-center"
                    title="Dashboard"
                  >
                    <span className="sidebar-item-icon w-40px d-inline-block text-white">
                      <FaHome />
                    </span>
                    <span className="sidebar-item-text fs-14px fw-semibold">
                      Thiết kế trang chủ
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ListGroup className="list-unstyled">
                      <ListGroup.Item
                        action
                        className="sidebar-item"
                        href="/admin/dashboard/menu"
                      >
                        Thanh Menu
                      </ListGroup.Item>
                      <Link href="/admin/dashboard/banner">
                        <ListGroup.Item className="sidebar-item">
                          Ảnh Banner
                        </ListGroup.Item>
                      </Link>
                      <Link href="/admin/dashboard/flashsale">
                        <ListGroup.Item className="sidebar-item">
                          Flash Sale
                        </ListGroup.Item>
                      </Link>
                      <Link href="/admin/dashboard/event">
                        <ListGroup.Item className="sidebar-item">
                          Sự kiện Sale
                        </ListGroup.Item>
                      </Link>
                      <Link href="/admin/dashboard/lastest">
                        <ListGroup.Item className="sidebar-item">
                          Sản phẩm mới
                        </ListGroup.Item>
                      </Link>
                      <Link href="/admin/dashboard/bestseller">
                        <ListGroup.Item className="sidebar-item">
                          TOP sản phẩm bán chạy
                        </ListGroup.Item>
                      </Link>
                      <Link href="/admin/dashboard/branding">
                        <ListGroup.Item className="sidebar-item">
                          Thương hiệu
                        </ListGroup.Item>
                      </Link>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
            <div
              className="collapse navbar-collapse bg-body position-relative z-index-5"
              id="primaryMenuSidebar"
            >
              <Accordion className="list-group list-group-flush list-group-no-border w-100">
                <Accordion.Item
                  eventKey="1"
                  className="list-group-item px-0 py-0 sidebar-item mb-3 border-0"
                >
                  <Accordion.Header
                    className=" text-heading text-decoration-none lh-1 sidebar-link py-5 px-6 d-flex align-items-center"
                    title="Dashboard"
                  >
                    <span className="sidebar-item-icon w-40px d-inline-block text-white">
                      <LuListChecks />
                    </span>
                    <span className="sidebar-item-text fs-14px fw-semibold">
                      Gom Order
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ListGroup className="list-unstyled">
                      <ListGroup.Item
                        action
                        className="sidebar-item"
                        href="/admin/dashboard/gom-order"
                      >
                        Danh sách Gom Order
                      </ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
            <div
              className="collapse navbar-collapse bg-body position-relative z-index-5"
              id="primaryMenuSidebar"
            >
              <Accordion className="list-group list-group-flush list-group-no-border w-100">
                <Accordion.Item
                  eventKey="2"
                  className="list-group-item px-0 py-0 sidebar-item mb-3 border-0"
                >
                  <Accordion.Header
                    className=" text-heading text-decoration-none lh-1 sidebar-link py-5 px-6 d-flex align-items-center"
                    title="Dashboard"
                  >
                    <span className="sidebar-item-icon w-40px d-inline-block text-white">
                      <TbLivePhotoFilled />
                    </span>
                    <span className="sidebar-item-text fs-14px fw-semibold">
                      Livestream
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ListGroup className="list-unstyled">
                      <ListGroup.Item
                        action
                        className="sidebar-item"
                        href="/admin/dashboard/livestream"
                      >
                        Danh sách Livestream
                      </ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
}
