import { Tabs, Tab } from "@nextui-org/react";
import Signup from "./Signup";
import Login from "./Login";
import { useLocation, useNavigate } from "react-router-dom";

export default function Authentication() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleTabChange = (key: string | number) => {
    navigate(key === "/login" ? "/login" : "/signup");
  };

  return (
    <div className="w-full flex justify-center items-center pt-5">
      <div className="max-w-[1000px] m-auto py-16 px-10 rounded-xl">
        <h1 className="text-3xl text-center font-semibold">Task Manager</h1>
        <p className="text-center">Join us now!</p>
        <Tabs
          variant="underlined"
          selectedKey={location.pathname}
          onSelectionChange={(key) => handleTabChange(key)}
        >
          <Tab key="/login" title="Log in">
            <Login />
          </Tab>
          <Tab key="/signup" title="Sign up">
            <Signup />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
