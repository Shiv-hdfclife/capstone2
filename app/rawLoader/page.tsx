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
import rawLoaderApi, { RawLoader } from "@/services/rawLoaderApi";
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
  Date: string;
  LoaderID: string;
  LoaderName: string;
  LoaderType: string;
  Partner: string;
  Pending: number;
  TotalMembers: number;
  //dob: string;
  actions?: string;
};

const getCommonPinningStyles = (column: Column<User>): CSSProperties => {
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
      ? `-4px 0 4px -4px ${colors.neutral.grey[200]}  inset`
      : isFirstRightPinnedColumn
      ? `-4px 0px 4px 0px ${colors.neutral.grey[200]}`
      : undefined,
    background: "white",
    zIndex: isPinned ? 1 : 0,
  };
};

export default function DashboardTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const columnHelper = createColumnHelper<User>();

  const columns = [
    {
      id: "select",
      header: ({ table }: { table: ReactTable<User> }) => (
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
      cell: (info) => info.getValue(),
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
    columnHelper.accessor("Pending", {
      header: "Pending",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("actions", {
      id: "action",
      header: "Actions",
      enableSorting: false,
      cell: (info) => (
        <Flex gap={2}>
          <Button size="sm" variant="link" color="blue">
            Download
          </Button>
        </Flex>
      ),
    }),
  ];

  const [tableData, setTableData] = React.useState<RawLoader[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [globalFilter, setGlobalFilter] = React.useState("");

  React.useEffect(() => {
    async function fetchLoaders() {
      const response = await rawLoaderApi.get(
        `/api/raw-loaders?page=${pagination.pageIndex + 1}&pageSize=${
          pagination.pageSize
        }&search=${globalFilter}`
      );
      setTableData(response.data);
      setTotalCount(response.total);
    }
    fetchLoaders();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,

    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,

    manualPagination: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    onPaginationChange: setPagination,

    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      columnPinning: {
        right: ["action"],
      },
      sorting,
      rowSelection,
    },
  });

  return (
    // custom properties for the layout
    <div className="min-h-dvh flex flex-col bg-gray-100 [--gutter:24px] [--header-height:68px]">
        <div>
          <form className="space-y-1">
            <div className="grid lg:grid-cols-4 gap-4 items-end">
              <Select label="View by" items={["All Partners"]} name="partner" />

              <Select items={["All Loader Types"]} name="policies" />
              <Button variant="tertiary" type="reset">
                Reset
              </Button>
            </div>
            <div className="flex space-x-4">
              <Search placeholder="Search by Partner, Loader name, Loader ID, Loader type or Uploaded by " />
              <Button>Search</Button>
            </div>
          </form>
          <div className="mt-7 space-y-3">
            <div className="flex justify-between items-center text-[#30619c]">
            <Text fontWeight="semibold" size="xl" className="text-primary-blue">
              Loaders
            </Text>
            </div>
            <Tabs size="sm" defaultValue="nb" variant="underline">
              <TabsContent value="nb">
                <Table.ScrollContainer type="always">
                  <Table withTableBorder>
                    <Table.Head>
                      {table.getHeaderGroups().map((headerGroup, i) => (
                        <Table.Row key={i}>
                          {headerGroup.headers.map((header, i) => (
                            <Table.Th
                              key={i}
                              className="!py-4 bg-indigo-50"
                              style={{
                                ...getCommonPinningStyles(header.column),
                              }}
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
                      {table.getRowModel().rows.map((row, i) => (
                        <Table.Row key={i}>
                          {row.getVisibleCells().map((cell, cellIndex) => (
                            <Table.Cell
                              key={cellIndex}
                              className="!py-4"
                              style={{
                                ...getCommonPinningStyles(cell.column),
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
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
