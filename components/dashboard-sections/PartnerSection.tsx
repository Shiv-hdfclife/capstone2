import React from 'react';
import { Text, Button, Card } from "@hdfclife-insurance/one-x-ui";
import { Handshake } from "@phosphor-icons/react";

export default function PartnerSection() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Handshake size={32} className="text-blue-600" />
                <Text size="xl" fontWeight="bold">
                    Partner Management
                </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                    <Text size="lg" fontWeight="semibold" className="mb-4">
                        Active Partners
                    </Text>
                    <Text size="xl" fontWeight="bold" className="text-green-600">
                        45
                    </Text>
                </Card>

                <Card className="p-6">
                    <Text size="lg" fontWeight="semibold" className="mb-4">
                        Pending Approvals
                    </Text>
                    <Text size="xl" fontWeight="bold" className="text-yellow-600">
                        12
                    </Text>
                </Card>

                <Card className="p-6">
                    <Text size="lg" fontWeight="semibold" className="mb-4">
                        Total Revenue
                    </Text>
                    <Text size="xl" fontWeight="bold" className="text-blue-600">
                        ₹2.5L
                    </Text>
                </Card>
            </div>

            <div className="flex gap-4">
                <Button variant="primary" color="primary">
                    Add New Partner
                </Button>
                <Button variant="secondary">
                    View All Partners
                </Button>
            </div>
        </div>
    );
}