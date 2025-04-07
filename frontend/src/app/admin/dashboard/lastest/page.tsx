"use client";
import ListHeader from "@/components/Dashboard/ListHeader";
import useDataSection from "@/utils/useDataSection";
import { useState } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { ProductList } from "../flashsale/page";

export default function page() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { dataSection, refreshData } = useDataSection(2);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = dataSection
    ? Math.ceil(dataSection.productExternalIds.length / itemsPerPage)
    : 0;

  return (
    <main
      id="content"
      className="bg-body-tertiary-01 d-flex flex-column main-content"
    >
      <div className="dashboard-page-content">
        <div className="row mb-9 align-items-center justify-content-between">
          <div className="col-md-6 mb-8 mb-md-0">
            <h2 className="fs-4 mb-0">{dataSection && dataSection.title}</h2>
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
    </main>
  );
}
