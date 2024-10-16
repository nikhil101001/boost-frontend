"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import clsx from "clsx";

import { OrderDialog } from "../app/(Dashboard)/_components/OrderDialog";
import { PiGameControllerFill, PiPencil } from "react-icons/pi";
import { useUserStore } from "@/store/use-user";

const OrderCard = ({ order, loadOrders }) => {
  const { user } = useUserStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onClose = () => setDialogOpen(false);

  return (
    <div
      onClick={() => setDialogOpen(true)}
      className="flex-1 min-w-fit space-y-4 rounded-lg border border-white/10 p-4 bg-white/10 hover:border-white/20"
    >
      <div className="flex justify-between items-center gap-2 flex-wrap-reverse">
        <h3 className="text-lg font-semibold">Order #{order?.internal_id}</h3>

        <div className="flex gap-2">
          {(user.role === "admin" ||
            user.role === "dev" ||
            user.role === "skillmaster") && (
            <button
              onClick={() => {
                setDialogOpen(true);
                setIsEditing(true);
              }}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <PiPencil className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => setDialogOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <FaExternalLinkAlt className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        {order?.products?.map((product, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between items-center bg-black/20 rounded-lg p-2 hover:bg-black/30"
          >
            <div className="flex flex-wrap items-center gap-x-2">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  height={70}
                  width={70}
                  priority
                  className="rounded-md object-contain bg-white/10 p-2"
                />
              )}
              <div className="flex flex-col gap-y-1">
                <p className="text-sm font-semibold">{product.name}</p>
              </div>
            </div>
            <p className="text-sm font-semibold">${product.price}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-y-2">
        {/* Assigned Skill Master */}
        {order.skill_master.gamer_tag && (
          <div className="flex flex-wrap gap-2 text-sm items-center">
            <span>Assigned Skill Master:</span>
            <span className="font-semibold px-1 rounded-md border border-white/10">
              {order.skill_master.gamer_tag}
            </span>
          </div>
        )}

        {/* Platform */}
        <div className="flex flex-wrap gap-2 text-sm items-center">
          <span>Platform:</span>
          <span className="font-semibold px-1 rounded-md border border-white/10 flex gap-2 items-center">
            <PiGameControllerFill className="h-5 w-5" />{" "}
            <span>{order.platform?.name}</span>
          </span>
        </div>

        {/* Order Status */}
        <div className="flex flex-wrap gap-2 text-sm items-center">
          <span>Order status:</span>
          <span
            className={clsx(
              "font-semibold px-1 rounded-md border border-white/10",

              order.state === "in_progress" && "bg-purple-500",
              order.state === "delayed" && "bg-yellow-500",
              order.state === "disputed" && "bg-red-500",
              order.state === "assigned" && "bg-blue-500",
              order.state === "re_assigned" && "bg-blue-500",
              order.state === "complete" && "bg-green-500"
            )}
          >
            {order.state}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 justify-between items-center">
          <p className="text-sm">
            Order Date: {new Date(order.created_at).toLocaleString()}
          </p>
          <p className="text-lg font-semibold">Price: ${order.total_price}</p>
        </div>

        <OrderDialog
          dialogOpen={dialogOpen}
          onClose={onClose}
          order={order}
          isEditing={isEditing}
          loadOrders={loadOrders}
        />
      </div>
    </div>
  );
};

export default OrderCard;
