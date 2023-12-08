import controller from "./events/controller.js";
import { addClientEventListener } from "./events/observer.js";
import { buildDependencies } from "./dependencies.js";

addClientEventListener("connectionComplete", onConnectionComplete);
addClientEventListener("resourceStop", onResourceStop);

function onConnectionComplete() {
  const deps = buildDependencies(undefined);

  controller.add(deps.StartupHandler());
}

function onResourceStop() {
  controller.stop();
}
