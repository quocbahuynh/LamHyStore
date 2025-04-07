"use client";
import ListHeader from "@/components/Dashboard/ListHeader";
import apiLinks from "@/utils/api-links";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { GoLinkExternal, GoSearch } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ProductCartItem, ProductSearchItem } from "../flashsale/page";
import useProducts from "@/utils/useProducts";
import { useForm } from "react-hook-form";
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
import { BiMove } from "react-icons/bi";
import { Section } from "@/models/Section";

interface MenuItem {
  id: string;
  iconUrl: string;
  title: string;
  position: number;
  pageType: string;
  sections: Section[];
}

interface SubMenuComponent {
  data: Section;
}

const SubMenu = ({ data }: SubMenuComponent) => {
  const [onEditMenu, setOnEditMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [productCart, setProductCart] = useState<any[]>([]);
  const [productsSearch, setProductsSearch] = useState([]);
  const { products, addProduct, removeProduct, updateProduct } = useProducts(
    data.productExternalIds,
  );

  useEffect(() => {
    setProductCart(products);
  }, [products]);

  const handleDelete = async () => {
    await axios.delete(apiLinks.admin.sectionDeleted + "/" + data.id);
    alert("Xóa thành công!");
    location.reload();
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
    const updatedCart = [...productCart].filter((p) => p.Id !== id);
    setProductCart(updatedCart);
  };

  const handleSubMitCart = async () => {
    let idList: string[] = [];
    [...productCart].map((p) =>
      p.Id ? idList.push(`${p.Id}`) : idList.push(`${p.id}`),
    );
    await updateProduct(idList, data);
    location.reload();
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: data.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td>{data.title}</td>
      <td>{data.productExternalIds.length} sản phẩm</td>
      <td className="text-center">
        <div className="d-flex flex-nowrap justify-content-center">
          <button
            className="btn btn-primary py-4 px-5 btn-xs fs-13px me-4 "
            {...listeners}
          >
            <BiMove size={18} />
          </button>
          <button
            className="btn btn-primary py-4 px-5 btn-xs fs-13px me-4 "
            onClick={() => setOnEditMenu(true)}
          >
            <FaEdit size={18} />
          </button>
          <Link
            href={"/danh-muc/" + data.slug}
            target="_blank"
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
          >
            <GoLinkExternal size={18} />
          </Link>
          <button
            className="btn btn-primary py-4 px-5 btn-xs fs-13px me-4 "
            onClick={handleDelete}
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
    </tr>
  );
};

interface BigMenuComponent {
  data: MenuItem;
  index: string;
}

interface PageDataPayload {
  pageType: string;
  thumnailUrl: string;
  pageId: string;
  title: string;
  productExternalIds: string[];
}

const BigMenu = ({ data, index }: BigMenuComponent) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsSearch, setProductsSearch] = useState([]);
  const [searching, setSearching] = useState(false);
  const [productCart, setProductCart] = useState<any[]>([]);
  const { register, handleSubmit, reset } = useForm<PageDataPayload>();
  const [subMenuData, setSubMenuData] = useState<Section[]>([]);
  const [isMoved, setIsMoved] = useState(false);

  useEffect(() => {
    if (data) {
      setSubMenuData(data.sections);
    }
  }, [data]);

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

  const onSubmit = async (payload: PageDataPayload) => {
    try {
      if (data) {
        let extractProductsId: string[] = [];
        productCart.map((p) => {
          extractProductsId.push(`${p.id}`);
        });
        payload.productExternalIds = extractProductsId;
        await axios.post(apiLinks.admin.subMenuAdd, payload);
        reset();
        location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (id: string) => {
    await axios.delete(apiLinks.admin.menuDelete + "/" + id, {
      data: { pageType: "MENU_HOME" },
    });
    location.reload();
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: data.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getMenuPos = (id: any) =>
    subMenuData.findIndex((m: Section) => m.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSubMenuData((menus) => {
        const originalPos = getMenuPos(active.id);
        const newPos = getMenuPos(over.id);
        return arrayMove(menus, originalPos, newPos);
      });
      setIsMoved(true);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleMovedPos = async () => {
    const newPosList: UpdatePositionPayload[] = [];

    [...subMenuData].map((m, i) => {
      const item: UpdatePositionPayload = {
        id: m.id,
        position: i,
      };

      newPosList.push(item);
    });
    await axios.put(apiLinks.admin.sectionUpdatePosition, newPosList);
    alert("Cập nhật thành công!");
    setIsMoved(false);
    location.reload();
  };

  return (
    <Accordion.Item
      eventKey={index}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <Accordion.Header>
        <div className="d-flex justify-content-between w-100 align-items-center px-6">
          <span className="text-uppercase">{data.title}</span>
          <div className="d-flex gap-3">
            <Button variant="primary" {...listeners}>
              <BiMove size={20} />
            </Button>
            <Button onClick={() => setShowAddModal(true)} variant="primary">
              Thêm mới
            </Button>
            <Button onClick={() => handleRemove(data.id)} variant="primary">
              Xóa
            </Button>
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
      </Accordion.Header>
      <Accordion.Body>
        <div className="card-body px-0 pt-7 pb-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle table-nowrap mb-0">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={subMenuData}
                  strategy={verticalListSortingStrategy}
                >
                  {subMenuData.map((s, i) => (
                    <SubMenu data={s} key={i} />
                  ))}
                </SortableContext>
              </DndContext>
            </table>
          </div>
        </div>
      </Accordion.Body>

      <Modal
        size="xl"
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm Menu nhỏ</Modal.Title>
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
                  <Form.Control
                    type="text"
                    {...register("pageId")}
                    hidden
                    value={data.id}
                    required
                  />
                  <Form.Control
                    type="text"
                    {...register("pageType")}
                    hidden
                    value={"MENU_HOME"}
                    required
                  />
                  <Form.Control
                    type="text"
                    {...register("thumnailUrl")}
                    hidden
                    value={"/"}
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
                      maxHeight: "350px",
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
    </Accordion.Item>
  );
};

interface AddPagePayload {
  pageType: string;
  iconUrl: string;
  title: string;
}

export interface UpdatePositionPayload {
  id: string;
  position: number;
}

export default function page() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isMoved, setIsMoved] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<AddPagePayload>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiLinks.homepage.menu);
        const data = response.data;
        setMenuData(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchData();
  }, []);

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
    setValue("iconUrl", cdnUrl); // Update form value
  };

  const onSubmit = async (data: AddPagePayload) => {
    await axios.post(apiLinks.admin.pageAdd, data);
    reset();
    setShowAddMenu(false);
    location.reload();
  };

  const getMenuPos = (id: any) =>
    menuData.findIndex((m: MenuItem) => m.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setMenuData((menus) => {
        const originalPos = getMenuPos(active.id);
        const newPos = getMenuPos(over.id);
        return arrayMove(menus, originalPos, newPos);
      });
      setIsMoved(true);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleMovedPos = async () => {
    const newPosList: UpdatePositionPayload[] = [];

    [...menuData].map((m, i) => {
      const item: UpdatePositionPayload = {
        id: m.id,
        position: i,
      };

      newPosList.push(item);
    });
    await axios.put(apiLinks.admin.pageUpdatePosition, newPosList);
    alert("Cập nhật thành công!");
    setIsMoved(false);
    location.reload();
  };

  return (
    <main
      id="content"
      className="bg-body-tertiary-01 d-flex flex-column main-content"
    >
      <div className="dashboard-page-content">
        <div className="row mb-9 align-items-center justify-content-between">
          <div className="col-md-6 mb-8 mb-md-0">
            <h2 className="fs-4 mb-0">Thanh Menu</h2>
            <p>
              Đóng vai trò như một "chiếc la bàn" giúp khách hàng khám phá
              website hiệu quả.
            </p>
          </div>
          <div className="col-md-6 d-flex flex-wrap justify-content-md-end gap-4">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddMenu(true)}
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

          <div className="card mb-4 rounded-4 p-7">
            <ListHeader />
            <div className="card-body px-0 pt-7 pb-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle table-nowrap mb-0">
                  <Accordion>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={menuData}
                        strategy={verticalListSortingStrategy}
                      >
                        {menuData.map((m, i) => (
                          <BigMenu data={m} index={i.toString()} key={i} />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </Accordion>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showAddMenu} onHide={() => setShowAddMenu(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Menu mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="thumbnail">
              <Form.Label>Biểu tượng</Form.Label>
              <Form.Control type="file" onChange={handleFileUpload} />
            </Form.Group>
            <Form.Group controlId="link" className="mt-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                {...register("title", { required: true })}
              />
              <Form.Control
                type="text"
                defaultValue={"MENU_HOME"}
                {...register("pageType", { required: true })}
                hidden
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Hoàn thành
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </main>
  );
}
