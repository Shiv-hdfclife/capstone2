// "use client";

// import {
//     Button,
//     Checkbox,
//     Flex,
//     IconButton,
//     Pagination,
//     Search,
//     Select,
//     Table,
//     Tabs,
//     TabsContent,
//     Text,
//     colors,
// } from "@hdfclife-insurance/one-x-ui";
// import { ArrowDown, ArrowUp, ArrowsDownUp } from "@phosphor-icons/react";
// import {fetchRawLoaders, type RawLoader} from "@/services/rawLoaderApi";
// import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
// import {
//     Column,
//     FilterFn,
//     PaginationState,
//     type Table as ReactTable,
//     SortingState,
//     createColumnHelper,
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import React, { CSSProperties } from "react";

// declare module "@tanstack/react-table" {
//     interface FilterFns {
//         fuzzy: FilterFn<unknown>;
//     }
//     interface FilterMeta {
//         itemRank: RankingInfo;
//     }
// }

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//     const itemRank = rankItem(row.getValue(columnId), value);
//     addMeta({
//         itemRank,
//     });

//     return itemRank.passed;
// };

// // Use RawLoader type instead of User
// const getCommonPinningStyles = (column: Column<RawLoader>): CSSProperties => {
//     const isPinned = column.getIsPinned();
//     const isLastLeftPinnedColumn =
//         isPinned === "left" && column.getIsLastColumn("left");
//     const isFirstRightPinnedColumn =
//         isPinned === "right" && column.getIsFirstColumn("right");
//     return {
//         left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
//         right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
//         opacity: isPinned ? 0.95 : 1,
//         position: isPinned ? "sticky" : "relative",
//         width: column.getSize(),
//         boxShadow: isLastLeftPinnedColumn
//             ? `-4px 0 4px -4px ${colors.neutral.grey[200]}  inset`
//             : isFirstRightPinnedColumn
//                 ? `-4px 0px 4px 0px ${colors.neutral.grey[200]}`
//                 : undefined,
//         background: "white",
//         zIndex: isPinned ? 1 : 0,
//     };
// };

// export default function DashboardTable() {
//     const [sorting, setSorting] = React.useState<SortingState>([]);
//     const [rowSelection, setRowSelection] = React.useState({});
//     const [loading, setLoading] = React.useState(false);

//     const [pagination, setPagination] = React.useState<PaginationState>({
//         pageIndex: 0,
//         pageSize: 10,
//     });
//     const columnHelper = createColumnHelper<RawLoader>();

//     const columns = [
//         {
//             id: "select",
//             header: ({ table }: { table: ReactTable<RawLoader> }) => (
//                 <Checkbox
//                     checked={
//                         table.getIsAllRowsSelected()
//                             ? true
//                             : table.getIsSomeRowsSelected()
//                                 ? "indeterminate"
//                                 : false
//                     }
//                     onChange={table.getToggleAllRowsSelectedHandler()}
//                 />
//             ),
//             cell: ({ row }: any) => (
//                 <Checkbox
//                     checked={row.getIsSelected()}
//                     onChange={row.getToggleSelectedHandler()}
//                 />
//             ),
//         },
//         columnHelper.accessor("Date", {
//             header: "Date",
//             cell: (info) => {
//                 const dateValue = info.getValue();
//                 try {
//                     return new Date(dateValue).toLocaleDateString();
//                 } catch {
//                     return dateValue;
//                 }
//             },
//             enableSorting: true,
//         }),
//         columnHelper.accessor("LoaderID", {
//             header: "Loader ID",
//             cell: (info) => info.getValue(),
//             enableSorting: true,
//         }),
//         columnHelper.accessor("LoaderName", {
//             header: "Loader Name",
//             cell: (info) => info.getValue(),
//             enableSorting: true,
//             filterFn: "fuzzy",
//         }),
//         columnHelper.accessor("LoaderType", {
//             header: "Loader Type",
//             cell: (info) => info.getValue(),
//             enableSorting: true,
//         }),
//         columnHelper.accessor("TotalMembers", {
//             header: "Total Members",
//             cell: (info) => info.getValue(),
//             enableSorting: true,
//         }),
//         columnHelper.accessor("Partner", {
//             header: "Partner",
//             cell: (info) => info.getValue(),
//             enableSorting: true,
//         }),
//         columnHelper.accessor("Pending", {
//             header: "Pending",
//             cell: (info) => info.getValue(),
//             enableSorting: true,
//         }),
//         columnHelper.accessor("Status", {
//             header: "Status",
//             cell: (info) => (
//                 <span className={`px-2 py-1 rounded text-xs ${
//                     info.getValue() === 'imported' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                     {info.getValue()}
//                 </span>
//             ),
//             enableSorting: true,
//         }),
//         columnHelper.accessor("actions", {
//             id: "action",
//             header: "Actions",
//             enableSorting: false,
//             cell: (info) => (
//                 <Flex gap={2}>
//                     <Button size="sm" variant="link" color="blue">
//                         Download
//                     </Button>
//                 </Flex>
//             ),
//         }),
//     ];

//     const [tableData, setTableData] = React.useState<RawLoader[]>([]);
//     const [totalCount, setTotalCount] = React.useState(0);
//     const [globalFilter, setGlobalFilter] = React.useState("");

//     // Fix the useEffect - Correct API call
//     React.useEffect(() => {
//         async function fetchLoaders() {
//             setLoading(true);
//             try {
//                 const response = await fetchRawLoaders(
//                     pagination.pageIndex + 1,
//                     pagination.pageSize,
//                     globalFilter
//                 );
//                 setTableData(response.data);
//                 setTotalCount(response.total);
//             } catch (error) {
//                 console.error("Failed to fetch raw loaders:", error);
//                 setTableData([]);
//                 setTotalCount(0);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchLoaders();
//     }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

//     const table = useReactTable({
//         data: tableData,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         onSortingChange: setSorting,
//         onRowSelectionChange: setRowSelection,
//         enableRowSelection: true,
//         manualPagination: true,
//         pageCount: Math.ceil(totalCount / pagination.pageSize),
//         onPaginationChange: setPagination,
//         filterFns: {
//             fuzzy: fuzzyFilter,
//         },
//         globalFilterFn: fuzzyFilter,
//         getFilteredRowModel: getFilteredRowModel(),
//         state: {
//             pagination,
//             columnPinning: {
//                 right: ["action"],
//             },
//             sorting,
//             rowSelection,
//         },
//     });

//     return (
//         <div className="min-h-dvh flex flex-col bg-gray-100 [--gutter:24px] [--header-height:68px]">
//             <div>
//                 <form className="space-y-1">
//                     <div className="grid lg:grid-cols-4 gap-4 items-end">
//                         <Select label="View by" items={["All Partners"]} name="partner" />
//                         <Select items={["All Loader Types"]} name="policies" />
//                         <Button variant="tertiary" type="reset">
//                             Reset
//                         </Button>
//                     </div>
//                     <div className="flex space-x-4">
//                         <Search 
//                             placeholder="Search by Partner, Loader name, Loader ID, Loader type or Uploaded by"
//                             value={globalFilter}
//                             onChange={(e) => setGlobalFilter(e.target.value)}
//                         />
//                         <Button>Search</Button>
//                     </div>
//                 </form>
//                 <div className="mt-7 space-y-3">
//                     <div className="flex justify-between items-center text-[#30619c]">
//                         <Text fontWeight="semibold" size="xl" className="text-primary-blue">
//                             Loaders
//                         </Text>
//                     </div>
//                     <Tabs size="sm" defaultValue="nb" variant="underline">
//                         <TabsContent value="nb">
//                             <Table.ScrollContainer type="always">
//                                 <Table withTableBorder>
//                                     <Table.Head>
//                                         {table.getHeaderGroups().map((headerGroup, i) => (
//                                             <Table.Row key={i}>
//                                                 {headerGroup.headers.map((header, i) => (
//                                                     <Table.Th
//                                                         key={i}
//                                                         className="!py-4 bg-indigo-50"
//                                                         style={{
//                                                             ...getCommonPinningStyles(header.column),
//                                                         }}
//                                                     >
//                                                         {header.isPlaceholder ? null : (
//                                                             <Flex gap={1} align="center">
//                                                                 {flexRender(
//                                                                     header.column.columnDef.header,
//                                                                     header.getContext()
//                                                                 )}
//                                                                 {header.column.getCanSort() && (
//                                                                     <IconButton
//                                                                         variant="link"
//                                                                         color="gray"
//                                                                         size="xs"
//                                                                         onClick={header.column.getToggleSortingHandler()}
//                                                                     >
//                                                                         {header.column.getIsSorted() === "asc" ? (
//                                                                             <ArrowUp />
//                                                                         ) : header.column.getIsSorted() ===
//                                                                             "desc" ? (
//                                                                             <ArrowDown />
//                                                                         ) : (
//                                                                             <ArrowsDownUp />
//                                                                         )}
//                                                                     </IconButton>
//                                                                 )}
//                                                             </Flex>
//                                                         )}
//                                                     </Table.Th>
//                                                 ))}
//                                             </Table.Row>
//                                         ))}
//                                     </Table.Head>
//                                     <Table.Body>
//                                         {loading ? (
//                                             <Table.Row>
//                                                 <Table.Cell {...{ colSpan: columns.length }} className="text-center py-8">
//                                                     Loading...
//                                                 </Table.Cell>
//                                             </Table.Row>
//                                         ) : table.getRowModel().rows.length > 0 ? (
//                                             table.getRowModel().rows.map((row, i) => (
//                                                 <Table.Row key={i}>
//                                                     {row.getVisibleCells().map((cell, cellIndex) => (
//                                                         <Table.Cell
//                                                             key={cellIndex}
//                                                             className="!py-4"
//                                                             style={{
//                                                                 ...getCommonPinningStyles(cell.column),
//                                                             }}
//                                                         >
//                                                             {flexRender(
//                                                                 cell.column.columnDef.cell,
//                                                                 cell.getContext()
//                                                             )}
//                                                         </Table.Cell>
//                                                     ))}
//                                                 </Table.Row>
//                                             ))
//                                         ) : (
//                                             <Table.Row>
//                                                 <Table.Cell {...{ colSpan: columns.length }} className="text-center py-8">
//                                                     No loaders found
//                                                 </Table.Cell>
//                                             </Table.Row>
//                                         )}
//                                     </Table.Body>
//                                 </Table>
//                             </Table.ScrollContainer>

//                             <Flex justify="flex-end" className="mt-3">
//                                 <Pagination
//                                     count={totalCount}
//                                     onPrevious={() => table.previousPage()}
//                                     onNext={() => table.nextPage()}
//                                     pageSize={pagination.pageSize}
//                                     onPageChange={(details: { page: number }) =>
//                                         table.setPageIndex(details.page - 1)
//                                     }
//                                 />
//                             </Flex>
//                         </TabsContent>
//                     </Tabs>
//                 </div>
//             </div>
//         </div>
//     );
// }




"use client";

import {
    Button,
    Checkbox,
    Flex,
    IconButton,
    Pagination,
    Search,
    Select,
    Table,
    Tabs,
    TabsContent,
    Text,
    colors,
} from "@hdfclife-insurance/one-x-ui";
import { ArrowDown, ArrowUp, ArrowsDownUp } from "@phosphor-icons/react";
import {
    fetchRawLoaders,
    downloadLoaderFile,
    type RawLoader,
} from "@/services/rawLoaderApi";
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
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import React, { CSSProperties } from "react";
import { useRouter } from "next/navigation";

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

const getCommonPinningStyles = (column: Column<RawLoader>): CSSProperties => {
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

export default function RawLoaderPage() {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [data, setData] = React.useState<RawLoader[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

    // Load data effect
    React.useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const response = await fetchRawLoaders(
                    pagination.pageIndex + 1,
                    pagination.pageSize,
                    globalFilter
                );
                setData(response.data);
                setTotalCount(response.total);
            } catch (error) {
                console.error("Failed to fetch raw loaders:", error);
                setData([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

    const handleLoaderClick = (loaderId: string, loaderName: string) => {
        console.log(`Navigating to loader: ${loaderName} (ID: ${loaderId})`);
        router.push(`/LoaderContent/${loaderId}`);
    };

    const handleDownload = async (loaderId: string, fileName: string) => {
        try {
            setDownloadingId(loaderId);
            await downloadLoaderFile(loaderId, fileName);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setDownloadingId(null);
        }
    };

    const columnHelper = createColumnHelper<RawLoader>();

    const columns = [
        {
            id: "select",
            header: ({ table }: { table: ReactTable<RawLoader> }) => (
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
        columnHelper.accessor("Date", {
            header: "Date",
            cell: (info) => new Date(info.getValue()).toLocaleDateString(),
            enableSorting: true,
        }),
        columnHelper.accessor("LoaderID", {
            header: "Loader ID",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("LoaderName", {
            header: "Loader Name",
            cell: (info) => (
                <button
                    onClick={() =>
                        handleLoaderClick(info.row.original.LoaderID, info.getValue())
                    }
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium transition-colors duration-200"
                >
                    {info.getValue()}
                </button>
            ),
            enableSorting: true,
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("LoaderType", {
            header: "Loader Type",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("TotalMembers", {
            header: "Total Members",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("Partner", {
            header: "Partner",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("Status", {
            // Add Status column
            header: "Status",
            cell: (info) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${info.getValue() === "imported"
                        ? "bg-green-100 text-green-800"
                        : info.getValue() === "partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {info.getValue()}
                </span>
            ),
            enableSorting: true,
        }),
        columnHelper.accessor("ErrorRows", {
            // Add Error Rows column instead of Pending
            header: "Error Rows",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("actions", {
            id: "action",
            header: "Actions",
            enableSorting: false,
            cell: (info) => (
                <Button
                    size="sm"
                    variant="link"
                    color="blue"
                    disabled={downloadingId === info.row.original.LoaderID}
                    onClick={() =>
                        handleDownload(
                            info.row.original.LoaderID,
                            info.row.original.LoaderName
                        )
                    }
                >
                    {downloadingId === info.row.original.LoaderID
                        ? "Downloading..."
                        : "Download"}
                </Button>
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        manualPagination: true,
        pageCount: Math.ceil(totalCount / pagination.pageSize),
        onPaginationChange: setPagination,
        filterFns: { fuzzy: fuzzyFilter },
        globalFilterFn: fuzzyFilter,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination,
            columnPinning: { right: ["action"] },
            sorting,
            rowSelection,
            globalFilter,
        },
    });

    return (
        <div className="min-h-dvh flex flex-col bg-gray-100 p-6">
            <div>
                <form className="space-y-4">
                    <div className="grid lg:grid-cols-4 gap-4 items-end">
                        <Select label="View by" items={["All Partners"]} name="partner" />
                        <Select items={["All Loader Types"]} name="policies" />
                        <Button variant="tertiary" type="reset">
                            Reset
                        </Button>
                    </div>
                    <div className="flex space-x-4">
                        <Search
                            placeholder="Search by Partner, Loader name, Loader ID, Loader type..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                        <Button type="button">Search</Button>
                    </div>
                </form>

                <div className="mt-7 space-y-3">
                    <div className="flex justify-between items-center text-[#30619c]">
                        <Text fontWeight="semibold" size="xl" className="text-primary-blue">
                            Raw Loaders
                        </Text>
                    </div>

                    <Tabs size="sm" defaultValue="all" variant="underline">
                        <TabsContent value="all">
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
                                                                        ) : header.column.getIsSorted() ===
                                                                            "desc" ? (
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
                                        {loading ? (
                                            <Table.Row>
                                                <td
                                                    colSpan={columns.length}
                                                    className="text-center py-8"
                                                >
                                                    Loading raw loaders...
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
                                                <td
                                                    colSpan={columns.length}
                                                    className="text-center py-8"
                                                >
                                                    No raw loaders found
                                                </td>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </Table.ScrollContainer>

                            <Flex justify="flex-end" className="mt-3">
                                <Pagination
                                    count={totalCount}
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
        </div>
    );
}
