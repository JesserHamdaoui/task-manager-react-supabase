import {
  Button,
  DateInput,
  TimeInput,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

import { Input, Textarea } from "@nextui-org/input";

import { useState } from "react";
import { supabase } from "../config/supabaseClient";

export default function CreateModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async () => {
    setIsLoading(true);

    if (!title || !description || !deadlineDate || !deadlineTime) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    const deadline = new Date(deadlineDate + " " + deadlineTime);
    const { data, error } = await supabase.from("tasks").insert([
      {
        title,
        description,
        deadline,
      },
    ]);
    if (error) {
      setError("Could not create task");
      setIsLoading(false);
    }
    if (data) {
      setTitle("");
      setDescription("");
      setDeadlineDate("");
      setDeadlineTime("");
      setError(null);
      setIsLoading(false);
      onOpenChange(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add a Task
              </ModalHeader>
              <ModalBody>
                <form action="" className="flex flex-col gap-4">
                  <Input
                    type="text"
                    label="Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    label="Description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <DateInput
                      label="Deadline Date"
                      onChange={(value) => setDeadlineDate(value.toString())}
                    />
                    <TimeInput
                      label="Deadline Time"
                      // TODO: Fix the time input (it is less by 1 hour)
                      onChange={(value) => setDeadlineTime(value.toString())}
                    />
                  </div>
                  {error && (
                    <p className="text-[#F31260] bg-[#310413] px-3 py-2 rounded-lg border-1 border-[#F31260]">
                      {error}
                    </p>
                  )}
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isLoading={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={submitHandler}
                  isLoading={isLoading}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
