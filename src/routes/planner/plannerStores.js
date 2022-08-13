import { get, writable } from 'svelte/store';

export const INITIAL_PIXELS_PER_INCH = 20;

// frame sizes, in inches
export const INITIAL_FRAME_SIZES = [
  [4, 6],
  [5, 7],
  [8, 10],
  [10, 13],
];

const createSettingsStore = () => {
  return writable({
    isMaskEnabled: false,
    frameSizes: INITIAL_FRAME_SIZES,
    pixelsPerInch: INITIAL_PIXELS_PER_INCH,
    frameBorderWidth: 2
  });
};

const createImageDetailsStore = () => {
  const { subscribe, update } = writable({
    sourceWidth: 2484,
    sourceHeight: 1398,
    src: 'default-image.jpg',
    displayBoundingBox: { x: 0, y: 0, width: 0, height: 0 },
  });

  const updateSvgBoundingBox = svgBoundingBox => {
    update(store => {
      store.displayBoundingBox = svgBoundingBox || document.getElementById('svg-image').getBoundingClientRect();
      return store;
    });
  };

  const updateStoreWithImage = image => {
    update(store => {
      store.src = image.src;
      store.sourceWidth = image.width;
      store.sourceHeight = image.height;
      requestAnimationFrame(() => {
        updateSvgBoundingBox();
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
    updateSvgBoundingBox,
  }
};

const getNewFrameObject = (store, selectedFrameSize) => {
  const pixelsPerInch = get(settings).pixelsPerInch;
  const svgBoundingBox = get(imageDetails).displayBoundingBox;

  const maxId = Math.max(...[0, ...Object.values(store).map(frame => frame.id)]);
  const maxZIndex = Math.max(...[0, ...Object.values(store).map(frame => frame.zIndex)]);

  const width = pixelsPerInch * selectedFrameSize[0]; // width is in pixels
  const height = pixelsPerInch * selectedFrameSize[1]; // height is in pixels

  return {
    width,
    height,
    id: maxId + 1,
    zIndex: maxZIndex + 1,
    left: svgBoundingBox.left + (svgBoundingBox.width/2) - (width/2),
    top: svgBoundingBox.top + (svgBoundingBox.height/2) - (height/2),
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