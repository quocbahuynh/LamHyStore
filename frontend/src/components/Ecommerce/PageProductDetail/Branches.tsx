"use client";
import React from "react";
import { Dropdown } from "react-bootstrap";

interface BranchesComponent {
  inventories: any[];
}

export default function Branches({ inventories }: BranchesComponent) {
  return (
    <>
      {inventories.some((inventory) => inventory.onHand > 0) ? (
        <Dropdown>
          <Dropdown.Toggle className="btn btn-lg btn-dark w-100">
            Chi nhánh còn hàng
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {inventories
              .filter((inventory) => inventory.onHand > 0)
              .map((inventory, index) => (
                <Dropdown.Item key={index}>
                  {inventory.branchName} ({inventory.onHand} sản phẩm)
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Dropdown>
          <Dropdown.Toggle className="btn btn-lg btn-dark w-100" disabled>
            Hết hàng tại chi nhánh
          </Dropdown.Toggle>
        </Dropdown>
      )}
    </>
  );
}
