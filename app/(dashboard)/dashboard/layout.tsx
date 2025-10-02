"use client";
import React, { useState, useCallback } from "react";
import { Header, Avatar, Text, Caption, IconButton, Flex, Divider, Badge } from "@hdfclife-insurance/one-x-ui";
import "../../globals.css";
import Image from "next/image";
import Logo from "../../../public/Logo.png"
import { Drawer, DrawerContent, Select, Upload } from "@hdfclife-insurance/one-x-ui";
import { UploadSimple, FileArrowDown, Bell } from "@phosphor-icons/react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLeftSection } from "../../../store/slices/sidebarSlice";
import { uploadRawLoader } from "../../../services/config.upload";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
    const [selectedBusinessType, setSelectedBusinessType] = useState<string>('');
    const [selectedChannelType, setSelectedChannelType] = useState<string>('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const dispatch = useAppDispatch();
    const leftSectionOpen = useAppSelector((state) => state.sidebar.leftSection);

    const handlePressedChange = useCallback((pressed: boolean) => {
        dispatch(setLeftSection(pressed));
    }, [dispatch]);

    // File upload handlers with API integration
    const handleFileAccept = useCallback(async (details: any) => {
        console.log('🟢 Raw Loader File accepted - details:', details);
        console.log('🟢 Raw Loader File accepted - type:', typeof details);
        console.log('🟢 Raw Loader File accepted - keys:', Object.keys(details || {}));

        let file: File | null = null;

        if (details?.files?.[0]) {
            file = details.files[0];
        } else if (details?.file) {
            file = details.file;
        }

        if (!file) {
            alert('❌ No file found to upload');
            return;
        }

        if (!selectedDocumentType) {
            alert('❌ Please select a document type before uploading');
            return;
        }

        if (!selectedBusinessType) {
            alert('❌ Please select a business type before uploading');
            return;
        }

        if (!selectedChannelType) {
            alert('❌ Please select a channel type before uploading');
            return;
        }

        setUploadLoading(true);
        try {
            console.log('📤 Uploading raw loader file to API:', {
                fileName: file.name,
                fileSize: file.size,
                documentType: selectedDocumentType,
                businessType: selectedBusinessType,
                channelType: selectedChannelType
            });

            // Using hardcoded values for now - you can make these dynamic later
            const partnerId = "5";
            const configId = "configid";

            const response = await uploadRawLoader(file, selectedDocumentType, partnerId, configId);
            console.log('✅ Raw Loader Upload API response:', response);
            alert(`✅ File "${file.name}" uploaded successfully to raw loader!`);

            // Reset form on success
            setSelectedDocumentType('');
            setSelectedBusinessType('');
            setSelectedChannelType('');
            setDrawerOpen(false); // Close drawer on success
        } catch (error: any) {
            console.error('❌ Raw Loader Upload API error:', error);
            alert(`❌ Raw Loader Upload failed: ${error.message || 'Unknown error'}`);
        } finally {
            setUploadLoading(false);
        }
    }, [selectedDocumentType, selectedBusinessType, selectedChannelType]);

    const handleFileChange = useCallback((details: any) => {
        console.log('🔄 Raw Loader File changed - details:', details);
        console.log('🔄 Raw Loader File changed - type:', typeof details);
        console.log('🔄 Raw Loader File changed - keys:', Object.keys(details || {}));
    }, []);

    const handleFileReject = useCallback((details: any) => {
        console.log('🔴 Raw Loader File rejected - details:', details);
        console.log('🔴 Raw Loader File rejected - type:', typeof details);
        console.log('🔴 Raw Loader File rejected - keys:', Object.keys(details || {}));

        let errorMessage = 'File validation failed';

        if (details?.files?.[0]?.errors?.[0]?.message) {
            errorMessage = details.files[0].errors[0].message;
        } else if (details?.file?.errors?.[0]?.message) {
            errorMessage = details.file.errors[0].message;
        } else if (details?.errors?.[0]?.message) {
            errorMessage = details.errors[0].message;
        }

        alert(`❌ Raw Loader File rejected: ${errorMessage}`);
    }, []);

    // File validation function for Excel files
    const validateFile = useCallback((file: File, details?: any) => {
        console.log('🔍 Validating raw loader file:', file.name, 'Size:', file.size, 'Type:', file.type);
        console.log('🔍 Validation details:', details);

        const errors: any[] = [];

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            console.log('❌ File too large:', file.size);
            errors.push({
                code: 'file-too-large',
                message: 'File size must be less than 10MB'
            });
        }

        // Check minimum file size
        if (file.size < 1024) {
            console.log('❌ File too small:', file.size);
            errors.push({
                code: 'file-too-small',
                message: 'File size must be at least 1KB'
            });
        }

        // Excel file type validation
        const fileName = file.name.toLowerCase();
        const allowedTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!fileName.endsWith('.xls') && !fileName.endsWith('.xlsx') && !allowedTypes.includes(file.type)) {
            console.log('❌ Invalid file type:', file.type, 'Name:', file.name);
            errors.push({
                code: 'file-invalid-type',
                message: 'Only Excel files (.xls, .xlsx) are allowed'
            });
        }

        console.log('🔍 Raw Loader Validation result:', errors.length === 0 ? 'PASSED' : 'FAILED', 'Errors:', errors);
        return errors.length > 0 ? errors : null;
    }, []);

    return (
        <div className="min-h-dvh flex flex-col bg-gray-100 [--left-sidebar-width:240px] [--gutter:24px] [--header-height:68px] [--right-sidebar-width:80px]">
            <Header
                fixed
                className="border-0 border-b border-solid border-indigo-200"
            >
                <Header.Hamburger
                    pressed={leftSectionOpen}
                    onPressedChange={handlePressedChange}
                />
                <div className="flex items-center h-full max-h-[50px]">
                    <Image
                        src={Logo}
                        className="h-auto max-h-[40px] w-auto object-contain"
                        alt="Logo"
                        height={40}
                        width={150}
                    />
                </div>
                <div className="flex items-center justify-end gap-3 w-full">
                    <div className="text-right hidden lg:block">
                        <Text size="sm" fontWeight="bold">
                            Sujoy Guru
                        </Text>
                        <Text size="sm">Key Account Manager</Text>
                        <Caption className="italic">
                            Last login : 03/09/2024 12:21 pm
                        </Caption>
                    </div>
                    <Avatar
                        variant="outline"
                        src="https://helixassets.apps-hdfclife.com/images/Childcare_2.png"
                    />
                </div>
            </Header>

            {children}

            {/* Right Sidebar */}
            <aside className="fixed hidden lg:flex px-1 py-4 top-[var(--header-height)] bottom-0 border-0 border-l border-indigo-200 right-0 bg-white ]">
                <Flex direction="column" align="center" gap={8}>
                    <IconButton
                        color="gray"
                        variant="tertiary"
                        onClick={() => setDrawerOpen(true)}
                    >
                        <UploadSimple />
                    </IconButton>
                </Flex>
            </aside>

            <Drawer
                direction="right"
                withOverlay={false}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <DrawerContent className="w-full max-w-md p-4 shadow-shadow-5 top-[var(--header-height,68px)]">
                    <Text
                        fontWeight="semibold"
                        className="text-accent-secondary"
                        size="lg"
                    >
                        Manage documents
                    </Text>

                    <div className="mt-6 space-y-6">
                        <Select
                            label="Please select your document type"
                            value={selectedDocumentType ? [selectedDocumentType] : []}
                            onValueChange={(details: any) => {
                                console.log('📋 Raw Loader Document type selected details:', details);
                                const value = details.value?.[0] || details.value || '';
                                console.log('📋 Raw Loader Document type selected value:', value);
                                setSelectedDocumentType(value);
                            }}
                            items={[
                                "Aadhar Card",
                                "PAN Card",
                                "Voter ID",
                                "Passport",
                                "Driving License",
                            ]}
                        />

                        <Select
                            label="Please select business type"
                            value={selectedBusinessType ? [selectedBusinessType] : []}
                            onValueChange={(details: any) => {
                                console.log('📋 Business type selected details:', details);
                                const value = details.value?.[0] || details.value || '';
                                console.log('📋 Business type selected value:', value);
                                setSelectedBusinessType(value);
                            }}
                            items={[
                                "New Business",
                            ]}
                        />

                        <Select
                            label="Please select channel type"
                            value={selectedChannelType ? [selectedChannelType] : []}
                            onValueChange={(details: any) => {
                                console.log('📋 Channel type selected details:', details);
                                const value = details.value?.[0] || details.value || '';
                                console.log('📋 Channel type selected value:', value);
                                setSelectedChannelType(value);
                            }}
                            items={[
                                "MFI",
                                "SHG",
                            ]}
                        />

                        <Upload
                            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            allowDrop
                            buttonLabel={uploadLoading ? "Uploading..." : "Choose Excel File"}
                            label={`Upload Raw Loader Data${selectedDocumentType ? ` - ${selectedDocumentType}` : ''}${selectedBusinessType ? ` - ${selectedBusinessType}` : ''}${selectedChannelType ? ` - ${selectedChannelType}` : ''}`}
                            minFileSize={1024}
                            maxFileSize={10 * 1024 * 1024} // 10MB
                            size="lg"
                            variant="extended"
                            disabled={uploadLoading || !selectedDocumentType || !selectedBusinessType || !selectedChannelType}
                            helperText={{
                                message: (!selectedDocumentType || !selectedBusinessType || !selectedChannelType)
                                    ? "Please select all required fields first"
                                    : "Only Excel files (.xls, .xlsx) are allowed (1KB - 10MB)"
                            }}
                            onFileAccept={handleFileAccept}
                            onFileChange={handleFileChange}
                            onFileReject={handleFileReject}
                            validate={validateFile}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
