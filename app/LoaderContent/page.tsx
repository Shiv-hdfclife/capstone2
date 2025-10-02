// "use client";

// import {
//   Button,
//   Checkbox,
//   Flex,
//   IconButton,
//   Pagination,
//   ScrollArea,
//   Select,
//   Table,
//   Search,
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
//   Text,
//   colors,
// } from "@hdfclife-insurance/one-x-ui";
// import {
//   ArrowDown,
//   ArrowUp,
//   ArrowsDownUp,
//   DownloadIcon,
  
// } from "@phosphor-icons/react";
// import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
// import {
//   Column,
//   FilterFn,
//   PaginationState,
//   type Table as ReactTable,
//   SortingState,
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import clsx from "clsx";
// import React, { CSSProperties } from "react";

// declare module "@tanstack/react-table" {
//   interface FilterFns {
//     fuzzy: FilterFn<unknown>;
//   }
//   interface FilterMeta {
//     itemRank: RankingInfo;
//   }
// }

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//   const itemRank = rankItem(row.getValue(columnId), value);
//   addMeta({
//     itemRank,
//   });

//   return itemRank.passed;
// };

// const tableData: User[] = [
//   {
//     rcd: "12/07/2024",
//     lan: "AB2C3D4E5F6G7H8",
//     memberName: "Poorva Mallesh",
//     status: "Pending",
//     policyNo: "PN123456",
//     reason: "UW/Medical bucket",
//     sum: 85000,
//   },
//   {
//     rcd: "07/08/2024",
//     lan: "W9E8R7T6Y5U4I3O2",
//     memberName: "Vikram Mittal",
//     status: "Rejected",
//     reason: "FR Closed",
//     policyNo: "PN123456",
//     sum: 112000,
//   },
//   {
//     rcd: "08/08/2024",
//     lan: "F6G5H4J3K2L1M9N8",
//     memberName: "Sanjana Shah",
//     status: "Pending",
//     policyNo: "PN123456",
//     reason: "FR Open",
//     sum: 100000,
//   },
//   {
//     rcd: "06/08/2024",
//     lan: "L7K6J5H4G3F2D1S9",
//     memberName: "Sanjana Shah",
//     status: "Pending",
//     policyNo: "PN123456",
//     reason: "UW/Medical bucket",
//     sum: 95000,
//   },
//   {
//     rcd: "07/08/2024",
//     lan: "W9E8R7T6Y5U4I3O2",
//     memberName: "Vikram Mittal",
//     status: "Rejected",
//     policyNo: "PN123456",
//     reason: "FR Closed",
//     sum: 112000,
//   },
//   {
//     rcd: "08/08/2024",
//     lan: "F6G5H4J3K2L1M9N8",
//     memberName: "Sanjana Shah",
//     status: "Pending",
//     reason: "FR Open",
//     policyNo: "PN123456",
//     sum: 100000,
//   },
// ];

// type User = {
//   rcd: string;
//   lan: string;
//   memberName: string;
//   status: string;
//   reason: string;
//   policyNo?: string;
//   sum: number;
//   actions?: string;
// };

// const getCommonPinningStyles = (column: Column<User>): CSSProperties => {
//   const isPinned = column.getIsPinned();
//   const isLastLeftPinnedColumn =
//     isPinned === "left" && column.getIsLastColumn("left");
//   const isFirstRightPinnedColumn =
//     isPinned === "right" && column.getIsFirstColumn("right");
//   return {
//     left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
//     right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
//     opacity: isPinned ? 0.95 : 1,
//     position: isPinned ? "sticky" : "relative",
//     width: column.getSize(),
//     boxShadow: isLastLeftPinnedColumn
//       ? `-4px 0 4px -4px ${colors.neutral.grey[200]}  inset`
//       : isFirstRightPinnedColumn
//         ? `-4px 0px 4px 0px ${colors.neutral.grey[200]}`
//         : undefined,
//     background: "white",
//     zIndex: isPinned ? 1 : 0,
//   };
// };

// export default function DashboardTable() {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [rowSelection, setRowSelection] = React.useState({});

//   const [pagination, setPagination] = React.useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });
//   const columnHelper = createColumnHelper<User>();

//   const columns = [
//     {
//       id: "select",
//       header: ({ table }: { table: ReactTable<User> }) => (
//         <Checkbox
//           checked={
//             table.getIsAllRowsSelected()
//               ? true
//               : table.getIsSomeRowsSelected()
//                 ? "indeterminate"
//                 : false
//           }
//           onChange={table.getToggleAllRowsSelectedHandler()}
//         />
//       ),
//       cell: ({ row }: any) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onChange={row.getToggleSelectedHandler()}
//         />
//       ),
//     },
//     columnHelper.accessor("rcd", {
//       header: "RCD",
//       cell: (info) => new Date(info.getValue()).toLocaleDateString(),
//       enableSorting: true,
//     }),
//     columnHelper.accessor("lan", {
//       header: "LAN",
//       cell: (info) => info.getValue(),
//       enableSorting: true,
//     }),
//     columnHelper.accessor("memberName", {
//       header: "Member Name",
//       cell: (info) => info.getValue(),
//       enableSorting: true,
//       filterFn: "fuzzy",
//     }),

//     columnHelper.accessor("sum", {
//       header: "Life Flag",
//       cell: (info) => info.getValue(),
//       enableSorting: true,
//     }),

//     columnHelper.accessor("reason", {
//       header: "Reason",
//       enableSorting: false,
//       cell: (info) => {
//         const status = info.getValue();
//         return status;
//       },
//     }),

//     columnHelper.accessor("sum", {
//       header: "Sum Assured",
//       cell: (info) => info.getValue(),
//       enableSorting: true,
//     }),

//     columnHelper.accessor("policyNo", {
//       header: "Policy No",
//       cell: (info) => info.getValue(),
//       enableSorting: true,
//     }),
//     columnHelper.accessor("actions", {
//       id: "action",
//       header: "Actions",
//       enableSorting: false,
//       cell: (info) => (
//         <Flex gap={2}>
//           <Button size="sm" variant="link" color="blue">
//             View
//           </Button>
//         </Flex>
//       ),
//     }),
//   ];

//   const table = useReactTable({
//     data: tableData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),

//     getSortedRowModel: getSortedRowModel(),
//     onSortingChange: setSorting,

//     onRowSelectionChange: setRowSelection,
//     enableRowSelection: true,

//     getPaginationRowModel: getPaginationRowModel(),
//     onPaginationChange: setPagination,

//     filterFns: {
//       fuzzy: fuzzyFilter,
//     },
//     globalFilterFn: fuzzyFilter,
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       pagination,
//       columnPinning: {
//         right: ["action"],
//       },
//       sorting,
//       rowSelection,
//     },
//   });

//   return (
//     // custom properties for the layout
//     <div className="min-h-dvh flex flex-col p-6 bg-gray-100 [--left-sidebar-width:240px] [--right-sidebar-width:60px] [--gutter:24px] [--header-height:68px]">
            
//             <form className="space-y-1">
//               <div className="grid lg:grid-cols-4 gap-4 items-end">
//                 <Select
//                   label="View by"
//                   items={["All Partners"]}
//                   name="partner"
//                 />
//                 <Select items={["All Jobs", "All Policies"]} name="policies" />
//                 <Select items={["All policies"]} name="policies" />
//                 <Button variant="tertiary" type="reset">
//                   Reset
//                 </Button>
//               </div>
//             </form>
//             <div className="flex mt-4">
//         <Search
//           placeholder="Search all columns..."
//         />
//         <Button >Search</Button>
//       </div>
//             <div className="mt-7 space-y-3">
//                 <div className="flex justify-between items-center text-[#30619c]">
//               <Text
//                 fontWeight="semibold"
//                 size="xl"
//                 className="text-primary-blue"
//               >
//                 Case records
//               </Text>
//               <Button >Add EMIF</Button>
//               </div>

//               <Tabs size="sm" defaultValue="nb" variant="underline">
//                 <ScrollArea>
//                   <TabsList>
//                     <TabsTrigger value="nb">All</TabsTrigger>
//                     <TabsTrigger value="pending">Pending</TabsTrigger>
//                     <TabsTrigger value="issued">Issued</TabsTrigger>
//                     <TabsTrigger value="rejected">Rejected</TabsTrigger>
//                     <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
//                   </TabsList>
//                 </ScrollArea>
//                 <div className="mt-2 text-sm text-gray-500">Results: {table.getRowModel().rows.length}</div>

//                 <div className="text-sm  mt-3 items-center flex gap-x-8">
//                     <div className="items-center flex gap-2 "><DownloadIcon/> Download</div>
//                     <div className="items-center flex gap-2 "><DownloadIcon/> Download</div>
//                 </div>

//                 <TabsContent value="nb">
//                   <Table.ScrollContainer type="always">
//                     <Table withTableBorder>
//                       <Table.Head>
//                         {table.getHeaderGroups().map((headerGroup, i) => (
//                           <Table.Row key={i}>
//                             {headerGroup.headers.map((header, i) => (
//                               <Table.Th
//                                 key={i}
//                                 className="!py-4 bg-indigo-50"
//                                 style={{
//                                   ...getCommonPinningStyles(header.column),
//                                 }}
//                               >
//                                 {header.isPlaceholder ? null : (
//                                   <Flex gap={1} align="center">
//                                     {flexRender(
//                                       header.column.columnDef.header,
//                                       header.getContext(),
//                                     )}
//                                     {header.column.getCanSort() && (
//                                       <IconButton
//                                         variant="link"
//                                         color="gray"
//                                         size="xs"
//                                         onClick={header.column.getToggleSortingHandler()}
//                                       >
//                                         {header.column.getIsSorted() ===
//                                         "asc" ? (
//                                           <ArrowUp />
//                                         ) : header.column.getIsSorted() ===
//                                           "desc" ? (
//                                           <ArrowDown />
//                                         ) : (
//                                           <ArrowsDownUp />
//                                         )}
//                                       </IconButton>
//                                     )}
//                                   </Flex>
//                                 )}
//                               </Table.Th>
//                             ))}
//                           </Table.Row>
//                         ))}
//                       </Table.Head>
//                       <Table.Body>
//                         {table.getRowModel().rows.map((row, i) => (
//                           <Table.Row key={i}>
//                             {row.getVisibleCells().map((cell, cellIndex) => (
//                               <Table.Cell
//                                 key={cellIndex}
//                                 className="!py-4"
//                                 style={{
//                                   ...getCommonPinningStyles(cell.column),
//                                 }}
//                               >
//                                 {flexRender(
//                                   cell.column.columnDef.cell,
//                                   cell.getContext(),
//                                 )}
//                               </Table.Cell>
//                             ))}
//                           </Table.Row>
//                         ))}
//                       </Table.Body>
//                     </Table>
//                   </Table.ScrollContainer>

//                   <Flex justify="flex-end" className="mt-3">
//                     <Pagination
//                       count={tableData.length}
//                       onPrevious={() => table.previousPage()}
//                       onNext={() => table.nextPage()}
//                       pageSize={pagination.pageSize}
//                       onPageChange={(details: {
//                         page: number;
//                       }) => table.setPageIndex(details.page - 1)}
//                     />
//                   </Flex>
//                 </TabsContent>
//               </Tabs>
//             </div>
//     </div>
//   );
// }
