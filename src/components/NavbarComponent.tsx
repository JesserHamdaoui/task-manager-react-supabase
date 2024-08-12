import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import CreateModal from "./CreateModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function NavbarComponent() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">Task Manger</p>
        </NavbarBrand>
        <NavbarContent as="div" className="items-center" justify="end">
          <Input
            classNames={{
              base: "max-w-full h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<FontAwesomeIcon icon={faSearch} />}
            type="search"
          />
        </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Button
              color="primary"
              variant="shadow"
              onPress={onOpen}
              startContent={<FontAwesomeIcon icon={faPlus} />}
              className="items-center"
            >
              Create a task
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="/login">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="/signup" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <CreateModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
