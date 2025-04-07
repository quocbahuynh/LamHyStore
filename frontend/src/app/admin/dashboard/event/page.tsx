"use client";
import ListHeader from "@/components/Dashboard/ListHeader";
import useDataSection from "@/utils/useDataSection";
import { useState } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { ProductList } from "../flashsale/page";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import apiLinks from "@/utils/api-links";
import { FaEdit } from "react-icons/fa";

interface SectionUpdatePayload {
  title: string;
  description: string;
}

export default function page() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { dataSection, refreshData } = useDataSection(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = dataSection
    ? Math.ceil(dataSection.productExternalIds.length / itemsPerPage)
    : 0;

  const { register, handleSubmit, setValue, reset } =
    useForm<SectionUpdatePayload>();

  const onSubmit = async (data: SectionUpdatePayload) => {
    try {
      if (dataSection) {
        const dataForm = {
          title: data.title,
          description: data.description,
          productExternalIds: dataSection.productExternalIds,
        };
        await axios.put(
          apiLinks.admin.sectionUpdated + `/${dataSection.id}`,
          dataForm,
        );
        reset();
        location.reload();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main
      id="content"
      className="bg-body-tertiary-01 d-flex flex-column main-content"
    >
      <div className="dashboard-page-content">
        <div className="row mb-9 align-items-center justify-content-between">
          <div className="col-md-6 mb-8 mb-md-0">
            <h2 className="fs-4 mb-0 d-flex align-self-center gap-4">
              {dataSection && dataSection.title}{" "}
              <FaEdit
                onClick={() => setShowEditModal(true)}
                className="cursor-pointer"
              />
            </h2>
            <p>{dataSection && dataSection.description}</p>
          </div>

          <div className="col-md-6 d-flex flex-wrap justify-content-md-end gap-4">
            <button className="btn btn-outline-primary" onClick={refreshData}>
              {" "}
              <LuRefreshCcw />{" "}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              {" "}
              Thêm mới{" "}
            </button>
          </div>
        </div>
        <div className="card mb-4 rounded-4 p-7">
          <ListHeader />
          <div className="card-body px-0 pt-7 pb-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle table-nowrap mb-0">
                <tbody>
                  {dataSection && (
                    <ProductList
                      showAddModal={showAddModal}
                      setShowAddModal={setShowAddModal}
                      sectionData={dataSection}
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                      productExternalIds={dataSection?.productExternalIds}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {totalPages > 1 && (
          <nav aria-label="Page navigation example" className="mt-6 mb-4">
            <ul className="pagination justify-content-start">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item mx-3 ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {dataSection && (
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="thumbnail">
                <Form.Label>Tiêu đề</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={dataSection.title}
                  {...register("title")}
                />
              </Form.Group>
              <Form.Group controlId="link" className="mt-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  type="text"
                  {...register("description")}
                  defaultValue={dataSection.description}
                />
              </Form.Group>
              <Modal.Footer>
                <Button variant="primary" type="submit">
                  Cập nhật
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </main>
  );
}
