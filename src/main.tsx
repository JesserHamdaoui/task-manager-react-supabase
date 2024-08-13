import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "./styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import DefaultLayout from "./layouts/default.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NextUIProvider>
      <Provider>
        <DefaultLayout>
          <main className="text-foreground bg-background">
            <App />
          </main>
        </DefaultLayout>
      </Provider>
    </NextUIProvider>
  </BrowserRouter>
);
