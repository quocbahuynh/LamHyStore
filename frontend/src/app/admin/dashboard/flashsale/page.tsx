"use client";
import ListHeader from "@/components/Dashboard/ListHeader";
import { Product } from "@/models/Product";
import { Section } from "@/models/Section";
import apiLinks from "@/utils/api-links";
import useDataSection from "@/utils/useDataSection";
import useProducts from "@/utils/useProducts";
import useTruncatedText from "@/utils/useTruncatedText";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { GoSearch } from "react-icons/go";
import { RiDeleteBin6Line, RiDropdownList } from "react-icons/ri";
import { LuRefreshCcw } from "react-icons/lu";

interface ProductComponent {
  sectionData: Section;
  onDelete: (id: string, sectionData: Section) => void;
  onAdd: (idList: string[], sectionData: Section) => void;
  onUpdate: (id: string, newPos: number, sectionData: Section) => void;
  position: number;
  product: Product;
}

export const ProductItem = ({
  product,
  onDelete,
  sectionData,
  onUpdate,
  position,
}: ProductComponent) => {
  const [showUpdatePositionModal, setShowUpdatePositionModal] = useState(false);
  const [newPos, setNewPos] = useState<string>("");
  const truncatedName = useTruncatedText(product.FullName, 30);
  const formatMoney = useVNDFormatter();
  const photoProduct = !product?.Images
    ? "https://lamhystore.b-cdn.net/z6351502534051_9cfb96caff7c3cad774ed5b78e86f904.jpg"
    : product.Images[0];

  return (
    <tr>
      <td>{position}</td>
      <td>
        <div className="d-flex align-items-center flex-nowrap">
          <Link
            target="_blank"
            href={`/san-pham/${product.Id}`}
            title={product.FullName}
          >
            <img
              src={photoProduct}
              alt={product.FullName}
              className="lazy-image"
              width={60}
              height={80}
            />
          </Link>
          <Link
            target="_blank"
            href={`/san-pham/${product.Id}`}
            title={product.FullName}
            className="ms-6"
          >
            <p className="fw-semibold text-body-emphasis mb-0">
              {truncatedName}
            </p>
          </Link>
        </div>
      </td>
      <td>{formatMoney(product.BasePrice)}</td>
      <td className="text-center">
        <div className="d-flex flex-nowrap justify-content-center">
          <button
            className="btn btn-primary py-4 px-5 btn-xs fs-13px me-4"
            onClick={() => setShowUpdatePositionModal(true)}
          >
            <RiDropdownList size={18} />
          </button>
          <button
            onClick={() => onDelete(product.Id, sectionData)}
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
          >
            {" "}
            <RiDeleteBin6Line size={18} />
          </button>
        </div>
      </td>
      <Modal
        size="lg"
        show={showUpdatePositionModal}
        onHide={() => setShowUpdatePositionModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật vị trí mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Nhập vị trí mới"
              value={newPos}
              onChange={(e) => setNewPos(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            size="lg"
            onClick={() =>
              onUpdate(`${product.Id}`, Number(newPos), sectionData)
            }
          >
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </tr>
  );
};

interface ProductListComponent {
  sectionData: Section;
  productExternalIds: string[];
  currentPage: number;
  itemsPerPage: number;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export const ProductList = ({
  sectionData,
  productExternalIds,
  currentPage,
  itemsPerPage,
  showAddModal,
  setShowAddModal,
}: ProductListComponent) => {
  const [searchQuery, setSearchQuery] = useState("");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [productsSearch, setProductsSearch] = useState([]);
  const [searching, setSearching] = useState(false);
  const [productCart, setProductCart] = useState<any[]>([]);
  const { products, removeProduct, addProduct, updatePosition } =
    useProducts(productExternalIds);

  const handleSearch = async () => {
    setSearching(true);
    if (!searchQuery.trim()) {
      alert("Vui lòng nhập tên sản phẩm.");
      return;
    }

    try {
      const response = await axios.get(
        `${apiLinks.product.search}/${encodeURIComponent(
          searchQuery,
        )}?pageSize=180&currentItem=0`,
      );
      const result = await response.data;
      setProductsSearch(result.data);
      setSearching(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChooseProductCart = async (product: any) => {
    setProductCart((prevCart) => {
      const isProductExists = prevCart.some((item) => item.id === product.id);
      if (!isProductExists) {
        return [product, ...prevCart];
      }
      return prevCart;
    });
  };

  const handleRemoveProductCart = async (id: string) => {
    const updatedCart = [...productCart].filter((p) => p.id !== id);
    setProductCart(updatedCart);
  };

  const handleSubMitCart = async () => {
    let idList: string[] = [];
    [...productCart].map((p) => idList.push(`${p.id}`));
    await addProduct(idList, sectionData);
    setShowAddModal(false);
    location.reload();
  };

  return (
    <>
      {products.slice(startIndex, endIndex).map((p, i) => (
        <ProductItem
          key={i}
          product={p}
          onDelete={removeProduct}
          sectionData={sectionData}
          onAdd={addProduct}
          onUpdate={updatePosition}
          position={i}
        />
      ))}

      <Modal
        size="xl"
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row" style={{ height: "60vh" }}>
            <div className="col-6">
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Tên sản phẩm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <GoSearch size={30} />
                </Button>
              </InputGroup>

              {searching ? (
                <div className="text-center mt-6">
                  <div className="spinner-border" role="status"></div>
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: "380px",
                    overflowY: "auto",
                    marginTop: "10px",
                  }}
                >
                  <table className="table table-hover align-middle table-nowrap mb-0">
                    <tbody>
                      {productsSearch.map((p, i) => (
                        <ProductSearchItem
                          key={i}
                          product={p}
                          onChoose={handleChooseProductCart}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="col-6">
              <div
                style={{
                  maxHeight: "420px",
                  overflowY: "auto",
                  marginTop: "10px",
                }}
              >
                <table className="table table-hover align-middle table-nowrap mb-0">
                  <tbody>
                    {productCart.map((p, i) => (
                      <ProductCartItem
                        key={i}
                        product={p}
                        onRemove={handleRemoveProductCart}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="lg" onClick={handleSubMitCart}>
            Hoàn thành
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

interface ProductCartItemCompoenent {
  product: any;
  onRemove: (id: string) => void;
}

export const ProductCartItem = ({
  product,
  onRemove,
}: ProductCartItemCompoenent) => {
  // Convert all keys in product to lowercase
  const normalizedProduct = Object.keys(product).reduce(
    (acc, key) => {
      acc[key.toLowerCase()] = product[key];
      return acc;
    },
    {} as Record<string, any>,
  );

  const truncatedName = useTruncatedText(normalizedProduct.fullname, 40);
  const formatMoney = useVNDFormatter();
  const photoProduct = !normalizedProduct?.images
    ? "https://product.hstatic.net/200000868185/product/mat_na_bun_tra_xanh_3d7d367026694ac8b6bb604abf64ae61_large.jpg"
    : normalizedProduct.images[0];

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center flex-nowrap">
          <Link
            target="_blank"
            href={`/san-pham/${normalizedProduct.id}`}
            title={normalizedProduct.fullname}
          >
            <img
              src={photoProduct}
              alt={normalizedProduct.fullname}
              className="lazy-image"
              width={60}
              height={80}
            />
          </Link>
          <Link
            target="_blank"
            href={`/san-pham/${normalizedProduct.id}`}
            title={normalizedProduct.fullname}
            className="ms-6"
          >
            <p className="fw-semibold text-body-emphasis mb-0">
              {truncatedName}
            </p>
          </Link>
        </div>
      </td>
      <td>{formatMoney(normalizedProduct.baseprice)}</td>
      <td className="text-center">
        <div className="d-flex flex-nowrap justify-content-center">
          <button
            onClick={() => onRemove(normalizedProduct.id)}
            type="button"
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
          >
            Xóa
          </button>
        </div>
      </td>
    </tr>
  );
};

interface ProductSearchItemCompoenent {
  product: any;
  onChoose: (id: string) => void;
}

export const ProductSearchItem = ({
  product,
  onChoose,
}: ProductSearchItemCompoenent) => {
  const truncatedName = useTruncatedText(product.fullName, 40);
  const formatMoney = useVNDFormatter();
  const photoProduct = !product?.images
    ? "https://lamhystore.b-cdn.net/z6351502534051_9cfb96caff7c3cad774ed5b78e86f904.jpg"
    : product.images[0];

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center flex-nowrap">
          <Link
            target="_blank"
            href={`/san-pham/${product.id}`}
            title={product.f}
          >
            <img
              src={photoProduct}
              alt={product.fullName}
              className="lazy-image"
              width={60}
              height={80}
            />
          </Link>
          <Link
            target="_blank"
            href={`/san-pham/${product.id}`}
            title={product.fullName}
            className="ms-6"
          >
            <p className="fw-semibold text-body-emphasis mb-0">
              {truncatedName}
            </p>
          </Link>
        </div>
      </td>
      <td>{formatMoney(product.basePrice)}</td>
      <td className="text-center">
        <div className="d-flex flex-nowrap justify-content-center">
          <button
            onClick={() => onChoose(product)}
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
            type="button"
          >
            Thêm
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function page() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { dataSection, refreshData } = useDataSection(0);
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
            <h2 className="fs-4 mb-0">Flash Sale</h2>
            <p>Tất cả các sản phẩm ở mục Flash Sale</p>
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
