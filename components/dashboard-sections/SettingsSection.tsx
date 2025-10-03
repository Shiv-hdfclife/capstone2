import React from 'react';
import { Text, Button, Card, Switch } from "@hdfclife-insurance/one-x-ui";
import { Gear } from "@phosphor-icons/react";

export default function SettingsSection() {
    const [notifications, setNotifications] = React.useState(true);
    const [emailAlerts, setEmailAlerts] = React.useState(false);
    const [autoBackup, setAutoBackup] = React.useState(true);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Gear size={32} className="text-gray-600" />
                <Text size="xl" fontWeight="bold">
                    Settings
                </Text>
            </div>

            <div className="space-y-6">
                <Card className="p-6">
                    <Text size="lg" fontWeight="semibold" className="mb-4">
                        Notifications
                    </Text>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <Text fontWeight="medium">Push Notifications</Text>
                                <Text size="sm" className="text-gray-600">
                                    Receive notifications in the app
                                </Text>
                            </div>
                            <Switch
                                checked={notifications}
                                onCheckedChange={(details) => setNotifications(details.checked)}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <Text fontWeight="medium">Email Alerts</Text>
                                <Text size="sm" className="text-gray-600">
                                    Get important updates via email
                                </Text>
                            </div>
                            <Switch
                                checked={emailAlerts}
                                onCheckedChange={(details) => setEmailAlerts(details.checked)}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Text size="lg" fontWeight="semibold" className="mb-4">
                        System
                    </Text>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <Text fontWeight="medium">Auto Backup</Text>
                                <Text size="sm" className="text-gray-600">
                                    Automatically backup data daily
                                </Text>
                            </div>
                            <Switch
                                checked={autoBackup}
                                onCheckedChange={(details) => setAutoBackup(details.checked)}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <Text size="lg" fontWeight="semibold" className="mb-4">
                        Account
                    </Text>
                    <div className="space-y-3">
                        <Button className="w-full justify-start">
                            Change Password
                        </Button>
                        <Button className="w-full justify-start">
                            Update Profile
                        </Button>
                        <Button className="w-full justify-start text-red-600 border-red-300">
                            Delete Account
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}