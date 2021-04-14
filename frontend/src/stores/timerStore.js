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
      let warning = false;
      if (remaining < 60000) { // ms
        warning = true;
      }
      if (remaining < 0) {
        return {remaining: "00:00", warning}; // can't be "", otherwise doesn't work
      }
      else {
        return {remaining: dayjs.duration(remaining).format("mm:ss"), warning}; // string
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
