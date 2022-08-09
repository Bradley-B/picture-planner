import { writable } from 'svelte/store';
import { updateAllMaskLayers } from './svgDomFunctions.js';

export const PIXELS_PER_INCH = 20;

// frame sizes, in inches
export const FRAME_SIZES = [
  [5, 7],
  [8.25, 11.75],
  [11, 14],
];

const createSettingsStore = () => {
  return writable({ isMaskEnabled: false });
};

const createImageDetailsStore = () => {
  const { subscribe, update } = writable({ width: 2484, height: 1398, src: 'default-image.jpg' });

  const updateStoreWithImage = image => {
    update(store => {
      store.src = image.src;
      store.width = image.width;
      store.height = image.height;
      requestAnimationFrame(() => {
        updateAllMaskLayers(store);
      })
      return store;
    });
  };

  return {
    subscribe,
    replaceImage: newFile => {
      let fileReader = new FileReader();
      const fileReaderLoad = () => {
        let image = new Image();
        image.onload = () => updateStoreWithImage(image);
        image.src = fileReader.result;
        fileReader.removeEventListener('load', fileReaderLoad);
      };
      fileReader.addEventListener('load', fileReaderLoad);
      fileReader.readAsDataURL(newFile);
    },
  }
};

const getNewFrameObject = (store) => {
  const maxId = Math.max(...[0, ...Object.values(store).map(frame => frame.id)]);
  const maxZIndex = Math.max(...[0, ...Object.values(store).map(frame => frame.zIndex)]);
  return {
    id: maxId + 1,
    zIndex: maxZIndex + 1,
    width: PIXELS_PER_INCH * FRAME_SIZES[0][0], // width is in pixels
    height: PIXELS_PER_INCH * FRAME_SIZES[0][1] // height is in pixels
  };
};

const createFramesByIdStore = () => {
  const initialState = {};
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    reset: () => set(initialState),

    addFrame: () => update(store => {
      const newFrame = getNewFrameObject(store);
      store[newFrame.id] = newFrame;
      return store;
    }),

    updateFrame: frame => update(store => {
      store[frame.id] = { ...store[frame.id], ...frame };
      return store;
    }),

    removeFrame: id => update(store => {
      delete store[id];
      return store;
    }),

    recalculateZIndexes: () => update(store => {
      return Object.values(store)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((e, i) => ({...e, zIndex: i}))
        .reduce((collection, frame) => ({...collection, [frame.id]: frame}), {});
    }),
  };
};

export const settings = createSettingsStore();
export const framesById = createFramesByIdStore();
export const imageDetails = createImageDetailsStore();