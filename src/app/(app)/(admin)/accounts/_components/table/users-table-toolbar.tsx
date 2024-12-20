"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { DataTableViewOptions } from "../../../../_components/table/data-table-view-options"

import { DataTableFacetedFilter } from "../../../../_components/table/data-table-faceted-filter";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { department } from "@/lib/helper/objects";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("lastName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("lastName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("department") && (
          <DataTableFacetedFilter
            column={table.getColumn("department")}
            title="Department"
            options={department}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
