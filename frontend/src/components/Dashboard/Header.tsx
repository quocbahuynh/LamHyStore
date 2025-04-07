"use client";
import { logout } from "@/slices/adminAuthSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";

export default function Header() {
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  return (
    <header className="main-header bg-body position-relative d-none d-xl-block px-10 py-6">
      <div className="container-fluid">
        <nav className="navbar navbar-light py-0 row no-gutters px-3 px-lg-0">
          <div className="col-md-4 px-0 px-md-6 order-1 order-md-0"></div>
          <div className="col-md-6 d-flex flex-wrap justify-content-md-end align-items-center order-0 order-md-1">
            <Button size="sm" onClick={handleShow}>
              Đăng xuất
            </Button>
          </div>
        </nav>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn đăng xuất không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
}
