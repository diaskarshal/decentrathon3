// store/UIStore.js
import { makeAutoObservable } from "mobx";

export default class UIStore {
  showFlightForm = false;

  constructor() {
    makeAutoObservable(this);
  }

  openForm() {
    this.showFlightForm = true;
  }

  closeForm() {
    this.showFlightForm = false;
  }
}
