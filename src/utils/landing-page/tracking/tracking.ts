import { clearFormField } from '@finsweet/ts-utils';
import type { CMSList } from 'src/types/CMSList';

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

  // Prevent form from submitting and return Tracking ID
  form?.addEventListener('submit', (e) => {
    // Prevent form from submitting
    e.preventDefault();

    // Get form data object
    const formData = Object.fromEntries(new FormData(e.target).entries());
    const input = form.querySelector('[name="trackingID"]');
    // Triggers tracker with tracking ID from form data object
    startTracker(formData.trackingID);
    clearFormField(input);
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
        const tracking = await fetchTracking(providedID);
        if (!tracking.trackData) return;

        // Array of checkpoints from the tracking object
        const checkpoints = tracking.trackData.data.items[0].origin_info.trackinfo;
        if (!checkpoints) {
          errorHandling(
            'Ingen information tillgänglig: Tyvärr kunde ingen information hittas för det spårnings-ID du har angett. Var vänlig försök igen senare.'
          );
        }

        // Populate UI elements
        const mainStatus = uppercaseFirstLetter(tracking.trackData.data.items[0].status);
        const carrier = tracking.carrier.name;
        const id = tracking.trackData.data.items[0].tracking_number;
        const latestCheckpoint = tracking.trackData.data.items[0].lastEvent;

        // Remove the placeholder items
        listInstance.clearItems();

        // Create the items from the extenal data
        const newItems = checkpoints.map((checkpoint) => newItem(checkpoint, itemTemplateElement));

        // Feed the new items into the CMSList
        await listInstance.addItems(newItems);

        // Tracking object received successfully
        trackingReceived(mainStatus, id, carrier, latestCheckpoint);
      },
    ]);

    const fetchTracking = async (trackingID) => {
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

        return tracking;
      } catch (error) {}
    };

    const errorHandling = (errorMessage) => {
      container?.classList.remove('tracking_container--init');
      container?.classList.add('tracking_container--error');
      errorMessageEl.textContent = errorMessage;
    };

    const trackingReceived = (mainStatusText, idText, carrierText, latestCheckpointText) => {
      // Remove loading UI and show tracking
      container?.classList.remove('tracking_container--init');
      container?.classList.add('tracking_container--success');
      //mainStatus?.classList.add('tracking_status-text--success');

      // Change text of elements
      mainStatus.textContent = uppercaseFirstLetter(mainStatusText);
      id.textContent = idText;
      carrier.textContent = carrierText;
      latestCheckpoint.textContent = latestCheckpointText;
    };

    // Takes word and returns first letter uppercased
    const uppercaseFirstLetter = (word) => {
      const lowercaseAll = word.toLowerCase();
      const final = lowercaseAll.charAt(0).toUpperCase() + lowercaseAll.slice(1);
      return final;
    };

    const newItem = (tracking, templateElement: HTMLDivElement) => {
      // Clone the template element
      const newItem = templateElement.cloneNode(true) as HTMLDivElement;

      // Query the internal element of the item
      const date = newItem.querySelector('[data-element="date"]');
      const status = newItem.querySelector('[data-element="status"]');
      const time = newItem.querySelector('[data-element="time"]');
      const location = newItem.querySelector('[data-element="location"]');
      const checkpoint = newItem.querySelector('[data-element="piece-id"]');

      // Populate the internal items
      if (status) status.textContent = tracking.StatusDescription;
      if (time && date) [date.textContent, time.textContent] = `${tracking.Date}`.split(' ');
      if (location) location.textContent = tracking.Details;
      if (checkpoint) checkpoint.textContent = uppercaseFirstLetter(tracking.checkpoint_status);

      return newItem;
    };
  };
};
