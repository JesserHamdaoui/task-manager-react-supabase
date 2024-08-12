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
}: {
  values: { title: string; description: string; deadline: Date; id: Number };
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
      // TODO: add a toaster
      console.log(error);
    } else {
      window.location.reload();
    }
  };

  const deleteHandler = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", values.id);
    if (error) {
      console.log(error);
    } else {
      window.location.reload();
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
        <PopoverContent className="bg-[#18181b] border-1 border-[#3f3f46]">
          <div className="flex flex-col py-2 items-start">
            <Button
              color="primary"
              startContent={<FontAwesomeIcon icon={faCheck} />}
              fullWidth
              radius="md"
              variant="light"
            >
              Mark as complete
            </Button>
            <Button
              color="primary"
              startContent={<FontAwesomeIcon icon={faCopy} />}
              fullWidth
              radius="md"
              variant="light"
              onPress={dublicateHandler}
            >
              Duplicate
            </Button>
            <Button
              color="primary"
              startContent={<FontAwesomeIcon icon={faEdit} />}
              fullWidth
              radius="md"
              variant="light"
              onPress={onOpen}
            >
              Edit
            </Button>
            <Button
              color="danger"
              startContent={<FontAwesomeIcon icon={faTrash} />}
              fullWidth
              radius="md"
              variant="light"
              onPress={deleteHandler}
            >
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <ModifyModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        defaultValues={values}
      />
    </>
  );
}
