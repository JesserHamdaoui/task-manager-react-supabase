import { supabase } from "../config/supabaseClient";
import { useAuth } from "../hooks/AuthProvider";
import { faPhone, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
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
import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

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
          phone: values.phone,
        });
        if (error) {
          console.error(error);
        }
      }
    },
  });

  const [theme, setTheme] = useState<string | null>("dark");

  return (
    <>
      <Popover placement="bottom-end" showArrow offset={25}>
        <PopoverTrigger>
          <Button isIconOnly variant="light">
            <Avatar
              name={
                user?.user_metadata.name
                  ? user?.user_metadata.name
                  : `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`
              }
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 flex flex-col items-start">
          <User
            name={
              user?.user_metadata.name
                ? user?.user_metadata.name
                : `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`
            }
            description={user?.user_metadata.email}
          />

          <Divider className="my-3" />

          {formik.values.phone ? (
            <Input
              startContent={
                <div className="flex flex-row gap-2 items-center mt-1">
                  <FontAwesomeIcon icon={faPhone} /> (+216)
                </div>
              }
              value={formik.values.phone}
              disabled
              label="Phone number"
            />
          ) : (
            <Input
              startContent={
                <div className="flex flex-row gap-2 items-center mt-1">
                  <FontAwesomeIcon icon={faPhone} /> (+216)
                </div>
              }
              label="Phone number"
              description="Enter and verify your phone number"
              endContent={<Button variant="light">Confirm</Button>}
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.phone && formik.errors.phone
                  ? formik.errors.phone
                  : null
              }
              isInvalid={!!(formik.touched.phone && formik.errors.phone)}
            />
          )}

          <Divider className="my-3" />

          <RadioGroup
            label="Switch the theme of the app"
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
            }}
          >
            <Radio value="dark">Dark</Radio>
            <Radio value="light">Light</Radio>
            <Radio value="system">System</Radio>
          </RadioGroup>

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
