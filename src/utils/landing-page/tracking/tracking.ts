import { clearFormField, getFormFieldValue } from '@finsweet/ts-utils';
import type { CMSList } from 'src/types/CMSList';

import type { Tracking } from './types';

export const tracking = function () {
  const form = document.querySelector<HTMLFormElement>('[data-element="form"]');
  const submitBtn = form?.querySelector('.button');
  const container = document.querySelector('.tracking_container');
  const errorMessageEl = document.querySelector('[data-element="error-message"]');
  const mainStatus = document.querySelector('[data-element="main-status"]');
  const id = document.querySelector('[data-element="id"]');
  const carrier = document.querySelector('[data-element="carrier"]');
  const latestCheckpoint = document.querySelector('[data-element="latest-status"]');

  let trackingObj;

  submitBtn?.addEventListener('click', () => {
    const input = form.querySelector('[name="Tracking-ID"]');
    if (getFormFieldValue(input)) {
      startTracker(getFormFieldValue(input));
      clearFormField(input);
    }
  });

  const startTracker = function (providedID) {
    container?.classList.remove('tracking_container--error');
    container?.classList.remove('tracking_container--success');
    container?.classList.remove('tracking_container--init');
    container?.classList.add('tracking_container--init');
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      'cmsload',
      async (listInstances: CMSList[]) => {
        // Get the list instance
        const [listInstance] = listInstances;

        // Save a copy of the template element
        const [item] = listInstance.items;
        const itemTemplateElement = item.element;

        // Fetch external data
        const trackings = await fetchTracking(providedID);
        if (!trackings) return;

        // Remove the placeholder items
        listInstance.clearItems();

        // Create the items from the extenal data
        const newItems = trackings.map((tracking) => newItem(tracking, itemTemplateElement));

        // Feed the new items into the CMSList
        await listInstance.addItems(newItems);

        // Success
        successHandling();
      },
    ]);

    const fetchTracking = async (trackingID): Promise<Tracking[]> => {
      try {
        const response = await fetch('https://intebarapost.onrender.com/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ number: trackingID }),
        });
        const tracking = await response.json();
        if (!tracking.trackData) {
          errorHandling(tracking.message);
        }

        const trackingEvents: Tracking[] = tracking.trackData.data.items[0].origin_info.trackinfo;
        trackingObj = tracking;

        return trackingEvents;
      } catch (error) {}
    };

    const errorHandling = (errorMessage) => {
      container?.classList.remove('tracking_container--init');
      container?.classList.add('tracking_container--error');
      errorMessageEl.textContent = errorMessage;
    };

    const successHandling = () => {
      container?.classList.remove('tracking_container--init');
      container?.classList.add('tracking_container--success');
      mainStatus?.classList.add('tracking_status-text--success');

      mainStatus.textContent = uppercaseFirstLetter(trackingObj.trackData.data.items[0].status);
      carrier.textContent = trackingObj.carrier.name;
      id.textContent = trackingObj.trackData.data.items[0].tracking_number;
      latestCheckpoint.textContent = trackingObj.trackData.data.items[0].lastEvent;
    };

    const uppercaseFirstLetter = (word) => {
      const final = `${word}`.charAt(0).toUpperCase() + `${word}`.slice(1);
      return final;
    };

    const newItem = (tracking: Tracking, templateElement: HTMLDivElement) => {
      // Clone the template element
      const newItem = templateElement.cloneNode(true) as HTMLDivElement;

      // Query the internal element of the item
      const date = newItem.querySelector<HTMLParagraphElement>('[data-element="date"]');
      const status = newItem.querySelector<HTMLParagraphElement>('[data-element="status"]');
      const time = newItem.querySelector<HTMLParagraphElement>('[data-element="time"]');
      const location = newItem.querySelector<HTMLParagraphElement>('[data-element="location"]');
      const checkpoint = newItem.querySelector<HTMLParagraphElement>('[data-element="piece-id"]');

      // Populate the internal items
      if (status) status.textContent = tracking.StatusDescription;
      if (time && date) [date.textContent, time.textContent] = `${tracking.Date}`.split(' ');
      if (location) location.textContent = tracking.Details;
      if (checkpoint) checkpoint.textContent = uppercaseFirstLetter(tracking.checkpoint_status);

      return newItem;
    };
  };
};
