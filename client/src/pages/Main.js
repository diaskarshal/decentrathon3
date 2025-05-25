import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import DroneTrackerMap from "../components/DroneTrackerMap";
import RequestFlight from "../components/RequestFlight";
import DronesForm from "../components/DronesForm";

const MainPage = observer(() => {
  const { ui } = useContext(Context);

  return (
    <>
      <DroneTrackerMap />
      <RequestFlight show={ui.showFlightForm} handleClose={() => ui.closeFlightForm()} />
      <DronesForm show={ui.showDronesForm} handleClose={() => ui.closeDronesForm()} />
    </>
  );
});

export default MainPage;
