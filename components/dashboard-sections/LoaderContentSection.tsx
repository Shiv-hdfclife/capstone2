"use client";

import {
    Button,
    Checkbox,
    Flex,
    IconButton,
    Pagination,
    ScrollArea,
    Search,
    Select,
    Table,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Text,
    colors,
} from "@hdfclife-insurance/one-x-ui";
import {
    ArrowDown,
    ArrowUp,
    ArrowsDownUp,
    ArrowLeft,
} from "@phosphor-icons/react";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
    Column,
    FilterFn,
    PaginationState,
    type Table as ReactTable,
    SortingState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import React, { CSSProperties } from "react";
import {
    fetchLoaderContent,
    fetchMemberRecords,
    fetchIssuedRecords,
    fetchRejectedRecords,
    type LoaderContent,
    type MemberRecord,
} from "../../services/loaderContentApi";
import { useAppDispatch } from '../../store/hooks';
import { clearLoaderContent } from '../../store/slices/sidebarSlice';

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
    addMeta({ itemRank });
    return itemRank.passed;
};

const getCommonPinningStyles = (
    column: Column<MemberRecord>
): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
        isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn =
        isPinned === "right" && column.getIsFirstColumn("right");
    return {
        left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
        right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? "sticky" : "relative",
        width: column.getSize(),
        boxShadow: isLastLeftPinnedColumn
            ? `-4px 0 4px -4px ${colors.neutral.grey[200]} inset`
            : isFirstRightPinnedColumn
                ? `-4px 0px 4px 0px ${colors.neutral.grey[200]}`
                : undefined,
        background: "white",
        zIndex: isPinned ? 1 : 0,
    };
};

interface LoaderContentSectionProps {
    loaderId: string;
}

export default function LoaderContentSection({ loaderId }: LoaderContentSectionProps) {
    const dispatch = useAppDispatch();

    // States for loader details
    const [loaderData, setLoaderData] = React.useState<LoaderContent | null>(
        null
    );
    const [loadingLoader, setLoadingLoader] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // States for tabs and tables
    const [activeTab, setActiveTab] = React.useState("all");
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = React.useState("");

    // Separate data states for all three tabs
    const [allData, setAllData] = React.useState<MemberRecord[]>([]);
    const [allCount, setAllCount] = React.useState(0);
    const [allLoading, setAllLoading] = React.useState(false);

    const [issuedData, setIssuedData] = React.useState<MemberRecord[]>([]);
    const [issuedCount, setIssuedCount] = React.useState(0);
    const [issuedLoading, setIssuedLoading] = React.useState(false);

    const [rejectedData, setRejectedData] = React.useState<MemberRecord[]>([]);
    const [rejectedCount, setRejectedCount] = React.useState(0);
    const [rejectedLoading, setRejectedLoading] = React.useState(false);

    // Load loader details
    React.useEffect(() => {
        const loadLoaderDetails = async () => {
            try {
                setLoadingLoader(true);
                const loader = await fetchLoaderContent(loaderId);
                setLoaderData(loader);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load loader");
            } finally {
                setLoadingLoader(false);
            }
        };

        if (loaderId) {
            loadLoaderDetails();
        }
    }, [loaderId]);

    // Load all records
    const loadAllRecords = React.useCallback(async () => {
        if (!loaderId || !loaderData) return;

        setAllLoading(true);
        try {
            const response = await fetchMemberRecords(
                loaderId,
                pagination.pageIndex + 1,
                pagination.pageSize,
                globalFilter
            );
            setAllData(response.data);
            setAllCount(response.total);
        } catch (error) {
            console.error("Failed to fetch all records:", error);
            setAllData([]);
            setAllCount(0);
        } finally {
            setAllLoading(false);
        }
    }, [
        loaderId,
        loaderData,
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
    ]);

    // Load issued records
    const loadIssuedRecords = React.useCallback(async () => {
        if (!loaderId || !loaderData) return;

        setIssuedLoading(true);
        try {
            const response = await fetchIssuedRecords(
                loaderId,
                pagination.pageIndex + 1,
                pagination.pageSize,
                globalFilter
            );
            setIssuedData(response.data);
            setIssuedCount(response.total);
        } catch (error) {
            console.error("Failed to fetch issued records:", error);
            setIssuedData([]);
            setIssuedCount(0);
        } finally {
            setIssuedLoading(false);
        }
    }, [
        loaderId,
        loaderData,
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
    ]);

    // Load rejected records
    const loadRejectedRecords = React.useCallback(async () => {
        if (!loaderId || !loaderData) return;

        setRejectedLoading(true);
        try {
            const response = await fetchRejectedRecords(
                loaderId,
                pagination.pageIndex + 1,
                pagination.pageSize,
                globalFilter
            );
            setRejectedData(response.data);
            setRejectedCount(response.total);
        } catch (error) {
            console.error("Failed to fetch rejected records:", error);
            setRejectedData([]);
            setRejectedCount(0);
        } finally {
            setRejectedLoading(false);
        }
    }, [
        loaderId,
        loaderData,
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
    ]);

    // Load data based on active tab
    React.useEffect(() => {
        if (activeTab === "all") {
            loadAllRecords();
        } else if (activeTab === "issued") {
            loadIssuedRecords();
        } else if (activeTab === "rejected") {
            loadRejectedRecords();
        }
    }, [activeTab, loadAllRecords, loadIssuedRecords, loadRejectedRecords]);

    // Reset pagination when tab changes
    React.useEffect(() => {
        setPagination({ pageIndex: 0, pageSize: 10 });
    }, [activeTab]);

    // Get current data based on active tab
    const getCurrentData = () => {
        switch (activeTab) {
            case "issued":
                return { data: issuedData, count: issuedCount, loading: issuedLoading };
            case "rejected":
                return {
                    data: rejectedData,
                    count: rejectedCount,
                    loading: rejectedLoading,
                };
            case "all":
            default:
                return { data: allData, count: allCount, loading: allLoading };
        }
    };

    const {
        data: currentData,
        count: currentCount,
        loading: currentLoading,
    } = getCurrentData();

    // Column definition
    const columnHelper = createColumnHelper<MemberRecord>();
    const columns = [
        {
            id: "select",
            header: ({ table }: { table: ReactTable<MemberRecord> }) => (
                <Checkbox
                    checked={
                        table.getIsAllRowsSelected()
                            ? true
                            : table.getIsSomeRowsSelected()
                                ? "indeterminate"
                                : false
                    }
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }: any) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        },
        columnHelper.accessor("rcd", {
            header: "RCD",
            cell: (info) => {
                const dateValue = info.getValue();
                if (!dateValue) return "-";

                try {
                    const date = new Date(dateValue);
                    return isNaN(date.getTime()) ? dateValue : date.toLocaleDateString();
                } catch {
                    return dateValue;
                }
            },
            enableSorting: true,
        }),
        columnHelper.accessor("lan", {
            header: "LAN",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("memberName", {
            header: "Member Name",
            cell: (info) => info.getValue(),
            enableSorting: true,
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("lifeFlag", {
            header: "Life Flag",
            cell: (info) => info.getValue() || "-",
            enableSorting: true,
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${info.getValue() === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : info.getValue() === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : info.getValue() === "Issued"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                        }`}
                >
                    {info.getValue()}
                </span>
            ),
            enableSorting: true,
        }),
        columnHelper.accessor("reason", {
            header: "Reason",
            cell: (info) => info.getValue() || "-",
            enableSorting: false,
        }),
        columnHelper.accessor("sum", {
            header: "Sum Assured",
            cell: (info) => `₹${info.getValue().toLocaleString()}`,
            enableSorting: true,
        }),
        columnHelper.accessor("policyNo", {
            header: "Policy No",
            cell: (info) => info.getValue() || "-",
            enableSorting: true,
        }),
        {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: () => (
                <Button size="sm" variant="link" color="blue">
                    View
                </Button>
            ),
        },
    ];

    // Table setup
    const table = useReactTable({
        data: currentData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        manualPagination: true,
        pageCount: Math.ceil(currentCount / pagination.pageSize),
        onPaginationChange: setPagination,
        filterFns: { fuzzy: fuzzyFilter },
        globalFilterFn: fuzzyFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination,
            columnPinning: { right: ["actions"] },
            sorting,
            rowSelection,
        },
    });

    // Loading states
    if (loadingLoader) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Text>Loading loader content...</Text>
            </div>
        );
    }

    if (error || !loaderData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Text color="red">{error || "Loader not found"}</Text>
                    <Button
                        onClick={() => dispatch(clearLoaderContent())}
                        className="mt-4"
                    >
                        Back to Services
                    </Button>
                </div>
            </div>
        );
    }

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        // Reset pagination when switching tabs
        setPagination({ pageIndex: 0, pageSize: 10 });
        // Reset row selection
        setRowSelection({});
    };

    const handleBackClick = () => {
        dispatch(clearLoaderContent());
    };

    return (
        <div className="min-h-dvh flex flex-col p-6 bg-gray-100">
            {/* Back Button */}
            <Flex align="center" gap="md" className="mb-4">
                <Button
                    variant="tertiary"
                    onClick={handleBackClick}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Services
                </Button>
            </Flex>

            {/* Loader Header Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <Flex justify="between" align="center" className="mb-4">
                    <div>
                        <Text size="xl" fontWeight="bold" className="text-[#30619c]">
                            {loaderData.name}
                        </Text>
                        <Text size="sm" color="gray">
                            {loaderData.partner} • {loaderData.loaderType} •{" "}
                            {new Date(loaderData.uploadDate).toLocaleDateString()}
                        </Text>
                    </div>
                </Flex>

                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Text size="sm" color="gray">
                            Total Members
                        </Text>
                        <Text fontWeight="bold" size="lg">
                            {loaderData.totalMembers}
                        </Text>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Text size="sm" color="gray">
                            Issued
                        </Text>
                        <Text fontWeight="bold" size="lg" color="green">
                            {loaderData.issuedMembers || 0}
                        </Text>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Text size="sm" color="gray">
                            Rejected
                        </Text>
                        <Text fontWeight="bold" size="lg" color="red">
                            {loaderData.rejectedMembers}
                        </Text>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <form className="space-y-1">
                <div className="grid lg:grid-cols-4 gap-4 items-end">
                    <Select label="View by" items={["All Partners"]} name="partner" />
                    <Select items={["All Jobs", "All Policies"]} name="policies" />
                    <Select items={["All policies"]} name="policies2" />
                    <Button variant="tertiary" type="reset">
                        Reset
                    </Button>
                </div>
            </form>

            <div className="flex mt-4">
                <Search
                    placeholder="Search all columns..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <Button>Search</Button>
            </div>

            {/* Table Section - All, Issued & Rejected Tabs */}
            <div className="mt-7 space-y-3">
                <div className="flex justify-between items-center text-[#30619c]">
                    <Text fontWeight="semibold" size="xl" className="text-primary-blue">
                        Case records
                    </Text>
                    <Button>Add EMIF</Button>
                </div>

                <Tabs
                    size="sm"
                    value={activeTab}
                    onValueChange={(details) => handleTabChange(details.value)}
                    variant="underline"
                >
                    <ScrollArea>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="issued">Issued</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        </TabsList>
                    </ScrollArea>

                    <div className="mt-2 text-sm text-gray-500">
                        Results: {currentCount}
                    </div>

                    {/* Tab Content */}
                    <TabsContent value={activeTab}>
                        <Table.ScrollContainer type="always">
                            <Table withTableBorder>
                                <Table.Head>
                                    {table.getHeaderGroups().map((headerGroup, i) => (
                                        <Table.Row key={i}>
                                            {headerGroup.headers.map((header, i) => (
                                                <Table.Th
                                                    key={i}
                                                    className="!py-4 bg-indigo-50"
                                                    style={getCommonPinningStyles(header.column)}
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <Flex gap={1} align="center">
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
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
                                    {currentLoading ? (
                                        <Table.Row>
                                            <td colSpan={columns.length} className="text-center py-8">
                                                Loading {activeTab} records...
                                            </td>
                                        </Table.Row>
                                    ) : table.getRowModel().rows.length > 0 ? (
                                        table.getRowModel().rows.map((row, i) => (
                                            <Table.Row key={i}>
                                                {row.getVisibleCells().map((cell, cellIndex) => (
                                                    <Table.Cell
                                                        key={cellIndex}
                                                        className="!py-4"
                                                        style={getCommonPinningStyles(cell.column)}
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </Table.Cell>
                                                ))}
                                            </Table.Row>
                                        ))
                                    ) : (
                                        <Table.Row>
                                            <td colSpan={columns.length} className="text-center py-8">
                                                No {activeTab} records found
                                            </td>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </Table.ScrollContainer>

                        <Flex justify="flex-end" className="mt-3">
                            <Pagination
                                count={currentCount}
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