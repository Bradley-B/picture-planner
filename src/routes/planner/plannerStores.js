import { writable } from 'svelte/store';

export const FRAME_SIZE_MULTIPLIER = 20;

export const FRAME_SIZES = [
  [5, 7],
  [8.25, 11.75],
  [11, 14],
];

const getNewFrameObject = (store) => {
  const maxId = Math.max(...[0, ...Object.values(store).map(frame => frame.id)]);
  const maxZIndex = Math.max(...[0, ...Object.values(store).map(frame => frame.zIndex)]);
  return {
    id: maxId + 1,
    zIndex: maxZIndex + 1,
    width: FRAME_SIZE_MULTIPLIER * FRAME_SIZES[0][0],
    height: FRAME_SIZE_MULTIPLIER * FRAME_SIZES[0][1]
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

export const framesById = createFramesByIdStore();