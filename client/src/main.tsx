import { createRoot } from "react-dom/client";
import "./theme.css";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "./components/ui/toaster.tsx";
import SocketProvider from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SocketProvider>
          <App />
        </SocketProvider>
        <Toaster />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
