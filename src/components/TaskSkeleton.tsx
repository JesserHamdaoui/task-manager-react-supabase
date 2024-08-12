import { Skeleton } from "@nextui-org/react";

function TaskSkeleton() {
  return (
    <div className="max-w-[1000px] h-54 flex flex-col items-center gap-3 my-16">
      <Skeleton className="flex rounded-xl w-full h-5 mb-4" />
      <div className="w-full flex flex-col gap-3">
        <Skeleton className="h-5 w-3/5 rounded-lg" />
        <Skeleton className="h-5 w-1/4 rounded-lg" />
        <Skeleton className="h-5 w-1/4 rounded-lg" />
      </div>
    </div>
  );
}

export default TaskSkeleton;
