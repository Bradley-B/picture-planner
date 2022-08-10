import { get, writable } from 'svelte/store';
import { updateAllMaskLayers } from './svgDomFunctions.js';

export const INITIAL_PIXELS_PER_INCH = 20;

// frame sizes, in inches
export const INITIAL_FRAME_SIZES = [
  [4, 6],
  [5, 7],
  [8.25, 11.75],
  [11, 14],
];

const createSettingsStore = () => {
  return writable({ isMaskEnabled: false, frameSizes: INITIAL_FRAME_SIZES, pixelsPerInch: INITIAL_PIXELS_PER_INCH });
};

const createImageDetailsStore = () => {
  const { subscribe, update } = writable({ width: 2484, height: 1398, src: 'default-image.jpg', widthInches: 0, heightInches: 0 });

  const updateStoreWithImageInches = () => {
    update(store => {
      const pixelsPerInch = get(settings).pixelsPerInch;
      const svgBoundingBox = document.getElementById('svg-image').getBoundingClientRect()
      store.widthInches = Math.round(svgBoundingBox.width * (1/pixelsPerInch) * 100) / 100;
      store.heightInches = Math.round(svgBoundingBox.height * (1/pixelsPerInch) * 100) / 100;
      return store;
    });
  };

  const updateStoreWithImage = image => {
    update(store => {
      store.src = image.src;
      store.width = image.width;
      store.height = image.height;
      requestAnimationFrame(() => {
        updateAllMaskLayers(store);
        updateStoreWithImageInches();
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
    recalculateInches: updateStoreWithImageInches,
  }
};

const getNewFrameObject = (store, selectedFrameSize) => {
  const pixelsPerInch = get(settings).pixelsPerInch;
  const maxId = Math.max(...[0, ...Object.values(store).map(frame => frame.id)]);
  const maxZIndex = Math.max(...[0, ...Object.values(store).map(frame => frame.zIndex)]);
  return {
    id: maxId + 1,
    zIndex: maxZIndex + 1,
    width: pixelsPerInch * selectedFrameSize[0], // width is in pixels
    height: pixelsPerInch * selectedFrameSize[1], // height is in pixels
    widthInches: selectedFrameSize[0],
    heightInches: selectedFrameSize[1],
  };
};

const createFramesByIdStore = () => {
  const initialState = {};
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    reset: () => set(initialState),

    addFrame: selectedFrameSize => update(store => {
      const newFrame = getNewFrameObject(store, selectedFrameSize);
      store[newFrame.id] = newFrame;
      return store;
    }),

    updateFrame: frame => update(store => {
      store[frame.id] = { ...store[frame.id], ...frame };
      return store;
    }),

    recalculateFrameSizes: newPixelsPerInch => update(store => {
      requestAnimationFrame(() => {
        updateAllMaskLayers(get(imageDetails));
      });

      for (let frame of Object.values(store)) {
        store[frame.id] = {
          ...store[frame.id],
          width: frame.widthInches * newPixelsPerInch,
          height: frame.heightInches * newPixelsPerInch
        };
      }
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