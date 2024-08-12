import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/checkbox";
import OptionsPopover from "../components/OptionsPopover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";

import { supabase } from "../config/supabaseClient";

export default function TaskCard(task: {
  title: string;
  description: string;
  deadline: Date;
  id: Number;
  is_complete: boolean;
}) {
  const checkboxHandler = async (e) => {
    console.log("Ahla");
    const is_complete = e.target.isSelected;
    console.log(is_complete);
    const { data, error } = await supabase
      .from("tasks")
      .update({ is_complete })
      .eq("id", task.id);
    if (error) {
      console.log(error);
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <Card key={task.id.toString()} className="my-5 px-7">
        <CardHeader className="flex justify-between">
          <span className="flex flex-row items-center gap-2">
            <Checkbox
              checked={task.is_complete}
              onValueChange={() => {
                checkboxHandler;
              }}
              isSelected={task.is_complete ? true : false}
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
