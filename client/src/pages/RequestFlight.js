import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import DroneTrackerMap from "../components/DroneTrackerMap";
import RequestFlight from "../components/RequestFlight";

const MainPage = observer(() => {
  const { ui } = useContext(Context);

  return (
    <>
      <DroneTrackerMap />
      <RequestFlight show={ui.showForm} handleClose={() => ui.closeForm()} />
    </>
  );
});

export default MainPage;
