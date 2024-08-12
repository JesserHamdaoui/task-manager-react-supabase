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
import { CalendarDate, Time } from "@internationalized/date";

import { useState } from "react";
import { supabase } from "../config/supabaseClient";

export default function ModifyModal({
  isOpen,
  onOpenChange,
  defaultValues,
}: {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  defaultValues: {
    title: string;
    description: string;
    deadline: Date;
    id: Number;
  };
}) {
  const [title, setTitle] = useState(defaultValues.title);
  const [description, setDescription] = useState(defaultValues.description);
  const [deadlineDate, setDeadlineDate] = useState(
    defaultValues.deadline.toString().split("T")[0]
  );
  const [deadlineTime, setDeadlineTime] = useState(
    defaultValues.deadline.toString().split("T")[1].split(".")[0]
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async () => {
    setIsLoading(true);

    if (!title || !description || !deadlineDate || !deadlineTime) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (
      title == defaultValues.title &&
      description == defaultValues.description &&
      deadlineDate == defaultValues.deadline.toISOString().split("T")[0] &&
      deadlineTime ==
        defaultValues.deadline.toISOString().split("T")[1].split(".")[0]
    ) {
      setError("No changes detected");
      setIsLoading(false);
      return;
    }

    const deadline = new Date(deadlineDate + " " + deadlineTime);
    const { data, error } = await supabase
      .from("tasks")
      .update({ title, description, deadline })
      .eq("id", defaultValues.id);

    if (error) {
      setError("Could not modify task");
      setIsLoading(false);
    } else {
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
                Modify the task
              </ModalHeader>
              <ModalBody>
                <form action="" className="flex flex-col gap-4">
                  <Input
                    type="text"
                    label="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                  <Textarea
                    label="Description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <DateInput
                      label="Deadline Date"
                      onChange={(value) => setDeadlineDate(value.toString())}
                      defaultValue={
                        new CalendarDate(
                          new Date(deadlineDate).getFullYear(),
                          new Date(deadlineDate).getMonth(),
                          new Date(deadlineDate).getDate()
                        )
                      }
                    />
                    <TimeInput
                      label="Deadline Time"
                      onChange={(value) => setDeadlineTime(value.toString())}
                      //   TODO: Fix the time input
                      defaultValue={new Time(new Date(deadlineTime).getTime())}
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
                  Modify
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
