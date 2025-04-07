import React from "react";

export default function ListHeader() {
  return (
    <div className="card-header bg-transparent px-0 pt-0 pb-7">
      <div className="row align-items-center justify-content-between">
        <div className="col-md-4 col-12 mr-auto mb-md-0 mb-6">
          <select className="form-select" disabled>
            <option>Tất cả</option>
          </select>
        </div>
      </div>
    </div>
  );
}
