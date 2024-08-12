import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

import TaskSkeleton from "../components/TaskSkeleton";
import TaskCard from "../components/TaskCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import FiltersPopover from "../components/FiltersPopover";

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

  const [isCompleteDisplayed, setIsCompleteDisplayed] = useState(true);
  const [isDeadlineDisplayed, setIsDeadlineDisplayed] = useState(false);

  const handleCompleteDisplay = () => {
    setIsCompleteDisplayed(!isCompleteDisplayed);
  };

  const handleDeadlineDisplay = () => {
    setIsDeadlineDisplayed(!isDeadlineDisplayed);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select()
        .order("deadline");

      if (error) {
        setFetchError("Could not fetch tasks");
        setTasks([]);
        console.log(error);
        setIsLoading(false);
      }
      if (data) {
        setTasks(data);

        if (!isCompleteDisplayed) {
          setTasks(data.filter((task) => !task.is_complete));
        }

        if (isDeadlineDisplayed) {
          setTasks(tasks.filter((task) => task.deadline > new Date()));
        }
        setFetchError(null);
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [isCompleteDisplayed, isDeadlineDisplayed]);

  return (
    <div className="">
      <div className="max-w-[1000px] m-auto">
        <header className="flex flex-row justify-between items-center">
          <h1 className="text-4xl font-semibold my-10">
            <FontAwesomeIcon icon={faCircleCheck} className="mr-3" />
            <span>Tasks</span>
          </h1>
          <FiltersPopover
            isCompleteDisplayed={isCompleteDisplayed}
            isDeadlineDisplayed={isDeadlineDisplayed}
            handleCompleteDisplay={handleCompleteDisplay}
            handleDeadlineDisplay={handleDeadlineDisplay}
          />
        </header>
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
