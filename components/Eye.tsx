"use client";
import React from "react";
import { Button } from "@hdfclife-insurance/one-x-ui";

type EyeProps = {
  data: {
    PartnerName?: string;
    email?: string;
    Type?: string;
    Location?: string;
    DateofAgreement?: string;
    phone?: string;
  };
  onClose: () => void;
};

export default function Eye({ data, onClose }: EyeProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        style={{ WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={`
          relative z-10 w-full max-w-md mx-4 rounded-2xl p-6
          bg-white/40 border border-white/60 shadow-2xl
          backdrop-blur-lg
        `}
        style={{ WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}
      >
        <h2 className="text-lg font-semibold mb-4 text-black">Partner Details</h2>

        <div className="space-y-2 text-sm text-black/80">
          <div><span className="font-medium">Name:</span> {data.PartnerName ?? "-"}</div>
          <div><span className="font-medium">Email:</span> {data.email ?? "-"}</div>
          <div><span className="font-medium">Type:</span> {data.Type ?? "-"}</div>
          <div><span className="font-medium">Location:</span> {data.Location ?? "-"}</div>
          <div><span className="font-medium">Date of Agreement:</span> {data.DateofAgreement ?? "-"}</div>
          <div><span className="font-medium">Phone:</span> {data.phone ?? "-"}</div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            color="primary"
            onClick={onClose}
            className="px-4 py-2 rounded-lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
