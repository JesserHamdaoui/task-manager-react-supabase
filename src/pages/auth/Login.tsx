import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../config/supabaseClient";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message);
      }
      setIsLoading(false);
    },
  });

  return (
    <Card>
      <CardBody className="p-10">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-7 min-w-[800px]"
        >
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
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <FontAwesomeIcon icon={faEye} className="mb-1 opacity-50" />
                ) : (
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    className="mb-1 opacity-50"
                  />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          <Button isLoading={isLoading} type="submit">
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
