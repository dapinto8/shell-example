import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();

const loadApp = function(name, url){

  let div = document.createElement('div');
  div.id = 'single-spa-application:'+name;
  div.className = name;
  document.body.appendChild(div);

  System.set(url, {
    exportedFunction: name
  });

  registerApplication({
    name: name,
    app: () => System.import(url),
    activeWhen: "/",
  });

}

const _global = (window /* browser */ || global /* node */) as any
_global.loadApp = loadApp;