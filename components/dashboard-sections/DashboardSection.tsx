import React from 'react';
import {
    Button,
    Flex,
    IconButton,
    Pagination,
    ScrollArea,
    Select,
    Table,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Text,
    Upload,
} from "@hdfclife-insurance/one-x-ui";
import { uploadFile, fetchPartners, fetchLoaderConfigs, downloadFile } from '@/services/config.upload';
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    ArrowsDownUp,
    Article,
} from "@phosphor-icons/react";
import {
    FilterFn,
    PaginationState,
    SortingState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

declare module "@tanstack/react-table" {
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
        itemRank,
    });
    return itemRank.passed;
};

type LoaderConfig = {
    id: string;
    configId: string;
    createdAt: string;
    loaderType: string;
    uploaderName: string;
    excelFileId: string;
};

export default function DashboardSection() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [selectedDocumentType, setSelectedDocumentType] = React.useState<string>('');
    const [uploadLoading, setUploadLoading] = React.useState(false);
    const [partners, setPartners] = React.useState<{ id: number, name: string }[]>([]);
    const [partnersLoading, setPartnersLoading] = React.useState(false);
    const [tableData, setTableData] = React.useState<LoaderConfig[]>([]);
    const [tableLoading, setTableLoading] = React.useState(false);
    const [selectedPartnerId, setSelectedPartnerId] = React.useState<string>('');

    // Fetch partners on component mount
    React.useEffect(() => {
        const loadPartners = async () => {
            setPartnersLoading(true);
            try {
                console.log('📋 Fetching partners from API...');
                const response = await fetchPartners();
                console.log('✅ Partners fetched successfully:', response);

                if (response.success && response.partners) {
                    // Filter out any invalid partners
                    const validPartners = response.partners.filter(
                        (partner: any) => partner && partner.name && partner.id
                    );
                    setPartners(validPartners);
                } else {
                    console.warn('⚠️ No partners found in response');
                    setPartners([]);
                }
            } catch (error: any) {
                console.error('❌ Error fetching partners:', error);
                // Fallback to default options if API fails
                setPartners([
                    { id: 1, name: "Default Partner 1" },
                    { id: 2, name: "Default Partner 2" }
                ]);
            } finally {
                setPartnersLoading(false);
            }
        };

        loadPartners();
    }, []);

    // Function to load loader configurations for selected partner
    const loadLoaderConfigs = React.useCallback(async (partnerId: string) => {
        if (!partnerId) {
            setTableData([]);
            return;
        }

        setTableLoading(true);
        try {
            console.log(`📋 Loading configs for partner ${partnerId}...`);
            const response = await fetchLoaderConfigs(partnerId);

            if (response.success && response.configs) {
                setTableData(response.configs);
                console.log('✅ Loader configs loaded successfully:', response.configs);
            } else {
                console.warn('⚠️ No configs found in response');
                setTableData([]);
            }
        } catch (error: any) {
            console.error('❌ Error loading loader configs:', error);
            setTableData([]);
            // You could show a toast/alert here instead of console.error
        } finally {
            setTableLoading(false);
        }
    }, []);

    // Load configs when partner is selected
    React.useEffect(() => {
        if (selectedPartnerId) {
            loadLoaderConfigs(selectedPartnerId);
        }
    }, [selectedPartnerId, loadLoaderConfigs]);

    // File upload handlers with API integration
    const handleFileAccept = React.useCallback(async (details: any) => {
        console.log('🟢 File accepted - details:', details);
        console.log('🟢 File accepted - type:', typeof details);
        console.log('🟢 File accepted - keys:', Object.keys(details || {}));

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
            alert('❌ Please select a partner before uploading');
            return;
        }

        setUploadLoading(true);
        try {
            console.log('📤 Uploading file to API:', {
                fileName: file.name,
                fileSize: file.size,
                documentType: selectedDocumentType
            });

            const response = await uploadFile(file, selectedDocumentType);
            console.log('✅ Upload API response:', response);
            alert(`✅ File "${file.name}" uploaded successfully to server!`);
        } catch (error: any) {
            console.error('❌ Upload API error:', error);
            alert(`❌ Upload failed: ${error.message || 'Unknown error'}`);
        } finally {
            setUploadLoading(false);
        }
    }, [selectedDocumentType]);

    const handleFileChange = React.useCallback((details: any) => {
        console.log('🔄 File changed - details:', details);
        console.log('🔄 File changed - type:', typeof details);
        console.log('🔄 File changed - keys:', Object.keys(details || {}));

        // Simple alert to confirm it's working
        alert('📄 File selection changed!');
    }, []);

    const handleFileReject = React.useCallback((details: any) => {
        console.log('🔴 File rejected - details:', details);
        console.log('🔴 File rejected - type:', typeof details);
        console.log('🔴 File rejected - keys:', Object.keys(details || {}));

        let errorMessage = 'File validation failed';

        if (details?.files?.[0]?.errors?.[0]?.message) {
            errorMessage = details.files[0].errors[0].message;
        } else if (details?.file?.errors?.[0]?.message) {
            errorMessage = details.file.errors[0].message;
        } else if (details?.errors?.[0]?.message) {
            errorMessage = details.errors[0].message;
        }

        alert(`❌ File rejected: ${errorMessage}`);
    }, []);

    // Simplified validation function
    const validateFile = React.useCallback((file: File, details?: any) => {
        console.log('🔍 Validating file:', file.name, 'Size:', file.size, 'Type:', file.type);
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
        if (file.size < 1024) { // Reduced to 1KB for testing
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

        console.log('🔍 Validation result:', errors.length === 0 ? 'PASSED' : 'FAILED', 'Errors:', errors);
        return errors.length > 0 ? errors : null;
    }, []);

    const columnHelper = createColumnHelper<LoaderConfig>();

    const columns = [
        columnHelper.accessor("createdAt", {
            header: "Date",
            cell: (info) => {
                const date = new Date(info.getValue());
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            },
            enableSorting: true,
        }),
        columnHelper.accessor("id", {
            header: "Loader Id",
            cell: (info) => info.getValue().substring(0, 8) + '...', // Show first 8 chars
            enableSorting: true,
        }),
        columnHelper.accessor("configId", {
            header: "Template Name",
            cell: (info) => {
                const configId = info.getValue();
                // Extract template name from configId (after partnerId_)
                const parts = configId.split('_');
                return parts.length > 2 ? parts.slice(1, -1).join('_') : configId;
            },
            enableSorting: true,
        }),
        columnHelper.accessor("loaderType", {
            header: "Loader Type",
            cell: (info) => (
                <Button
                    variant="link-underline"
                    color="primary"
                    className="font-normal"
                    // endIcon={<Article />}
                    size="sm"
                >
                    {info.getValue()}
                </Button>
            ),
            enableSorting: true,
        }),
        columnHelper.accessor("uploaderName", {
            header: "Uploaded By",
            cell: (info) => (
                <Text size="sm" className="font-medium">
                    {info.getValue()}
                </Text>
            ),
            enableSorting: true,
        }),
        columnHelper.display({
            id: "action",
            header: "Action",
            cell: (info) => (
                <Button
                    variant="secondary"
                    color="primary"
                    size="sm"
                    onClick={async () => {
                        const rowData = info.row.original;
                        console.log('Download clicked for:', rowData);

                        if (!rowData.excelFileId) {
                            alert('❌ No file ID found for download');
                            return;
                        }

                        try {
                            console.log('📥 Downloading file with ID:', rowData.excelFileId);
                            await downloadFile(rowData.excelFileId);
                            // Success message is handled in the downloadFile function
                        } catch (error: any) {
                            console.error('❌ Download failed:', error);
                            alert(`❌ Download failed: ${error.message || 'Unknown error'}`);
                        }
                    }}
                >
                    Download
                </Button>
            ),
        }),
    ];

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        globalFilterFn: fuzzyFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination,
            sorting,
        },
    });

    const [loading, setLoading] = React.useState(false);

    const handleConfigSubmit = async () => {
        setLoading(true);
        try {

        } catch (error: any) {
        }
    }

    return (
        <div>
            <div className="">
                <div className='w-1/4 mb-4'>
                    <Select
                        label="Please select your partner"
                        value={selectedDocumentType ? [selectedDocumentType] : []}
                        onValueChange={(details: any) => {
                            console.log('📋 Partner selected details:', details);
                            const value = details.value?.[0] || details.value || '';
                            console.log('📋 Partner selected value:', value);
                            setSelectedDocumentType(value);

                            // Find the selected partner's ID
                            const selectedPartner = partners.find(partner => partner.name === value);
                            if (selectedPartner) {
                                console.log('🎯 Selected partner ID:', selectedPartner.id);
                                setSelectedPartnerId(selectedPartner.id.toString());
                            } else {
                                setSelectedPartnerId('');
                            }
                        }}
                        items={partnersLoading
                            ? [{ label: "Loading partners...", value: "loading" }]
                            : partners
                                .filter(partner => partner && partner.name) // Filter out null/undefined partners
                                .map(partner => ({
                                    label: partner.name,
                                    value: partner.name
                                }))
                        }
                        disabled={partnersLoading}
                    />
                    {partnersLoading && (
                        <div className="text-sm text-gray-500 mt-1">
                            🔄 Loading partners...
                        </div>
                    )}
                    {!partnersLoading && partners.length === 0 && (
                        <div className="text-sm text-red-500 mt-1">
                            ❌ No partners available
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    {/* UI Library Upload Componevnt */}
                    <Upload
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        allowDrop
                        buttonLabel={uploadLoading ? "Uploading..." : "Choose Excel File"}
                        label={`Upload Excel File${selectedDocumentType ? ` - ${selectedDocumentType}` : ''}`}
                        minFileSize={1024} // 1KB for testing
                        maxFileSize={10 * 1024 * 1024} // 10MB
                        size="lg"
                        variant="extended"
                        disabled={uploadLoading || !selectedDocumentType || partnersLoading}
                        helperText={{
                            message: !selectedDocumentType
                                ? "Please select a partner first"
                                : "Only Excel files (.xls, .xlsx) are allowed (1KB - 10MB)"
                        }}
                        onFileAccept={handleFileAccept}
                        onFileChange={handleFileChange}
                        onFileReject={handleFileReject}
                        validate={validateFile}
                    />
                </div>
            </div>

            <div className="mt-7 space-y-3">
                <h1 className='text-[20px] text-[#005E9E] font-bold'>Loaders</h1>

                <Tabs size="sm" defaultValue="fr" variant="underline">
                    {/* <ScrollArea>
                        <TabsList>
                            <TabsTrigger value="member">Member Details</TabsTrigger>
                            <TabsTrigger value="claim">Claim Details</TabsTrigger>
                            <TabsTrigger value="fr">FR</TabsTrigger>
                        </TabsList>
                    </ScrollArea> */}

                    <TabsContent value="fr">
                        {tableLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Text size="sm" className="text-gray-500">
                                    🔄 Loading loader configurations...
                                </Text>
                            </div>
                        ) : tableData.length === 0 ? (
                            <div className="flex justify-center items-center py-8">
                                <Text size="sm" className="text-gray-500">
                                    {selectedPartnerId ? '📄 No loader configurations found for this partner' : '📊 Please select a partner to view loader configurations'}
                                </Text>
                            </div>
                        ) : (
                            <Table.ScrollContainer type="always">
                                <Table withTableBorder>
                                    <Table.Head>
                                        {table.getHeaderGroups().map((headerGroup, i) => (
                                            <Table.Row key={i}>
                                                {headerGroup.headers.map((header, i) => (
                                                    <Table.Th key={i} className="!py-4 bg-indigo-50">
                                                        {header.isPlaceholder ? null : (
                                                            <Flex gap={1} align="center">
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext(),
                                                                )}
                                                                {header.column.getCanSort() && (
                                                                    <IconButton
                                                                        variant="link"
                                                                        color="gray"
                                                                        size="xs"
                                                                        onClick={header.column.getToggleSortingHandler()}
                                                                    >
                                                                        {header.column.getIsSorted() === "asc" ? (
                                                                            <ArrowUp />
                                                                        ) : header.column.getIsSorted() === "desc" ? (
                                                                            <ArrowDown />
                                                                        ) : (
                                                                            <ArrowsDownUp />
                                                                        )}
                                                                    </IconButton>
                                                                )}
                                                            </Flex>
                                                        )}
                                                    </Table.Th>
                                                ))}
                                            </Table.Row>
                                        ))}
                                    </Table.Head>
                                    <Table.Body>
                                        {table.getRowModel().rows.map((row, i) => (
                                            <Table.Row key={i}>
                                                {row.getVisibleCells().map((cell, cellIndex) => (
                                                    <Table.Cell key={cellIndex} className="!py-4">
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </Table.Cell>
                                                ))}
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Table.ScrollContainer>
                        )}

                        {!tableLoading && tableData.length > 0 && (
                            <Flex justify="flex-end" className="mt-3">
                                <Pagination
                                    count={tableData.length}
                                    onPrevious={() => table.previousPage()}
                                    onNext={() => table.nextPage()}
                                    pageSize={pagination.pageSize}
                                    onPageChange={(details: { page: number }) =>
                                        table.setPageIndex(details.page - 1)
                                    }
                                />
                            </Flex>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}