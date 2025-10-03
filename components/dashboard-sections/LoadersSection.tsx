import React from 'react';
import { Text, Button, Progress } from "@hdfclife-insurance/one-x-ui";
import { Copy } from "@phosphor-icons/react";

export default function LoadersSection() {
    const loaders = [
        { name: 'Customer Data Import', progress: 75, status: 'In Progress' },
        { name: 'Policy Document Generation', progress: 100, status: 'Completed' },
        { name: 'Claims Processing Batch', progress: 45, status: 'In Progress' },
        { name: 'Premium Collection Update', progress: 90, status: 'Almost Done' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Copy size={32} className="text-purple-600" />
                <Text size="xl" fontWeight="bold">
                    Data Loaders
                </Text>
            </div>

            <div className="space-y-4">
                {loaders.map((loader, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <Text size="lg" fontWeight="medium">
                                {loader.name}
                            </Text>
                            <Text size="sm" className={`px-2 py-1 rounded ${loader.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    loader.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {loader.status}
                            </Text>
                        </div>
                        <Progress value={loader.progress} className="mb-2" />
                        <Text size="sm" className="text-gray-600">
                            {loader.progress}% Complete
                        </Text>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <Button variant="primary" color="primary">
                    Start New Loader
                </Button>
                <Button variant="secondary">
                    View History
                </Button>
            </div>
        </div>
    );
}