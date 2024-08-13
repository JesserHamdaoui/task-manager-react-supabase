import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../config/supabaseClient";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else if (data) {
    }
    setIsLoading(false);
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Card>
      <CardBody className="p-10">
        <form action="" className="flex flex-col gap-7 min-w-[800px]">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Button isLoading={isLoading} onPress={handleLogin} type="submit">
            Submit
          </Button>
          {error && (
            <p className="text-[#F31260] bg-[#310413] px-3 py-2 rounded-lg border-1 border-[#F31260]">
              {error}
            </p>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
