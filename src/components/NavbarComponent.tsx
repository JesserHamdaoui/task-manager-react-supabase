import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  useDisclosure,
  Input,
  User,
} from "@nextui-org/react";
import CreateModal from "./CreateModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { SearchContext } from "../Providers/SearchProvider";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

export default function NavbarComponent() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const searchContext = useContext(SearchContext);
  if (!searchContext) {
    throw new Error("SearchContext must be used within a SearchProvider");
  }
  const { search, setSearch } = searchContext;

  const location = useLocation();

  const { session, user, signOut } = useAuth();

  return (
    <>
      <Navbar className="flex flex-col justify-between">
        <NavbarBrand>
          <Link href="/">
            <p className="font-bold text-inherit">Task Manger</p>
          </Link>
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
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            isDisabled={
              location.pathname === "/login" || location.pathname === "/signup"
            }
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
              isDisabled={
                location.pathname === "/login" ||
                location.pathname === "/signup"
              }
            >
              Create a task
            </Button>
          </NavbarItem>
        </NavbarContent>

        {session ? (
          <>
            <User
              name={
                user?.user_metadata.name
                  ? user?.user_metadata.name
                  : `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`
              }
              description={user?.user_metadata.email}
            />
            <Button
              variant="light"
              color="danger"
              onPress={signOut}
              startContent={<FontAwesomeIcon icon={faSignOutAlt} />}
            >
              Logout
            </Button>
          </>
        ) : (
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
        )}
      </Navbar>
      <CreateModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
