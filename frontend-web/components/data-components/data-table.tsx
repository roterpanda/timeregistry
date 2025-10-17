"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel, getPaginationRowModel,
  getSortedRowModel,
  TableMeta,
  useReactTable
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ArrowDownIcon, ArrowUpIcon, ChevronDown, ChevronFirst, ChevronLast, ChevronUp, RewindIcon} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {Button} from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  metaData?: TableMeta<TData>
}

export function DataTable<TData, TValue>({
  columns,
  data, metaData}
: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: metaData,
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="w-full" style={{ tableLayout: "fixed" }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort()
                        ? "cursor-pointer select-none flex justify-between items-center"
                        : ""}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort() ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                            : undefined}
                        >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUp />,
                          desc: <ChevronDown />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronFirst />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href={!table.getCanPreviousPage() ? "#" : undefined}
              onClick={() => table.previousPage()}
              aria-disabled={!table.getCanPreviousPage()}
              className={!table.getCanPreviousPage() ? "cursor-not-allowed opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={!table.getCanNextPage() ? "#" : undefined}
              onClick={() => table.nextPage()}
              aria-disabled={!table.getCanNextPage()}
              className={!table.getCanNextPage() ? "cursor-not-allowed opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}>
              <ChevronLast />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}