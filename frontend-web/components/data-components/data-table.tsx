"use client"

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel, getFacetedUniqueValues, getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TableMeta,
  useReactTable
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ChevronDown, ChevronFirst, ChevronLast, ChevronUp } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {Button} from "@/components/ui/button";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  metaData?: TableMeta<TData>
}

export function DataTable<TData, TValue>({
                                           columns,
                                           data, metaData
                                         }
                                         : DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: metaData,
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="w-full" style={{tableLayout: "fixed"}}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} style={{width: header.getSize()}}>
                    {header.isPlaceholder ? null : (
                      <div className="flex justify-between items-center gap-2">
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
                          asc: <ChevronUp/>,
                          desc: <ChevronDown/>,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                        {header.column.getCanFilter() ? (
                            <Filter column={header.column} />
                        ) : null}
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
                  <TableCell key={cell.id} style={{width: cell.column.getSize()}}>
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
              <ChevronFirst/>
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
              <ChevronLast/>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 1000), [column.getFacetedUniqueValues()]
  );

  return (
    <div>
      <div className="flex space-x-2">
        <select
          onChange={(e) => column.setFilterValue(e.target.value)}
          value={columnFilterValue?.toString()}
          className="text-xs border rounded px-1 py-0.5 max-w-[120px]">
          <option value="">All</option>
          {sortedUniqueValues.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );


}