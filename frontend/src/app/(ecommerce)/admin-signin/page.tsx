"use client";

import Breadcrumb from "@/components/Ecommerce/Breadcrumb";
import { useForm } from "react-hook-form";
import React from "react";
import {
  getAdminProfile,
  loginAdmin,
  SignInInputs,
} from "@/slices/adminAuthSlice";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";

export default function AdminRouter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInputs>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (data: SignInInputs) => {
    try {
      const token = await dispatch(loginAdmin(data)).unwrap();
      const userProfile = await dispatch(
        getAdminProfile({ token: token }),
      ).unwrap();
      if (token && userProfile) {
        router.push("/admin/dashboard/menu");
      } else {
        alert("Sai mật khẩu hoặc số điện thại!");
      }
    } catch (error) {
      alert("Sai mật khẩu hoặc số điện thại!");
    }
  };

  return (
    <section className="pb-lg-20 pb-16">
      <Breadcrumb title="Hệ thống quản trị" />
      <div className="container">
        <div className="text-center pt-3 mb-12 mb-lg-9">
          <h2 className="fs-4 fs-lg-2 mb-11 mb-lg-14">HỆ THỐNG QUẢN TRỊ</h2>
        </div>
        <div className="row justify-content-center px-5">
          <div className="col-12 col-lg-4 mb-15 mb-lg-0 ">
            <h3 className="fs-4 mb-6">Tài khoản</h3>
            {/* 💡 Hook Form Submission */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 📞 Phone Number Field */}
              <div className="form-group mb-6">
                <label htmlFor="phoneNumber" className="visually-hidden">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  placeholder="Số điện thoại"
                  {...register("phoneNumber", {
                    required: "Vui lòng nhập số điện thoại.",
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ.",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <span className="text-danger">
                    {errors.phoneNumber.message}
                  </span>
                )}
              </div>

              {/* 🔒 Password Field */}
              <div className="form-group mb-6">
                <label htmlFor="password" className="visually-hidden">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Mật khẩu"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu.",
                  })}
                />
                {errors.password && (
                  <span className="text-danger">{errors.password.message}</span>
                )}
              </div>

              <a href="#" className="d-inline-block fs-15 lh-12 mb-7">
                Quên mật khẩu?
              </a>

              {/* 🟢 Submit Button */}
              <button type="submit" className="btn btn-primary w-100 mb-7">
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
