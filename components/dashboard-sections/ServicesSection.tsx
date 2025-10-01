import React from 'react';
import { Text, Button, Card } from "@hdfclife-insurance/one-x-ui";
import { Layout } from "@phosphor-icons/react";

export default function ServicesSection() {
    const services = [
        {
            title: 'Policy Management',
            description: 'Manage customer policies and documents',
            icon: '📋',
            status: 'Active'
        },
        {
            title: 'Claims Processing',
            description: 'Handle insurance claims and settlements',
            icon: '⚖️',
            status: 'Active'
        },
        {
            title: 'Customer Support',
            description: 'Provide assistance to customers',
            icon: '🎧',
            status: 'Maintenance'
        },
        {
            title: 'Premium Calculator',
            description: 'Calculate insurance premiums',
            icon: '🧮',
            status: 'Active'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Layout size={32} className="text-indigo-600" />
                <Text size="xl" fontWeight="bold">
                    Services Management
                </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                    <Card key={index} className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">{service.icon}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <Text size="lg" fontWeight="semibold">
                                        {service.title}
                                    </Text>
                                    <span className={`px-2 py-1 text-xs rounded ${service.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {service.status}
                                    </span>
                                </div>
                                <Text size="sm" className="text-gray-600 mb-4">
                                    {service.description}
                                </Text>
                                <Button size="sm" variant="secondary">
                                    Configure
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex gap-4">
                <Button variant="primary" color="primary">
                    Add New Service
                </Button>
                <Button variant="secondary">
                    Service Logs
                </Button>
            </div>
        </div>
    );
}