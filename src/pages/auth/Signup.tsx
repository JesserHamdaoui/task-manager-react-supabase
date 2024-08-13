import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { DateInput } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Signup() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleSignup = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate,
          phone_number: phoneNumber,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
    } else if (data) {
      console.log(data);
    }
  };

  return (
    <Card>
      <CardBody className="p-10">
        <form action="" className="flex flex-col gap-7 min-w-[800px]">
          <div className="flex flex-row gap-3">
            <Input
              label="First name"
              type="text"
              className="max-w-1/2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last name"
              type="text"
              className="max-w-1/2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input
            label="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone number"
            type="tel"
            startContent={"(+216)"}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <DateInput
            label="Birth date"
            value={
              birthDate
                ? new CalendarDate(
                    parseInt(birthDate.split("-")[0]),
                    parseInt(birthDate.split("-")[1]),
                    parseInt(birthDate.split("-")[2])
                  )
                : null
            }
            onChange={(date) => setBirthDate(date.toString())}
          />
          <Input
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          <Button type="submit" onPress={handleSignup} isLoading={isLoading}>
            Submit
          </Button>
          {authError && (
            <p className="text-[#F31260] bg-[#310413] px-3 py-2 rounded-lg border-1 border-[#F31260]">
              {authError}
            </p>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
