import { greetUser } from '$utils/greet';
import { js } from '$utils/landing-page/index';

window.Webflow ||= [];
window.Webflow.push(() => {
  js();
});
