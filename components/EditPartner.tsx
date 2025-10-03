"use client";
import React from "react";
import {
  Card,
  Flex,
  Text,
  TextField,
  Select,
  Button,
  DatePicker,
} from "@hdfclife-insurance/one-x-ui";
import { parseDate } from "@internationalized/date";
import { updatePartner } from "@/services/api";
import { useAppSelector } from "../store/hooks"; // Import your Redux hook

const normalizeDateString = (dateString: string | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const toISODateString = (dateString?: string): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
};

export type PartnerType = "INDIVIDUAL" | "COMPANY" | "GOVERNMENT" | "NON_PROFIT";

type EditPartnerProps = {
  id: number;
  data: {
    PartnerName?: string;
    email?: string;
    Type?: PartnerType;
    PAN?: string;
    GST?: string;
    ContactAddress?: string;
    DateofAgreement?: string;
    phone?: string;
  };
  onClose: () => void;
  onSuccess?: (updated: EditPartnerProps["data"]) => void;
};

export default function EditPartner({
  id,
  data,
  onClose,
  onSuccess,
}: EditPartnerProps) {
  // Get current logged-in user's name from Redux store
  const currentUserName = useAppSelector((state) => state.user.name);

  const [formData, setFormData] = React.useState({
    ...data,
    PAN: data.PAN ?? "",
    GST: data.GST ?? "",
    ContactAddress: data.ContactAddress ?? "",
    DateofAgreement: normalizeDateString(data.DateofAgreement),
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Pass the current user's name to updatePartner for X-Editor header
      const updated = await updatePartner(id, formData);
      console.log("Updated Partner:", updated);
      console.log("Editor:", currentUserName); // Debug log to see who's editing
      onSuccess?.(updated);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="relative w-[500px] p-6">
        <div className="absolute top-4 right-4">
          <Button variant="tertiary" color="gray" size="sm" onClick={onClose}>
            ❌
          </Button>
        </div>

        <Flex direction="column" gap="md">
          <Text>Edit Partner</Text>

          <TextField
            label="Partner Name"
            value={formData.PartnerName ?? ""}
            onChange={(e) => handleChange("PartnerName", e.target.value)}
          />
          <Select
            label="Partner Type"
            value={formData.Type ? [formData.Type] : []}
            onValueChange={(details) => {
              console.log("Select details:", details);
              // details.value is an array, get the first item
              const selectedValue = details.value[0] || "";
              handleChange("Type", selectedValue);
            }}
            items={[
              { value: "INDIVIDUAL", label: "INDIVIDUAL" },
              { value: "COMPANY", label: "COMPANY" },
              { value: "GOVERNMENT", label: "GOVERNMENT" },
              { value: "NON_PROFIT", label: "NON_PROFIT" },
            ]}
          />
          <TextField
            label="Email"
            value={formData.email ?? ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <TextField
            label="Contact Number"
            value={formData.phone ?? ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <TextField
            label="GST Number"
            value={formData.GST}
            onChange={(e) => handleChange("GST", e.target.value)}
          />
          <TextField
            label="Contact Address"
            value={formData.ContactAddress ?? ""}
            onChange={(e) => handleChange("ContactAddress", e.target.value)}
          />
          <DatePicker
            label="Date of Agreement"
            value={
              toISODateString(formData.DateofAgreement)
                ? [parseDate(toISODateString(formData.DateofAgreement)!)]
                : []
            }
            onChange={(value) => {
              const selected = Array.isArray(value) ? value[0] : value;
              handleChange("DateofAgreement", selected?.toString() ?? "");
            }}
          />

          <Flex justify="end">
            <div className="p-4">
              <Button variant="primary" color="primary" onClick={handleSubmit}>
                Edit
              </Button>
            </div>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
}