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
import { uploadFile, fetchPartners } from '@/services/config.upload';
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

type User = {
    raisedOn: string;
    frTitle: string;
    frSubType: string;
    frDescription: string;
};

const tableData: User[] = [
    {
        raisedOn: "31/07/2024",
        frTitle: "Data correction",
        frSubType: "Data correction",
        frDescription: "Customer date of birth needs to be updated",
    },
    {
        raisedOn: "30/07/2024",
        frTitle: "Address change",
        frSubType: "Address change",
        frDescription: "Update permanent residence address",
    },
    {
        raisedOn: "29/07/2024",
        frTitle: "Name correction",
        frSubType: "Name correction",
        frDescription: "Spelling correction in customer name",
    },
    {
        raisedOn: "28/07/2024",
        frTitle: "Contact update",
        frSubType: "Contact update",
        frDescription: "Mobile number needs to be changed",
    },
    {
        raisedOn: "27/07/2024",
        frTitle: "Bank details",
        frSubType: "Bank details",
        frDescription: "Update bank account information",
    },
    {
        raisedOn: "26/07/2024",
        frTitle: "Document upload",
        frSubType: "Document upload",
        frDescription: "New KYC documents pending",
    },
    {
        raisedOn: "25/07/2024",
        frTitle: "Premium payment",
        frSubType: "Premium payment",
        frDescription: "Change in premium payment mode",
    },
];

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

    // Fetch partners on component mount
    React.useEffect(() => {
        const loadPartners = async () => {
            setPartnersLoading(true);
            try {
                console.log('📋 Fetching partners from API...');
                const response = await fetchPartners();
                console.log('✅ Partners fetched successfully:', response);

                if (response.success && response.partners) {
                    setPartners(response.partners);
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

    const columnHelper = createColumnHelper<User>();

    const columns = [
        columnHelper.accessor("raisedOn", {
            header: "Raised On",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("frTitle", {
            header: "FR Title",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("frSubType", {
            header: "FR Sub Type",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("frDescription", {
            header: "FR Description",
            cell: (info) => (
                <Button
                    variant="link-underline"
                    color="blue"
                    className="font-normal"
                    endIcon={<Article />}
                    size="sm"
                >
                    {info.getValue()}
                </Button>
            ),
            enableSorting: true,
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
                        }}
                        items={partnersLoading ? ["Loading partners..."] : partners.map(partner => partner.name)}
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
                    {/* UI Library Upload Component */}
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}