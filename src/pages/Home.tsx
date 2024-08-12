import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

import TaskSkeleton from "../components/TaskSkeleton";
import TaskCard from "../components/TaskCard";

type Task = {
  id: Number;
  title: string;
  description: string;
  deadline: Date;
  created_at: Date;
  is_complete: boolean;
};

export default function Home() {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("tasks").select();

      if (error) {
        setFetchError("Could not fetch tasks");
        setTasks([]);
        console.log(error);
        setIsLoading(false);
      }
      if (data) {
        setTasks(data);
        setFetchError(null);
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="">
      <div className="max-w-[1000px] m-auto">
        {fetchError ? (
          <p>{fetchError}</p>
        ) : isLoading ? (
          <>
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </>
        ) : (
          tasks.map((task) => {
            return <TaskCard key={task.id.toString()} {...task} />;
          })
        )}
      </div>
    </div>
  );
}
