import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { DateInput, Divider } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Yup from "yup";
import { useFormik } from "formik";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function Signup() {
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    firstName: Yup.string()
      .required("Required")
      .max(50, "First name must be at most 50 characters")
      .min(2, "First name must be at least 2 characters")
      .matches(/^[A-Za-z]+$/, "First name must not contain numbers"),
    lastName: Yup.string()
      .required("Required")
      .max(50, "Last name must be at most 50 characters")
      .min(2, "Last name must be at least 2 characters")
      .matches(/^[A-Za-z]+$/, "Last name must not contain numbers"),
    phoneNumber: Yup.string()
      .required("Required")
      .matches(/^(2|9|5|4|7|3)[0-9]{7}$/, "Invalid phone number"),
    birthDate: Yup.date()
      .required("Required")
      .max(new Date(), "Birth date must be in the past"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            birth_date: values.birthDate,
            phone_number: values.phoneNumber,
          },
        },
      });

      if (error) {
        setError(error.message);
      }
      setIsLoading(false);
    },
  });

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://localhost:5173/signup",
      },
    });
    if (error) {
      setError(error.message);
    }
  };

  const handleFacebookAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: "https://localhost:5173/signup",
      },
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <Card>
      <CardBody className="p-10">
        <div className="flex flex-row justify-between gap-3">
          <Button
            isIconOnly
            className="w-1/2 py-7 text-lg"
            onPress={handleGoogleAuth}
          >
            <FontAwesomeIcon icon={faGoogle} />
          </Button>
          <Button
            isIconOnly
            className="w-1/2 py-7 text-lg"
            onPress={handleFacebookAuth}
          >
            <FontAwesomeIcon icon={faFacebook} />
          </Button>
        </div>
        <Divider className="my-7" />
        <form
          className="flex flex-col gap-7 min-w-[800px]"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-row gap-3">
            <Input
              label="First name"
              type="text"
              className="max-w-1/2"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.firstName && formik.errors.firstName
                  ? formik.errors.firstName
                  : null
              }
              isInvalid={
                !!(formik.touched.firstName && formik.errors.firstName)
              }
            />
            <Input
              label="Last name"
              type="text"
              className="max-w-1/2"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.lastName && formik.errors.lastName
                  ? formik.errors.lastName
                  : null
              }
              isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
            />
          </div>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : null
            }
            isInvalid={!!(formik.touched.email && formik.errors.email)}
          />
          <Input
            label="Phone number"
            type="tel"
            name="phoneNumber"
            startContent={"(+216)"}
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? formik.errors.phoneNumber
                : null
            }
            isInvalid={
              !!(formik.touched.phoneNumber && formik.errors.phoneNumber)
            }
          />
          <DateInput
            label="Birth date"
            name="birthDate"
            value={
              formik.values.birthDate
                ? new CalendarDate(
                    parseInt(formik.values.birthDate.split("-")[0]),
                    parseInt(formik.values.birthDate.split("-")[1]),
                    parseInt(formik.values.birthDate.split("-")[2])
                  )
                : null
            }
            onChange={(date) =>
              formik.setFieldValue("birthDate", date.toString())
            }
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.birthDate && formik.errors.birthDate
                ? formik.errors.birthDate
                : null
            }
            isInvalid={!!(formik.touched.birthDate && formik.errors.birthDate)}
          />
          <Input
            label="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : null
            }
            isInvalid={!!(formik.touched.password && formik.errors.password)}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                aria-label="toggle password visibility"
              >
                {isPasswordVisible ? (
                  <FontAwesomeIcon icon={faEye} className="mb-1 opacity-50" />
                ) : (
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    className="mb-1 opacity-50"
                  />
                )}
              </button>
            }
            type={isPasswordVisible ? "text" : "password"}
          />
          <Input
            label="Confirm password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : null
            }
            isInvalid={
              !!(
                formik.touched.confirmPassword && formik.errors.confirmPassword
              )
            }
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
                aria-label="toggle password visibility"
              >
                {isConfirmPasswordVisible ? (
                  <FontAwesomeIcon icon={faEye} className="mb-1 opacity-50" />
                ) : (
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    className="mb-1 opacity-50"
                  />
                )}
              </button>
            }
            type={isConfirmPasswordVisible ? "text" : "password"}
          />
          <Button type="submit" isLoading={isLoading}>
            Submit
          </Button>
          {error && (
            <p className="text-[#F31260] bg-[#310413] px-3 py-2 rounded-lg ">
              {error}
            </p>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
