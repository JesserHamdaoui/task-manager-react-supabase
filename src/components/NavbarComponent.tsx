import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import CreateModal from "./CreateModal";

export default function NavbarComponent() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">Task Manger</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Button color="primary" variant="flat" onPress={onOpen}>
              Create
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button color="primary" variant="flat">
              Modify
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
