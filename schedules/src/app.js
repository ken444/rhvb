import createvm from "./vm.js";
import createcontroller from "./controller.js";

window.vm = createvm();

window.controller = createcontroller();

controller.startup(); // show view and start interval times
