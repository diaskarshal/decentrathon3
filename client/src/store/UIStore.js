// store/UIStore.js
import { makeAutoObservable } from "mobx";

export default class UIStore {
  showFlightForm = false;
  showDronesForm = false;
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
}
