"use client";
import ListHeader from "@/components/Dashboard/ListHeader";
import { useEffect, useState } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { ProductCartItem, ProductSearchItem } from "../flashsale/page";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import apiLinks from "@/utils/api-links";
import { GoLinkExternal, GoSearch } from "react-icons/go";
import useProducts from "@/utils/useProducts";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import { RiDeleteBin6Line, RiLiveFill } from "react-icons/ri";
import { IoCopy } from "react-icons/io5";

interface AddLive {
  title: string;
  productPinExternalID: string;
  productExternalID: string[];
}

interface LiveStreamCart {
  id: string;
  productExternalID: string;
  liveStreamId: string;
}

interface LiveStream {
  id: string;
  title: string;
  createdDate: string; // or Date if you want to parse it
  productPinExternalID: string;
  slug: string;
  liveStreamCarts: LiveStreamCart[];
}

interface SubMenuComponent {
  data: LiveStream;
}

interface LivestreamUpdate {
  name: string;
  addProductExternalIds: string[];
  removeProductExternalIds: string[];
}

const LiveItem = ({ data }: SubMenuComponent) => {
  const [onEditMenu, setOnEditMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [productCart, setProductCart] = useState<any[]>([]);
  const [productsSearch, setProductsSearch] = useState([]);
  const [productIdList, setProductIdList] = useState<string[]>([]);
  const { products } = useProducts(productIdList);
  const { register, getValues } = useForm<LivestreamUpdate>();
  const [removedProductIds, setRemovedProductIds] = useState<string[]>([]);
  const [addedProductIds, setAddedProductIds] = useState<string[]>([]);

  useEffect(() => {
    const product = data.liveStreamCarts.map((cart) => cart.productExternalID);
    setProductIdList(product);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setProductCart(products);
    }
  }, [productIdList, products]);
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
    setAddedProductIds((prevIds) => [...prevIds, product.id.toString()]);
  };

  const handleRemoveProductCart = async (id: string) => {
    const updatedCart = [...productCart].filter((p) => p.Id !== id);
    setProductCart(updatedCart);
    setRemovedProductIds([...removedProductIds, id.toString()]);
  };

  const handleConfirmDelete = async () => {
    await axios.delete(`${apiLinks.livestream.deleteById}/${data.id}`);
    alert("Xóa thành công!");
    location.reload();
  };

  const handleUpdate = async () => {
    const payload = {
      name: getValues().name.trim(),
      addProductExternalIds: addedProductIds,
      removeProductExternalIds: removedProductIds,
    };

    await axios.patch(`${apiLinks.livestream.updateById}/${data.id}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    alert("Cập nhật thành công");
    setOnEditMenu(false);
    location.reload();
  };

  const handleCopy = () => {
    const textToCopy = `${apiLinks.domain.domain}/l/${data.slug}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert("Đã sao chép!"))
      .catch((err) => console.error("Failed to copy:", err));
  };
  return (
    <tr>
      <td>{data.title}</td>
      <td>
        <Link href={apiLinks.domain.domain + `/l/${data.slug}`}>
          {apiLinks.domain.domain + `/l/${data.slug}`}
        </Link>
      </td>
      <td className="text-center">
        <div className="d-flex flex-nowrap justify-content-center">
          <Link
            href={"/admin/dashboard/livestream/" + data.id}
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
          >
            <RiLiveFill size={18} />
          </Link>
          <button
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4 "
            onClick={() => setOnEditMenu(true)}
          >
            <FaEdit size={18} />
          </button>
          <Link
            href={"/l/" + data.slug}
            target="_blank"
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
          >
            <GoLinkExternal size={18} />
          </Link>
          <button
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
            onClick={handleCopy}
          >
            <IoCopy size={18} />
          </button>
          <button
            className="btn btn-primary py-4 px-5 btn-xs fs-13px me-4 "
            onClick={handleConfirmDelete}
          >
            <RiDeleteBin6Line size={18} />
          </button>
        </div>
      </td>

      <Modal
        size="xl"
        show={onEditMenu}
        onHide={() => setOnEditMenu(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{data.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row" style={{ height: "60vh" }}>
            <div className="col-6">
              <Form.Group>
                <Form.Label>Tiêu đề</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tiêu đề"
                  defaultValue={data.title}
                  {...register("name")}
                />
              </Form.Group>
              <InputGroup className="mb-3 mt-6">
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
          <Button
            variant="primary"
            size="lg"
            onClick={handleUpdate}
            type="button"
          >
            Hoàn thành
          </Button>
        </Modal.Footer>
      </Modal>
    </tr>
  );
};

export default function page() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [productCart, setProductCart] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsSearch, setProductsSearch] = useState([]);
  const { register, handleSubmit, reset } = useForm<AddLive>();

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

  const onSubmit = async (payload: AddLive) => {
    try {
      let extractProductsId: string[] = [];
      productCart.map((p) => {
        extractProductsId.push(`${p.id}`);
      });
      payload.productPinExternalID = extractProductsId[0];
      payload.productExternalID = extractProductsId;
      await axios.post(apiLinks.livestream.addNewLiveStream, payload);
      reset();
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const [lives, setLives] = useState<LiveStream[]>([]);

  useEffect(() => {
    const fetchGomOrders = async () => {
      try {
        const response = await fetch(apiLinks.livestream.livestreamList); // Thay API URL của bạn
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: LiveStream[] = await response.json();
        setLives(data);
      } catch (error) {
        console.error("Error fetching gom orders:", error);
      }
    };

    fetchGomOrders();
  }, []);

  return (
    <main
      id="content"
      className="bg-body-tertiary-01 d-flex flex-column main-content"
    >
      <div className="dashboard-page-content">
        <div className="row mb-9 align-items-center justify-content-between">
          <div className="col-md-6 mb-8 mb-md-0">
            <h2 className="fs-4 mb-0 d-flex align-self-center gap-4">
              Livestream
            </h2>
          </div>

          <div className="col-md-6 d-flex flex-wrap justify-content-md-end gap-4">
            <button className="btn btn-outline-primary">
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
          <div className="table-responsive">
            <table className="table table-hover align-middle table-nowrap mb-0">
              <tbody>
                {lives.map((l, i) => (
                  <LiveItem key={i} data={l} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        size="xl"
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo Livestream</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="row" style={{ height: "70vh" }}>
              <div className="col-6">
                <Form.Group>
                  <Form.Label>Tiêu đề</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tiêu đề"
                    {...register("title")}
                    required
                  />
                </Form.Group>
                <InputGroup className="mb-3 mt-6">
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
                      maxHeight: "330px",
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
                    maxHeight: "460px",
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
            <Button type="submit" variant="primary" size="lg">
              Hoàn thành
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </main>
  );
}
