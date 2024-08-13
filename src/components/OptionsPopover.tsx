import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  const modifyModal = useDisclosure();
  const deleteDialogModal = useDisclosure();

  const dublicateHandler = async () => {
    const { error } = await supabase.from("tasks").insert([
      {
        title: values.title,
        description: values.description,
        deadline: values.deadline,
      },
    ]);
    if (error) {
    } else {
      fetchTasks();
    }
  };

  const deleteHandler = async () => {
    const { error } = await supabase.from("tasks").delete().eq("id", values.id);
    if (error) {
    } else {
      fetchTasks();
      deleteDialogModal.onClose();
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
            onPress={modifyModal.onOpen}
          >
            Edit
          </Button>
          <Button
            color="danger"
            startContent={<FontAwesomeIcon icon={faTrash} />}
            radius="md"
            variant="light"
            className="w-full flex justify-start"
            onPress={deleteDialogModal.onOpen}
          >
            Delete
          </Button>
        </PopoverContent>
      </Popover>

      <ModifyModal
        isOpen={modifyModal.isOpen}
        onOpenChange={modifyModal.onOpenChange}
        defaultValues={values}
        fetchTasks={fetchTasks}
      />

      <Modal
        backdrop="blur"
        onOpenChange={deleteDialogModal.onOpenChange}
        isOpen={deleteDialogModal.isOpen}
      >
        <ModalContent>
          <ModalHeader>Are you sure you want to delete this task?</ModalHeader>
          <ModalBody>
            <p>
              This action cannot be undone. This will permanently delete the
              task.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={deleteDialogModal.onClose}
            >
              Cancel
            </Button>
            <Button color="danger" onPress={deleteHandler}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
