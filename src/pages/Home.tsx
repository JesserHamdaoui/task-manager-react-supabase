import { useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

import TaskSkeleton from "../components/TaskSkeleton";
import TaskCard from "../components/TaskCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import FiltersPopover from "../components/FiltersPopover";
import { SearchContext } from "../Providers/SearchProvider";
import { useDisclosure } from "@nextui-org/react";
import CreateModal from "../components/CreateModal";
import { useAuth } from "../hooks/AuthProvider";

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

  const searchContext = useContext(SearchContext);
  if (!searchContext) {
    throw new Error("SearchContext must be used within a SearchProvider");
  }
  const { search } = searchContext;

  const { user } = useAuth();

  const fetchTasks = async (): Promise<void> => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select()
      .eq("created_by", user?.id.toString())
      .order("deadline");

    if (error) {
      setFetchError("Could not fetch tasks");
      setTasks([]);

      setIsLoading(false);
    }
    if (data) {
      setTasks(data);

      if (search) {
        setTasks(
          tasks.filter((task) =>
            task.title.toLowerCase().includes(search.toLowerCase())
          )
        );
      }

      if (!isCompleteDisplayed) {
        setTasks(tasks.filter((task) => !task.is_complete));
      }

      if (isDeadlineDisplayed) {
        setTasks(tasks.filter((task) => task.deadline > new Date()));
      }
      setFetchError(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isCompleteDisplayed, isDeadlineDisplayed, search]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        ) : tasks.length === 0 ? (
          <>
            <p className="text-center">
              No tasks found
              <br />
              <span
                className=" underline hover:cursor-pointer text-[#006FEE]"
                onClick={onOpen}
              >
                add a task
              </span>
            </p>
            <CreateModal isOpen={isOpen} onOpenChange={onOpenChange} />
          </>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id.toString()}
              title={task.title}
              description={task.description}
              deadline={task.deadline}
              id={task.id}
              is_complete={task.is_complete}
              fetchTasks={fetchTasks}
            />
          ))
        )}
      </div>
    </div>
  );
}
