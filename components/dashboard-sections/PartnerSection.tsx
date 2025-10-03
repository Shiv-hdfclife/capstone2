// import React from 'react';
// import { Text, Button, Card } from "@hdfclife-insurance/one-x-ui";
// import { Handshake } from "@phosphor-icons/react";

// export default function PartnerSection() {
//     return (
//         <div className="space-y-6">

//         </div>
//     );
// }

"use client";

import EyeModal from "@/components/Eye";
import EditPartnerModal, { PartnerType } from "@/components/EditPartner";
import AddPartnerModal from "@/components/AddPartnerModal";
import { fetchPartners, fetchPartnerById } from "@/services/api";
import {
    Button,
    Checkbox,
    IconButton,
    Pagination,
    Search,
    Table,
} from "@hdfclife-insurance/one-x-ui";
import {
    ArrowDown,
    ArrowUp,
    ArrowsDownUp,
    Eye,
    Pencil,
} from "@phosphor-icons/react";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
    ColumnPinningState,
    PaginationState,
    SortingState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { FilterFn } from "@tanstack/react-table";
import { getFilteredRowModel } from "@tanstack/react-table";
import React from "react";


declare module "@tanstack/react-table" {
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const rowValue = row.getValue(columnId);
    const itemRank = rankItem(rowValue, value);
    addMeta({ itemRank });
    return itemRank.passed;
};

type User = {
    id: number;
    PartnerName?: string;
    email?: string;
    Type?: PartnerType;
    Location?: string;
    DateofAgreement?: string;
    phone?: string;
    actions?: string[];
};

const columnHelper = createColumnHelper<User>();

export default function PartnerSection() {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [selectedRow, setSelectedRow] = React.useState<User | null>(null);
    const [editRow, setEditRow] = React.useState<User | null>(null);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
        left: [],
        right: ["action"],
    });

    const [data, setData] = React.useState<User[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const [refetchIndex, setRefetchIndex] = React.useState(0);
    const refetch = () => setRefetchIndex((prev) => prev + 1);

    React.useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // const response = await api.get(
                //   `/partners?page=${pagination.pageIndex + 1}&pageSize=${
                //     pagination.pageSize
                //   }&search=${globalFilter}`
                // );
                const response = await fetchPartners();

                // Handle the response structure from API
                if (response && typeof response === "object" && "data" in response) {
                    setData(response.data);
                    setTotalCount(response.total || 0);
                } else {
                    console.error("Unexpected response structure:", response);
                }
            } catch (error) {
                console.error("Failed to fetch partners:", error);
                // Optionally show user-friendly error message
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [pagination.pageIndex, pagination.pageSize, globalFilter, refetchIndex]);

    const columns = [
        {
            id: "select",
            header: ({ table }: any) => (
                <Checkbox
                    checked={table.getIsAllRowsSelected()}
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
        columnHelper.accessor("PartnerName", {
            header: "Partner Name",
            cell: (info) => info.getValue(),
            enableSorting: true,
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("Type", {
            header: "Type",
            cell: (info) => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor("email", {
            header: "Email",
            cell: (info) => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor("phone", {
            header: "Contact Number",
            cell: (info) => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor("DateofAgreement", {
            header: "Date of Agreement",
            cell: (info) => {
                const raw = info.getValue();
                if (!raw) return raw;
                const date = new Date(raw);
                return isNaN(date.getTime()) ? raw : date.toISOString().split("T")[0];
            },
            enableSorting: true,
        }),
        columnHelper.accessor("Location", {
            header: "Location",
            cell: (info) => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor("actions", {
            id: "action",
            header: "Actions",
            enableSorting: false,
            cell: (info) => (
                <div className="flex justify-between space-x-2">
                    <IconButton
                        variant="tertiary"
                        color="gray"
                        size="sm"
                        onClick={() => setSelectedRow(info.row.original)}
                    >
                        <Eye />
                    </IconButton>
                    <IconButton
                        variant="tertiary"
                        color="gray"
                        size="sm"
                        onClick={() => setEditRow(info.row.original)}
                    >
                        <Pencil />
                    </IconButton>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnPinningChange: setColumnPinning,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        filterFns: { fuzzy: fuzzyFilter },
        globalFilterFn: fuzzyFilter,
        onGlobalFilterChange: setGlobalFilter,
        manualPagination: true,
        pageCount: Math.ceil(totalCount / pagination.pageSize),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination,
            sorting,
            columnPinning,
            rowSelection,
            globalFilter,
        },
    });

    return (
        <div className="h-dvh flex flex-col p-6">
            <div className="flex space-x-4">
                <Search
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    placeholder="Search all columns..."
                />
                <Button onClick={() => setShowAddModal(true)}>Add Partner</Button>
            </div>

            <Table.ScrollContainer type="always" className="mt-6 flex-1 h-0">
                <Table>
                    <Table.Head>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Table.Row key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Table.Th key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div className="cursor-pointer">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort()
                                                    ? {
                                                        asc: (
                                                            <IconButton
                                                                variant="link"
                                                                color="gray"
                                                                size="sm"
                                                                onClick={header.column.getToggleSortingHandler()}
                                                            >
                                                                <ArrowDown />
                                                            </IconButton>
                                                        ),
                                                        desc: (
                                                            <IconButton
                                                                variant="link"
                                                                color="gray"
                                                                size="sm"
                                                                onClick={header.column.getToggleSortingHandler()}
                                                            >
                                                                <ArrowUp />
                                                            </IconButton>
                                                        ),
                                                    }[header.column.getIsSorted() as string] ?? (
                                                        <IconButton
                                                            variant="link"
                                                            color="gray"
                                                            size="sm"
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            <ArrowsDownUp />
                                                        </IconButton>
                                                    )
                                                    : null}
                                            </div>
                                        )}
                                    </Table.Th>
                                ))}
                            </Table.Row>
                        ))}
                    </Table.Head>

                    <Table.Body>
                        {loading ? (
                            <Table.Row>
                                <td colSpan={columns.length}>Loading...</td>
                            </Table.Row>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <Table.Row key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))
                        )}
                    </Table.Body>
                </Table>
            </Table.ScrollContainer>

            <Pagination
                count={totalCount}
                onPrevious={() => table.previousPage()}
                onNext={() => table.nextPage()}
                pageSize={pagination.pageSize}
                onPageChange={(details: { page: number }) =>
                    table.setPageIndex(details.page - 1)
                }
            />

            {selectedRow && (
                <EyeModal data={selectedRow} onClose={() => setSelectedRow(null)} />
            )}

            {editRow && (
                <EditPartnerModal
                    id={editRow.id}
                    data={editRow}
                    onClose={() => setEditRow(null)}
                    onSuccess={async (updatedRow) => {
                        setEditRow(null); // Close modal immediately
                        refetch();
                    }}
                />
            )}

            {showAddModal && (
                <AddPartnerModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={async () => {
                        setShowAddModal(false);
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
