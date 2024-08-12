import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@nextui-org/react";

export default function FiltersPopover({
  isCompleteDisplayed,
  isDeadlineDisplayed,
  handleCompleteDisplay,
  handleDeadlineDisplay,
}: {
  isCompleteDisplayed: boolean;
  isDeadlineDisplayed: boolean;
  handleCompleteDisplay: () => void;
  handleDeadlineDisplay: () => void;
}) {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button isIconOnly variant="light">
          <FontAwesomeIcon icon={faSliders} className="text-xl" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3 flex flex-col items-start">
        <div className="flex flex-col gap-3">
          <Switch
            className="mr-3"
            isSelected={isCompleteDisplayed}
            onChange={handleCompleteDisplay}
          >
            <div className="flex flex-col gap-1">
              <p className="text-medium">Display completed tasks</p>
              <p className="text-tiny text-default-400">
                Get access to tasks that are already done.
              </p>
            </div>
          </Switch>
        </div>

        <Divider className="my-6" />

        <div className="flex flex-col gap-3">
          <Switch
            className="mr-3"
            isSelected={isDeadlineDisplayed}
            onChange={handleDeadlineDisplay}
          >
            <div className="flex flex-col gap-1">
              <p className="text-medium">Display tasks on deadline</p>
              <p className="text-tiny text-default-400">
                Show only the tasks that are still on the deadline.
              </p>
            </div>
          </Switch>
        </div>
      </PopoverContent>
    </Popover>
  );
}
