import "bootstrap/dist/css/bootstrap.min.css";
import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MainPage from "./main/MainPage";
import UIStore from "./store/UIStore";


export const Context = createContext();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Context.Provider
    value={{
      user: new MainPage(),
      ui: new UIStore(),
    }}
  >
    <App />
  </Context.Provider>
);