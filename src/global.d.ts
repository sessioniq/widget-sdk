import * as Vue from "vue";

declare global {
  interface Window {
    Vue?: typeof Vue;
  }
}
