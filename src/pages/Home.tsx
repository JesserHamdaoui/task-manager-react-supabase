import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/checkbox";

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
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("tasks").select();

      if (error) {
        setFetchError("Could not fetch tasks");
        setTasks([]);
        console.log(error);
      }
      if (data) {
        setTasks(data);
        setFetchError(null);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="">
      <div className="max-w-[1000px] m-auto">
        {fetchError ? (
          <p>{fetchError}</p>
        ) : (
          tasks.map((task) => {
            return (
              <Card key={task.id} className="my-5">
                <CardHeader className="flex justify-between">
                  {task.title}

                  <Checkbox checked={task.is_complete} onChange={() => {}} />
                </CardHeader>
                <Divider />
                <CardBody className="min-h-32">
                  <p>{task.description}</p>
                  <p className="text-blue-500">
                    Deadline:{" "}
                    {task.deadline.toString().slice(0, 10) +
                      " " +
                      task.deadline.toString().slice(11, 16)}
                  </p>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
