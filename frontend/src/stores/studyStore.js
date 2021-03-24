import { createDerivedSocketStore } from "./createDerivedSocketStore";
import { studySocket } from "./socket";

import { steps } from "../steps/steps";

const defaultState = {
  pid: "",
  step: steps.WELCOME,
  endRedirectURL: "",
  discussionURL: "",
};

export const studyStore = createDerivedSocketStore(
  studySocket,
  {
    joinStudy: (pid, resolve, reject) => {
      return (socket, update) => {
        console.log("join_study");
        socket.emit("join_study", { participant_id: pid }, (res) => {
          // this should always work
          update((s) => {
            return { ...s, step: steps.CONSENT, pid: pid };
          });
        });
      };
    },
    consentComplete: (
      pid,
      response1,
      response2,
      response3,
      resolve,
      reject
    ) => {
      return (socket, update) => {
        console.log("consent_complete");

        socket.emit(
          "end_consent",
          { participant_id: pid, response1, response2, response3 },
          (res) => {
            const canContinue = JSON.parse(res);
            console.log(canContinue);
            // // this should always work
            // update((s) => {
            //   return { ...s, step: steps.CONSENT, pid: pid };
            // });
          }
        );

        update((s) => {
          return { ...s, step: steps.INSTRUCTIONS };
        });

        resolve();
      };
    },

    instructionsComplete: (pid, resolve, reject) => {
      return (socket, update) => {
        console.log("instructions_complete", pid);
        update((s) => {
          return { ...s, step: steps.WAITING_ROOM };
        });

        resolve();
      };
    },

    readyComplete: (pid, resolve, reject) => {
      return (socket, update) => {
        console.log("ready_complete", pid);
        update((s) => {
          return { ...s, step: steps.WAITING_ROOM_READY_SUBMITTED };
        });
        resolve();
      };
    },
    subscribe: () => {
      return (socket, update) => {
        // socket.on("join_disc", (res) => {
        //   console.log("joined");
        //   const json = JSON.parse(res);
        //   update((state) => {
        //     return {
        //       ...state,
        //       participants: [...state.participants, json.user],
        //     };
        //   });
        // });
        // socket.on("leave_disc", (res) => {
        //   console.log("left");
        //   const json = JSON.parse(res);
        //   update((state) => {
        //     let participants = [...state.participants];
        //     participants = participants.filter((e) => {
        //       return e.id !== json.user.id;
        //     });
        //     return {
        //       ...state,
        //       participants: participants,
        //     };
        //   });
        // });
      };
    },
  },
  defaultState
);
