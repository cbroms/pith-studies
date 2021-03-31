import { writable } from 'svelte/store';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(duration);

let interval = null;

const createTimerStore = () => {
  const { subscribe, set, update } = writable(null, () => {
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  const initialize = (timerEnd) => {

    if (interval !== null) {
      clearInterval(interval);
    }

    const end = dayjs(timerEnd); // utc

    const createTime = () => {
      const curr = dayjs();
      const remaining = end.diff(curr);
      if (remaining < 0) {
        return "00:00"; // can't be "", otherwise doesn't work
      }
      else {
        return dayjs.duration(remaining).format("mm:ss"); // string
      }
    }; 
    set(createTime());

    interval = setInterval(() => {
      update((s) => {
        const left = createTime();
        return left;
      });
    }, 1000); // run every 1000 milliseconds   
  };

  return {
    subscribe,
    initialize,
  }
};

export const timerStore = createTimerStore();
