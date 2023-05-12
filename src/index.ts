import { intebarapost } from '$utils/landing-page/index';
import { tracking } from '$utils/landing-page/tracking/tracking';

window.Webflow ||= [];
window.Webflow.push(() => {
  tracking();
  intebarapost();
});
