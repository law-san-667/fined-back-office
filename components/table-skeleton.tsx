import React from "react";
import { Skeleton } from "./ui/skeleton";

type TableSkeletonProps = {};

const TableSkeleton: React.FC<TableSkeletonProps> = ({}) => {
  return <Skeleton className="h-48 w-full" />;
};

export default TableSkeleton;
