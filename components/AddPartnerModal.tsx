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
import { createPartner } from "@/services/api";

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

type AddPartnerProps = {
  onClose: () => void;
  onSuccess?: (newPartner: any) => void;
};

export default function AddPartnerModal({
  onClose,
  onSuccess,
}: AddPartnerProps) {
  const [formData, setFormData] = React.useState({
    PartnerName: "",
    email: "",
    Type: "",
    phone: "",
    PAN: "",
    GST: "",
    ContactAddress: "",
    DateofAgreement: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
  try {
    const payload = {
      name: formData.PartnerName,
      email: formData.email,
      partnerType: formData.Type,
      contactNumber: formData.phone,
      panNumber: formData.PAN,
      gstinNumber: formData.GST,
      address: formData.ContactAddress,
      dateOfAgreement: toISODateString(formData.DateofAgreement),
    };

    const response = await createPartner(payload);
    console.log("Created Partner:", response);
    onSuccess?.(response);
    onClose();
  } catch (error) {
    console.error("Add failed:", error);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-[500px] p-6">
        <div className="absolute top-4 right-4">
          <Button
            variant="tertiary"
            color="gray"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            ❌
          </Button>
        </div>

        <Flex direction="column" gap="md">
          <Text>Partner Registration</Text>

          <TextField
            label="Partner Name"
            value={formData.PartnerName}
            onChange={(e) => handleChange("PartnerName", e.target.value)}
          />

          <Select
            label="Partner Type"
            value={formData.Type ? [formData.Type] : []}
            onValueChange={(details) => {
              const selectedValue = details.value[0] || "";
              handleChange("Type", selectedValue);
            }}
            items={[
              { value: "Individual", label: "Individual" },
              { value: "Company", label: "Company" },
              { value: "Consultant", label: "Consultant" },
            ]}
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <TextField
            label="Contact Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <TextField
            label="PAN Number"
            value={formData.PAN}
            onChange={(e) => handleChange("PAN", e.target.value)}
          />

          <TextField
            label="GST Number"
            value={formData.GST}
            onChange={(e) => handleChange("GST", e.target.value)}
          />

          <TextField
            label="Contact Address"
            value={formData.ContactAddress}
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
            <Button variant="primary" color="primary" className="mt-20 p-4" onClick={handleSubmit}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
}
