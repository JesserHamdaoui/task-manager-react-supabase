import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/checkbox";
import OptionsPopover from "../components/OptionsPopover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";

import { supabase } from "../config/supabaseClient";
import { useState } from "react";

export default function TaskCard({
  title,
  description,
  deadline,
  id,
  is_complete,
  fetchTasks,
}: {
  title: string;
  description: string;
  deadline: Date;
  id: Number;
  is_complete: boolean;
  fetchTasks: () => Promise<void>;
}) {
  const task = { title, description, deadline, id, is_complete };

  const [isComplete, setIsComplete] = useState(task.is_complete);

  const checkboxHandler = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ is_complete: !isComplete })
      .eq("id", task.id);

    if (error) {
      console.log(error);
    } else {
      setIsComplete(!isComplete);
    }
  };

  return (
    <>
      <Card
        key={task.id.toString()}
        className="my-5 px-7"
        isDisabled={isComplete}
      >
        <CardHeader className="flex justify-between">
          <span className="flex flex-row items-center gap-2">
            <Checkbox
              onChange={() => {
                checkboxHandler();
              }}
              isSelected={isComplete}
            />
            <h1 className="inline font-semibold text-2xl capitalize">
              {task.title}
            </h1>
          </span>
          <OptionsPopover
            values={{
              title: task.title,
              description: task.description,
              deadline: task.deadline,
              id: task.id,
            }}
            fetchTasks={fetchTasks}
            checkboxHandler={checkboxHandler}
            isComplete={isComplete}
          />
        </CardHeader>
        <Divider />
        <CardBody className="min-h-32">
          <p className="capitalize mb-3">{task.description}</p>
          <p className="text-slate-500">
            <FontAwesomeIcon icon={faCalendar} className="mr-3" />{" "}
            {task.deadline.toString().slice(0, 10)}
          </p>
          <p className="text-slate-500">
            <FontAwesomeIcon icon={faClock} className="mr-3" />
            {task.deadline.toString().slice(11, 16)}
          </p>
        </CardBody>
      </Card>
    </>
  );
}
