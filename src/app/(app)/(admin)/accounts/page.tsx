"use client";

import { ChevronRight } from "lucide-react";
import React from "react";
import CreateUserForm from "./_components/forms/create-user-form";
import { DataTable } from "./_components/table/data-table";
import { columns } from "./_components/table/columns";
import { api } from "@/app/_trpc/client";
import TableSkeleton from "../../_components/skeleton/skeleton";

const Page = () => {
  const { data, isLoading } = api.user.getUserData.useQuery(undefined, {
    refetchInterval: 5000,
  });

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="flex flex-col p-1 w-full">
      <div className="flex items-center gap-x-1">
        <span className="font-medium">InnControl</span>
        <ChevronRight size={19} />
        <span className="font-medium">Accounts</span>
      </div>

      <div className="flex-1 flex flex-col gap-y-4 py-3 md:mr-8 mr-12">
        <CreateUserForm />
        <div className="flex flex-col gap-y-4">
          <h1 className="text-2xl font-bold">Accounts</h1>
          {data && <DataTable columns={columns} data={data} />}
        </div>
      </div>
    </div>
  );
};

export default Page;
