import { makeAutoObservable } from "mobx";

export default class UIStore {
  showFlightForm = false;
  showDronesForm = false;
  showNoFlyZoneForm = false;
  
  constructor() {
    makeAutoObservable(this);
  }

  openFlightForm() {
    this.showFlightForm = true;
  }

  closeFlightForm() {
    this.showFlightForm = false;
  }

  openDronesForm() {
    this.showDronesForm = true;
  }

  closeDronesForm() {
    this.showDronesForm = false;
  }

  openNoFlyZoneForm() {
    this.showNoFlyZoneForm = true;
  }

  closeNoFlyZoneForm() {
    this.showNoFlyZoneForm = false;
  }
}
