"use client";

import apiLinks from "@/utils/api-links";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { GoLinkExternal } from "react-icons/go";
import { MdDragIndicator } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ListHeader from "@/components/Dashboard/ListHeader";
import { BiMove } from "react-icons/bi";
import { UpdatePositionPayload } from "../menu/page";

interface BannerItem {
  thumnailUrl: string;
  link: string;
}

interface BannerItemComponent {
  onDelete: (id: string) => void;
  id: string;
  data: BannerItem;
}

const BannerItem = ({ id, data, onDelete }: BannerItemComponent) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getFileNameFromUrl = (url: string) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };
  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td>
        <div className="d-flex align-items-center flex-nowrap">
          <img
            src={data.thumnailUrl}
            alt={getFileNameFromUrl(data.thumnailUrl)}
            className="lazy-image"
            width={200}
            height={200}
          />
        </div>
      </td>
      <td className="text-center">
        <div className="d-flex flex-nowrap justify-content-center">
          <button
            className="btn btn-primary py-4 px-5 btn-xs fs-13px me-4 "
            {...listeners}
          >
            <BiMove size={18} />
          </button>
          <Link
            href={data.link}
            target="_blank"
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
          >
            <GoLinkExternal size={18} />
          </Link>
          <button
            className="btn btn-primary py-4 px-5 btn-xs fs-13px me-4 "
            onClick={() => onDelete(id)}
          >
            <RiDeleteBin6Line size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function BannerPage() {
  const [isMoved, setIsMoved] = useState(false);
  const [onAddingBanner, setOnAddingBanner] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [uploaded, setUploaded] = useState(true);
  const { register, handleSubmit, setValue, reset } = useForm<BannerItem>();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUploaded(false);
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
    setUploaded(true);
  };
  const onSubmit = async (data: BannerItem) => {
    setOnAddingBanner(true);
    await axios.post(apiLinks.admin.bannerAdd, data);
    reset();
    setOnAddingBanner(false);
    setShowAddBanner(false);
    location.reload();
  };

  const [isFetching, setIsFetching] = useState(true);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(apiLinks.admin.bannerGetList);
        const data = response.data;
        const banners = data[0].sections;
        setBanners(banners);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchBanners();
  }, [reset]);

  const deleteBanner = async (id: string) => {
    await axios.delete(`${apiLinks.admin.sectionDeleted}/${id}`);
    const updateBanner = [...banners].filter((b: any) => b.id !== id);
    setBanners(updateBanner);
    alert("Xóa thành công!");
  };

  const getBannerPos = (id: any) =>
    banners.findIndex((banner: any) => banner.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBanners((banners) => {
        const originalPos = getBannerPos(active.id);
        const newPos = getBannerPos(over.id);
        return arrayMove(banners, originalPos, newPos);
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

    [...banners].map((m: any, i) => {
      const item: UpdatePositionPayload = {
        id: m.id,
        position: i,
      };

      newPosList.push(item);
    });
    await axios.put(apiLinks.admin.sectionUpdatePosition, newPosList);
    alert("Cập nhật thành công!");
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
            <h2 className="fs-4 mb-0">Ảnh Banner</h2>
            <p>
              Hình ảnh lớn đầu trang web, quảng bá chiến dịch hoặc sản phẩm mới.
            </p>
          </div>
          <div className="col-md-6 d-flex flex-wrap justify-content-md-end gap-4">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddBanner(true)}
            >
              {" "}
              Thêm mới{" "}
            </button>
            {isMoved && (
              <>
                <button
                  className="btn btn-dark"
                  onClick={() => location.reload()}
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
                  <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCenter}
                  >
                    <tbody>
                      <SortableContext
                        items={banners}
                        strategy={verticalListSortingStrategy}
                      >
                        {banners.map((b: any, index: number) => (
                          <BannerItem
                            data={b}
                            id={b.id}
                            key={index}
                            onDelete={deleteBanner}
                          />
                        ))}
                      </SortableContext>
                    </tbody>
                  </DndContext>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={showAddBanner}
          onHide={() => setShowAddBanner(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Thêm Banner Mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="thumbnail">
                <Form.Label>Tải ảnh lên</Form.Label>
                <Form.Control type="file" onChange={handleFileUpload} />
              </Form.Group>
              <Form.Group controlId="link" className="mt-3">
                <Form.Label>Link</Form.Label>
                <Form.Control
                  type="text"
                  {...register("link", { required: true })}
                />
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddBanner(false)}
                >
                  Hủy
                </Button>
                {onAddingBanner || !uploaded ? (
                  <Button variant="primary" type="button" disabled>
                    Đang tải...
                  </Button>
                ) : (
                  <Button variant="primary" type="submit">
                    Lưu
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </main>
  );
}
