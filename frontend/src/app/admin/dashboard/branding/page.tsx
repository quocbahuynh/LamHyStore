"use client";
import ListHeader from "@/components/Dashboard/ListHeader";
import apiLinks from "@/utils/api-links";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { BiMove } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useForm } from "react-hook-form";
import { GoSearch } from "react-icons/go";
import { ProductCartItem, ProductSearchItem } from "../flashsale/page";
import useProducts from "@/utils/useProducts";
import { UpdatePositionPayload } from "../menu/page";

interface Section {
  id: string;
  title: string;
  slug: string;
  thumnailUrl: string;
  productExternalIds: string[];
}

interface PageData {
  id: string;
  title: string;
  position: number;
  pageType: string;
  sections: Section[];
}

interface SectionUpdatePayload {
  title: string;
  thumnailUrl: string;
  productExternalIds: string[];
}

interface SectionItemComponent {
  data: Section;
}

const SectionItem = ({ data }: SectionItemComponent) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsSearch, setProductsSearch] = useState([]);
  const [searching, setSearching] = useState(false);
  const [productCart, setProductCart] = useState<any[]>([]);
  const { register, handleSubmit, reset, setValue } =
    useForm<SectionUpdatePayload>();
  const [subMenuData, setSubMenuData] = useState<Section[]>([]);
  const { products, removeProduct, addProduct, updatePosition } = useProducts(
    data.productExternalIds,
  );
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: data.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    const transformKeys = (product: any) => {
      return Object.fromEntries(
        Object.entries(product).map(([key, value]) => [
          key.charAt(0).toLowerCase() + key.slice(1),
          value,
        ]),
      );
    };

    const transformedProducts = products.map(transformKeys);
    setValue("thumnailUrl", data.thumnailUrl);
    setProductCart(transformedProducts);
  }, [data, products]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await axios.put(
      "https://sg.storage.bunnycdn.com/lamhystore/" + file.name,
      file,
      {
        headers: {
          AccessKey: "738141d5-cd83-4050-b24d5632e09f-5a39-48d4",
          "Content-Type": "application/octet-stream",
        },
      },
    );
    const cdnUrl = `https://lamhystore.b-cdn.net/` + file.name;
    setValue("thumnailUrl", cdnUrl); // Update form value
  };

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

  const handleDelete = async () => {
    await axios.delete(apiLinks.admin.sectionDeleted + "/" + data.id);
    alert("Xóa thành công!");
    location.reload();
  };

  const onSubmit = async (payload: SectionUpdatePayload) => {
    try {
      if (data) {
        let extractProductsId: string[] = [];
        productCart.map((p) => {
          extractProductsId.push(`${p.id}`);
        });
        payload.productExternalIds = extractProductsId;
        await axios.put(
          apiLinks.admin.sectionBrandingUpdated + "/" + data.id,
          payload,
        );
        reset();
        location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td>
        <div className="d-flex align-items-center flex-nowrap">
          <Link
            target="_blank"
            href={`/danh-muc/${data.slug}`}
            title={data.title}
          >
            <img
              src={data.thumnailUrl}
              alt={data.title}
              className="lazy-image"
              width={60}
              height={80}
            />
          </Link>
          <Link
            target="_blank"
            href={`/danh-muc/${data.slug}`}
            title={data.title}
            className="ms-6"
          >
            <p className="fw-semibold text-body-emphasis mb-0">{data.title}</p>
          </Link>
        </div>
      </td>
      <td className="text-center">
        <div className="d-flex flex-nowrap justify-content-center">
          <button
            className="btn btn-primary py-4 px-5 btn-xs fs-13px me-4"
            {...listeners}
          >
            <BiMove size={18} />
          </button>
          <button
            className="btn btn-primary py-4 px-5 btn-xs fs-13px me-4"
            onClick={() => setShowAddModal(true)}
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
          >
            {" "}
            <RiDeleteBin6Line size={18} />
          </button>
        </div>
      </td>
      <Modal
        size="xl"
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="row" style={{ height: "70vh" }}>
              <div className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Ảnh thương hiệu</Form.Label>
                  <Form.Control type="file" onChange={handleFileUpload} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Tên thương hiệu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tiêu đề"
                    {...register("title")}
                    required
                    defaultValue={data.title}
                  />
                </Form.Group>
                <InputGroup className="mb-3 mt-4">
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
                      maxHeight: "260px",
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
                    maxHeight: "470px",
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
    </tr>
  );
};

export default function page() {
  const [bestSellerData, setbestSellerData] = useState<Section[]>([]);
  const [isMoved, setIsMoved] = useState(false);
  //const { register, handleSubmit, setValue, reset } = useForm<AddPagePayload>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsSearch, setProductsSearch] = useState([]);
  const [searching, setSearching] = useState(false);
  const [productCart, setProductCart] = useState<any[]>([]);
  const { register, handleSubmit, reset, setValue } =
    useForm<SectionUpdatePayload>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiLinks.homepage.branding);
        const data = response.data[0].sections;
        setbestSellerData(data);
      } catch (error) {
        console.error("Error fetching bestseller:", error);
      }
    };

    fetchData();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getSectionPos = (id: any) =>
    bestSellerData.findIndex((m: Section) => m.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setbestSellerData((menus) => {
        const originalPos = getSectionPos(active.id);
        const newPos = getSectionPos(over.id);
        return arrayMove(menus, originalPos, newPos);
      });
      setIsMoved(true);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await axios.put(
      "https://sg.storage.bunnycdn.com/lamhystore/" + file.name,
      file,
      {
        headers: {
          AccessKey: "738141d5-cd83-4050-b24d5632e09f-5a39-48d4",
          "Content-Type": "application/octet-stream",
        },
      },
    );
    const cdnUrl = `https://lamhystore.b-cdn.net/` + file.name;
    setValue("thumnailUrl", cdnUrl); // Update form value
  };

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

  const onSubmit = async (payload: SectionUpdatePayload) => {
    try {
      let extractProductsId: string[] = [];
      productCart.map((p) => {
        extractProductsId.push(`${p.id}`);
      });
      payload.productExternalIds = extractProductsId;
      await axios.post(apiLinks.admin.sectionBrandingAdd, payload);
      reset();
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMovedPos = async () => {
    const newPosList: UpdatePositionPayload[] = [];

    [...bestSellerData].map((m, i) => {
      const item: UpdatePositionPayload = {
        id: m.id,
        position: i,
      };

      newPosList.push(item);
    });
    await axios.put(apiLinks.admin.sectionUpdatePosition, newPosList);
    alert("Cập nhật thành công!");
    location.reload();
    setIsMoved(false);
  };

  return (
    <main
      id="content"
      className="bg-body-tertiary-01 d-flex flex-column main-content"
    >
      <div className="dashboard-page-content">
        <div className="row mb-9 align-items-center justify-content-between">
          <div className="col-md-6 mb-8 mb-md-0">
            <h2 className="fs-4 mb-0">Thương hiệu</h2>
          </div>

          <div className="col-md-6 d-flex flex-wrap justify-content-md-end gap-4">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              {" "}
              Thêm mới{" "}
            </button>
            {isMoved && (
              <>
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    location.reload();
                  }}
                >
                  {" "}
                  Hủy{" "}
                </button>
                <button className="btn btn-primary" onClick={handleMovedPos}>
                  {" "}
                  Lưu mới{" "}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="card mb-4 rounded-4 p-7">
          <ListHeader />
          <div className="card-body px-0 pt-7 pb-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle table-nowrap mb-0">
                <tbody>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={bestSellerData}
                      strategy={verticalListSortingStrategy}
                    >
                      {bestSellerData.map((b, i) => (
                        <SectionItem data={b} key={i} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </tbody>
              </table>
            </div>
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
          <Modal.Title>Thêm mới thương hiệu</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="row" style={{ height: "70vh" }}>
              <div className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Ảnh thương hiệu</Form.Label>
                  <Form.Control type="file" onChange={handleFileUpload} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Tên thương hiệu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tiêu đề"
                    {...register("title")}
                    required
                  />
                </Form.Group>
                <InputGroup className="mb-3 mt-4">
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
                      maxHeight: "260px",
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
                    maxHeight: "470px",
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
