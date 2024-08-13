import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import {
  faCheck,
  faCopy,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ModifyModal from "./ModifyModal";
import { supabase } from "../config/supabaseClient";

export default function OptionsPopover({
  values,
  checkboxHandler,
  isComplete,
  fetchTasks,
}: {
  values: { title: string; description: string; deadline: Date; id: Number };
  checkboxHandler: () => void;
  isComplete: boolean;
  fetchTasks: () => Promise<void>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const dublicateHandler = async () => {
    const { data, error } = await supabase.from("tasks").insert([
      {
        title: values.title,
        description: values.description,
        deadline: values.deadline,
      },
    ]);
    if (error) {
    }
    if (data) {
      fetchTasks();
    }
  };

  const deleteHandler = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", values.id);
    if (error) {
    }
    if (data) {
      fetchTasks();
    }
  };

  return (
    <>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <Button variant="light" className="rouded-lg" isIconOnly>
            <FontAwesomeIcon icon={faEllipsis} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#18181b] border-1 border-[#3f3f46] flex flex-col py-2 items-start">
          <Button
            color="primary"
            startContent={<FontAwesomeIcon icon={faCheck} />}
            radius="md"
            variant="light"
            className="w-full flex justify-start"
            onPress={checkboxHandler}
          >
            {`Mark as ${isComplete ? "not" : ""} complete`}
          </Button>
          <Button
            color="primary"
            startContent={<FontAwesomeIcon icon={faCopy} />}
            radius="md"
            variant="light"
            className="w-full flex justify-start"
            onPress={dublicateHandler}
          >
            Duplicate
          </Button>
          <Button
            color="primary"
            startContent={<FontAwesomeIcon icon={faEdit} />}
            radius="md"
            variant="light"
            className="w-full flex justify-start"
            onPress={onOpen}
          >
            Edit
          </Button>
          <Button
            color="danger"
            startContent={<FontAwesomeIcon icon={faTrash} />}
            radius="md"
            variant="light"
            className="w-full flex justify-start"
            onPress={deleteHandler}
          >
            Delete
          </Button>
        </PopoverContent>
      </Popover>

      <ModifyModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        defaultValues={values}
        fetchTasks={fetchTasks}
      />
    </>
  );
}
