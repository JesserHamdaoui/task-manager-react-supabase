import { supabase } from "../config/supabaseClient";
import { useAuth } from "../hooks/AuthProvider";
import {
  faLaptop,
  faPhone,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Divider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  User,
} from "@nextui-org/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTheme } from "../hooks/use-theme";
import AvatarModal from "./AvatarModal";

export default function ProfilePopover() {
  const { user, signOut } = useAuth();

  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Required")
      .matches(/^(2|9|5|4|7|3)[0-9]{7}$/, "Invalid phone number"),
  });

  const formik = useFormik({
    initialValues: {
      phone: user?.phone
        ? user?.phone
        : user?.user_metadata.phone_number
          ? user?.user_metadata.phone_number
          : "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.phone) {
        const { error } = await supabase.auth.updateUser({
          phone: "216" + values.phone,
        });
        if (error) {
          console.error(error);
        } else {
          window.location.reload();
        }
      }
    },
  });

  const { theme, setLightTheme, setDarkTheme } = useTheme();

  const handleThemeChange = (theme: string) => {
    switch (theme) {
      case "light":
        setLightTheme();
        break;
      case "dark":
        setDarkTheme();
        break;
      case "system":
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (systemPrefersDark) {
          setDarkTheme();
        } else {
          setLightTheme();
        }
        break;
      default:
        console.warn("Unknown theme:", theme);
        break;
    }
  };

  return (
    <>
      <Popover placement="bottom-end" showArrow offset={25}>
        <PopoverTrigger>
          <Button isIconOnly variant="light">
            {user?.user_metadata.avatar_url ? (
              <Avatar src={user?.user_metadata.avatar_url} />
            ) : (
              <Avatar
                name={
                  user?.user_metadata.name
                    ? user?.user_metadata.name
                    : `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`
                }
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 flex flex-col items-start">
          {user?.user_metadata.avatar_url ? (
            <User
              avatarProps={{ src: user?.user_metadata.avatar_url }}
              name={
                user?.user_metadata.name
                  ? user?.user_metadata.name
                  : `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`
              }
              description={user?.user_metadata.email}
            />
          ) : (
            <User
              name={
                user?.user_metadata.name
                  ? user?.user_metadata.name
                  : `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`
              }
              description={user?.user_metadata.email}
            />
          )}
          <AvatarModal />

          <Divider className="my-3" />

          {user?.phone ||
          user?.user_metadata.phone_number ||
          user?.new_phone ? (
            <Input
              startContent={
                <div className="flex flex-row gap-2 items-center mt-1">
                  <FontAwesomeIcon icon={faPhone} /> (+216)
                </div>
              }
              value={
                user?.phone
                  ? user?.phone
                  : user?.user_metadata.phone_number
                    ? user?.user_metadata.phone_number
                    : user?.new_phone?.substring(3)
              }
              disabled
              label="Phone number"
            />
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Input
                startContent={
                  <div className="flex flex-row gap-2 items-center mt-1">
                    <FontAwesomeIcon icon={faPhone} /> (+216)
                  </div>
                }
                label="Phone number"
                description="Enter and verify your phone number"
                endContent={
                  <Button variant="light" onClick={() => formik.handleSubmit()}>
                    Confirm
                  </Button>
                }
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="phone"
                errorMessage={
                  formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : null
                }
                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
              />
            </form>
          )}

          <Divider className="my-3" />

          <RadioGroup
            label="Switch the theme of the app"
            value={theme}
            onChange={(e) => {
              handleThemeChange(e.target.value);
            }}
          >
            <Radio value="dark">Dark</Radio>
            <Radio value="light">Light</Radio>
          </RadioGroup>
          <Button
            startContent={<FontAwesomeIcon icon={faLaptop} />}
            onPress={() => handleThemeChange("system")}
            fullWidth
            className="mt-4"
            variant="light"
          >
            System
          </Button>

          <Divider className="my-3" />

          <Button
            variant="light"
            color="danger"
            onPress={signOut}
            startContent={<FontAwesomeIcon icon={faSignOutAlt} />}
            fullWidth
          >
            Logout
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}
