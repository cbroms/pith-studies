import dayjs from "dayjs";

import { createDerivedSocketStore } from "./createDerivedSocketStore";
import { studySocket } from "./socket";

import { steps } from "../steps/steps";

const defaultState = {
  valid: null,
  session: "",
  pid: "",
  step: steps.WELCOME,
  endRedirectURL: "",
  discussionURL: "",
  testType: null, // gives tutorial
  timerEnd: null, // timer 
  readyEnd: null, // timer
  discEnd: null, // timer
};

export const studyStore = createDerivedSocketStore(
  studySocket,
  {
    checkSession: (session, pid, resolve, reject) => {
      if (!pid)
        pid = "default";
      return (socket, update) => {
        socket.emit("test_connect", {session, participant_id: pid}, (res) => {
          const json = JSON.parse(res);
          console.log("valid", json.valid);
          update((s) => {
            return { ...s, valid: json.valid };
          });
          resolve();
        });
      }
    },
    joinStudy: (session, pid, resolve, reject) => {
      return (socket, update) => {
        console.log("join_study");
        socket.emit("join_study", { session, participant_id: pid }, (res) => {
          const json = JSON.parse(res);
          update((s) => {
            return { 
              ...s, 
              session: session, 
              pid: pid,
              step: steps.CONSENT,
              timerEnd: json.timer_end,
            };
          });
          resolve();
        });
      };
    },
    consentComplete: (
      session,
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
          { session, participant_id: pid, response1, response2, response3 },
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
                return { ...s }; // stay on same page
              });
            }
            resolve();
          }
        );
      };
    },
    instructionsComplete: (session, pid, resolve, reject) => {
      return (socket, update) => {
        console.log("instructions_complete", pid);
        socket.emit(
          "end_instr",
          { session, participant_id: pid },
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
    tutorialComplete: (session, pid, resolve, reject) => {
      return (socket, update) => {
        console.log("tutorial_complete", pid);
        socket.emit(
          "end_tutorial",
          { session, participant_id: pid },
          (res) => {
            update((s) => {
              return { ...s, step: steps.WAITING_ROOM };
            });
            resolve();
          }
        );
      };
    },
    readyComplete: (session, pid, resolve, reject) => {
      return (socket, update) => {
        console.log("ready_complete", pid);
        socket.emit(
          "end_waiting",
          { session, participant_id: pid },
          (res) => {
            update((s) => {
              return { ...s, step: steps.WAITING_ROOM_READY_SUBMITTED };
            });
            resolve();
          }
        );
      };
    },
    surveyTaskComplete: (session, pid, answers, resolve, reject) => {
      return (socket, update) => {
        console.log("survey_task_complete", pid);
        socket.emit(
          "end_survey_task",
          { session, participant_id: pid, answers },
          (res) => {
            update((s) => {
              return { ...s, step: steps.SURVEY_PITH };
            });
            resolve();
          }
        );
      };
    },
    surveyPithComplete: (session, pid, answers, resolve, reject) => {
      return (socket, update) => {
        console.log("survey_pith_complete", pid);
        socket.emit(
          "end_survey_pith",
          { session, participant_id: pid, answers },
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
    subscribeStudy: (session, pid) => {
      return (socket, update) => {
        socket.on("admin_initiate_ready", (res) => {
          console.log("readying...");
            update((s) => {
              const step = s.step;
              if (step === steps.WAITING_ROOM) {
                const json = JSON.parse(res);
                return { 
                  ...s, 
                  step: steps.WAITING_ROOM_READY,
                  readyEnd: json.ready_end 
                };
              }
              else {
                return { ...s };
              }
            });
        });
        socket.on("admin_term_study", (res) => {
          console.log("terminating...");
          const json = JSON.parse(res);
          update((s) => {
            return { 
              ...s, 
              step: steps.CANCEL,
              endRedirectURL: json.prolific_link
            };
          });
        });
        socket.on("admin_start_disc", (res) => {
          console.log("start");
          const json = JSON.parse(res);
          update((s) => {
            const step = s.step;
            if (step === steps.WAITING_ROOM_READY_SUBMITTED) {
              return { 
                ...s, 
                step: steps.DISCUSSION, 
                discussionURL: json.disc_link,
                discEnd: json.disc_end
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
