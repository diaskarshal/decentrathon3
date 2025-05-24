import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Main = observer(() => {
  return (
    <div>
      <h1>Main Page</h1>
      {}
    </div>
  );
});

export default Main;