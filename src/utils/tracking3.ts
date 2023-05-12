// import { clearFormField } from '@finsweet/ts-utils';

// export const tracking2 = function () {
//   // ELEMENTS //
//   const form = document.querySelector('[data-element="form"]');
//   const container = document.querySelector('[data-element="container"]');
//   const errorMessageEl = document.querySelector('[data-element="error-message"]');
//   const mainStatus = document.querySelector('[data-element="main-status"]');
//   const id = document.querySelector('[data-element="id"]');
//   const carrier = document.querySelector('[data-element="carrier"]');
//   const latestCheckpoint = document.querySelector('[data-element="latest-status"]');

//   // List element
//   let listInstance;
//   let templateElement;

//   // EVENT LISTENERS //

//   // Prevent form from submitting and return Tracking ID
//   form?.addEventListener('submit', (e) => {
//     // Prevent form from submitting
//     e.preventDefault();

//     // Get form data object
//     const formData = Object.fromEntries(new FormData(e.target).entries());

//     // Triggers tracker with tracking ID from form data object
//     tracker(formData.trackingID);
//   });

//   const tracker = function (trackingID) {
//     // Set up UI
//     container.classList.remove('tracking_container--error');
//     container.classList.remove('tracking_container--success');
//     container.classList.remove('tracking_container--init');
//     container.classList.add('tracking_container--init');

//     // Initialize fsAttributes
//     window.fsAttributes = window.fsAttributes || [];
//     window.fsAttributes.push([
//       'cmsload',
//       async (listInstances) => {
//         // Get the list instance
//         [listInstance] = listInstances;

//         // Save a copy of template element
//         const item = listInstance.items[0];
//         templateElement = item.element;

//         // Fetch external data
//         const tracking = await fetchTracking(trackingID);

//         // Data we want from tracking object //

//         // Array of checkpoints from the tracking object
//         const checkpoints = tracking.trackData.data.items[0].origin_info.trackInfo;

//         // Status headline
//         const mainStatus = uppercaseFirstLetter(tracking.trackData.data.items[0].status);

//         // Name of carrier
//         const carrier = tracking.carrier.name;

//         // Tracking ID (from object)
//         const id = tracking.trackData.data.items[0].tracking_number;

//         // Latest tracking checkpoint
//         const latestCheckpoint = tracking.trackData.data.items[0].lastEvent;

//         // Tracking object received successfully
//         trackingReceived(mainStatus, id, carrier, latestCheckpoint);

//         // Clears checkpoint items
//         listInstance.clearItems();

//         // Creates new checkpoint items from tracking object
//         const newCheckpoints = checkpoints.map((checkpoint) => {
//           newCheckpoint(checkpoint, templateElement);
//         });

//         await listInstance.addItems(newCheckpoints);
//       },
//     ]);
//   };

//   const fetchTracking = async (trackingID) => {
//     try {
//       const response = await fetch('https://intebarapost.onrender.com/api/track', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(trackingID),
//       });
//       const tracking = await response.json();

//       return tracking;
//     } catch (error) {}
//   };

//   const trackingReceived = (mainStatusText, idText, carrierText, latestCheckpointText) => {
//     // Remove loading UI and show tracking
//     container?.classList.remove('tracking_container--init');
//     container?.classList.add('tracking_container--success');
//     //mainStatus?.classList.add('tracking_status-text--success');

//     // Change text of elements
//     mainStatus.textContent = mainStatusText;
//     id.textContent = idText;
//     carrier.textContent = carrierText;
//     latestCheckpoint.textContent = latestCheckpointText;
//   };

//   // Takes word and returns first letter uppercased
//   const uppercaseFirstLetter = (word) => {
//     const lowercaseAll = word.toLowerCase();
//     const final = lowercaseAll.charAt(0).toUpperCase() + lowercaseAll.slice(1);
//     return final;
//   };

//   // Creates a new checkpoint item

//   const newCheckpoint = (checkpoint, templateElement) => {
//     // Clone template element
//     const newCheckpoint = templateElement.cloneNode(true);

//     // Query internal elements of checkpoint
//     const date = newCheckpoint.querySelector('[data-element="date"]');
//     const status = newCheckpoint.querySelector('[data-element="status"]');
//     const time = newCheckpoint.querySelector('[data-element="time"]');
//     const location = newCheckpoint.querySelector('[data-element="location"]');
//     const checkpointStatus = newCheckpoint.querySelector('[data-element="piece-id"]');

//     // Populate internal items
//     if (status) status.textContent = checkpoint.StatusDescription;
//     if (time && date) [date.textContent, time.textContent] = `${checkpoint.Date}`.split(' ');
//     if (location) location.textContent = checkpoint.Details;
//     if (checkpointStatus)
//       checkpointStatus.textContent = uppercaseFirstLetter(checkpoint.checkpoint_status);
//   };
// };
