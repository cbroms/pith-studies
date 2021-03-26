import { createDerivedSocketStore } from "./createDerivedSocketStore";
import { studySocket } from "./socket";

import { steps } from "../steps/steps";

const defaultState = {
  pid: "",
  step: steps.WELCOME,
  endRedirectURL: "",
  discussionURL: "",
  testType: null, // gives tutorial
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
            const json = JSON.parse(res);
            console.log("moving to instructions", json.accepted);
            // this should always work
            if (json.accepted) {
              update((s) => {
                return { ...s, step: steps.INSTRUCTIONS };
              });
            }
            else {
              update((s) => {
                return { ...s, step: steps.CANCEL };
              });
            }
            resolve();
          }
        );
      };
    },
    instructionsComplete: (pid, resolve, reject) => {
      return (socket, update) => {
        console.log("instructions_complete", pid);
        socket.emit(
          "end_instr",
          { participant_id: pid },
          (res) => {
            const json = JSON.parse(res);
            update((s) => {
              return { ...s, step: steps.TUTORIAL, testType: json.test_type };
            });
            resolve();
          }
        );
      };
    },
    tutorialComplete: (pid, resolve, reject) => {
      return (socket, update) => {
        console.log("tutorial_complete", pid);
        socket.emit(
          "end_tutorial",
          { participant_id: pid },
          (res) => {
            update((s) => {
              return { ...s, step: steps.WAITING_ROOM };
            });
            resolve();
          }
        );
      };
    },
    readyComplete: (pid, resolve, reject) => {
      return (socket, update) => {
        console.log("ready_complete", pid);
        socket.emit(
          "end_waiting",
          { participant_id: pid },
          (res) => {
            update((s) => {
              return { ...s, step: steps.WAITING_ROOM_READY_SUBMITTED };
            });
            resolve();
          }
        );
      };
    },
    surveyTaskComplete: (pid, answers, resolve, reject) => {
      return (socket, update) => {
        console.log("survey_task_complete", pid);
        socket.emit(
          "end_survey_task",
          { participant_id: pid, answers },
          (res) => {
            update((s) => {
              return { ...s, step: steps.SURVEY_PITH };
            });
            resolve();
          }
        );
      };
    },
    surveyPithComplete: (pid, answers, resolve, reject) => {
      return (socket, update) => {
        console.log("survey_pith_complete", pid);
        socket.emit(
          "end_survey_pith",
          { participant_id: pid, answers },
          (res) => {
            const json = JSON.parse(res);
            update((s) => {
              return { 
                ...s, step: steps.DONE, endRedirectURL: json.prolific_link 
              };
            });
            resolve();
          }
        );
      };
    },
    /*
    confirmReady: (resolve, reject) => {
      return (socket, update) => {
        socket.emit("ready_disc", {"participant_id": pid}, (res) => { resolve(); };
      };
    },
    confirmStart: (resolve, reject) => {
      return (socket, update) => {
        socket.emit("start_disc", {"participant_id": pid}, (res) => { 
          console.log("start_disc");
        });
      };
    },
    confirmEnd: (resolve, reject) => {
      return (socket, update) => {
        io.emit("end_disc", {"participant_id": pid}, (res) => { 
          console.log("end_disc");
        });
      };
    },
    */
    subscribeStudy: (pid) => {
      return (socket, update) => {
        socket.on("admin_initiate_ready", (res) => {
          console.log("readying...");
          update((s) => {
            return { ...s, step: steps.WAITING_ROOM_READY };
          });
        });
        socket.on("admin_start_disc", (res) => {
          console.log("start");
          const json = JSON.parse(res);
          update((s) => {
            const step = s.step;
            if (step === steps.WAITING_ROOM_READY_SUBMITTED) {
              return { 
                ...s, step: steps.DISCUSSION, discussionURL: json.disc_link 
              };
            }
            else { // no change
              return {...s};
            }
          });
        });
        socket.on("admin_end_disc", (res) => {
          console.log("end");
          update((s) => {
            const step = s.step;
            if (step === steps.DISCUSSION) {
              return { ...s, step: steps.SURVEY_TASK };
            }
            else { // no change
              return {...s};
            }
          });
        });
      };
    },
  },
  defaultState
);
