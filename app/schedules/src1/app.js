import createcontroller from "./controller.js";

window.controller = createcontroller();
await controller.startup(); // show view and start interval times