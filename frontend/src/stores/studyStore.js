import dayjs from "dayjs";

import { createDerivedSocketStore } from "./createDerivedSocketStore";
import { studySocket } from "./socket";

import { steps } from "../steps/steps";

const defaultState = {
  isParticipant: false,
  valid: null,
  session: "",
  pid: "",
  step: steps.WELCOME,
  cancelRedirectURL: "",
  endRedirectURL: "",
  discussionURL: "",
  testType: null, // gives tutorial
  timerEnd: null, // timer
  readyEnd: null, // timer
  discEnd: null, // timer
  trueEndDisc: null,
  initTimer: false,
};

export const studyStore = createDerivedSocketStore(
  studySocket,
  {
    checkSession: (session, resolve, reject) => {
      return (socket, update) => {
        socket.emit("test_connect", { session }, (res) => {
          const json = JSON.parse(res);
          console.log("valid", json.valid);
          update((s) => {
            const newS = { ...s, valid: json.valid, isParticipant: true };
            console.log("checkSession", newS);
            return newS;
          });
          resolve();
        });
      };
    },
    joinStudy: (session, pid, resolve, reject) => {
      return (socket, update) => {
        console.log("join_study");
        socket.emit("join_study", { session, participant_id: pid }, (res) => {
          const json = JSON.parse(res);
          update((s) => {
            const newS = {
              ...s,
              session: session,
              pid: pid,
              step: steps.CONSENT,
              timerEnd: json.timer_end,
              initTimer: false,
            };
            console.log("joinStudy", newS);
            return newS;
          });
          resolve();
        });
      };
    },
    reload: (session, pid, resolve, reject) => {
      // assume already joined study
      return (socket, update) => {
        console.log("reload", socket);
        socket.emit("reload_study", { session, participant_id: pid }, (res) => {
          console.log("reload", res);
          const json = JSON.parse(res);
          update((s) => {
            const newS = {
              ...s,
              isParticipant: true,
              valid: true,
              session: session,
              pid: pid,
              step: json.stage,
              cancelRedirectURL: json.cancel_link,
              endRedirectURL: json.prolific_link,
              discussionURL: json.disc_link,
              testType: json.test_type, // gives tutorial
              timerEnd: json.timer_end, // timer
              readyEnd: json.ready_end, // timer
              discEnd: json.disc_end, // timer
              trueEndDisc: json.end_disc,
              initTimer: false,
            };
            return newS;
          });
          resolve();
        });
      };
    },
    initTimer: (resolve, reject) => {
      return (socket, update) => {
        update((s) => {
          return {
            ...s,
            initTimer: true,
          };
        });
        resolve();
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
                const newS = { ...s, step: steps.INSTRUCTIONS };
                console.log("consentComplete", newS);
                return newS;
              });
            } else {
              update((s) => {
                const newS = { ...s }; // stay on same page
                console.log("consentComplete", newS);
                return newS;
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
        socket.emit("end_instr", { session, participant_id: pid }, (res) => {
          const json = JSON.parse(res);
          update((s) => {
            const newS = {
              ...s,
              step: steps.TUTORIAL,
              testType: json.test_type,
            };
            console.log("instructionsComplete", newS);
            return newS;
          });
          resolve();
        });
      };
    },
    tutorialComplete: (session, pid, resolve, reject) => {
      return (socket, update) => {
        console.log("tutorial_complete", pid);
        socket.emit("end_tutorial", { session, participant_id: pid }, (res) => {
          update((s) => {
            const newS = { ...s, step: steps.WAITING_ROOM };
            console.log("tutorialComplete", newS);
            return newS;
          });
          resolve();
        });
      };
    },
    readyComplete: (session, pid, resolve, reject) => {
      return (socket, update) => {
        console.log("ready_complete", pid);
        socket.emit("end_waiting", { session, participant_id: pid }, (res) => {
          update((s) => {
            const newS = { ...s, step: steps.WAITING_ROOM_READY_SUBMITTED };
            console.log("readyComplete", newS);
            return newS;
          });
          resolve();
        });
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
              const newS = { ...s, step: steps.SURVEY_PITH };
              console.log("surveyTaskComplete", newS);
              return newS;
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
              const newS = {
                ...s,
                step: steps.DONE,
                endRedirectURL: json.prolific_link,
              };
              console.log("surveyPithComplete", newS);
              return newS;
            });
            resolve();
          }
        );
      };
    },
    subscribeStudy: (session, pid) => {
      console.log("subscribeStudy", pid);
      return (socket, update) => {
        socket.on("admin_initiate_ready", (res) => {
          console.log("readying...");
          // if they're in the waiting room, give them the ready step
          update((s) => {
            console.log("pre-ready", s);
            const step = s.step;
            if (step === steps.WAITING_ROOM) {
              const json = JSON.parse(res);
              const newS = {
                ...s,
                step: steps.WAITING_ROOM_READY,
                readyEnd: json.ready_end,
                initTimer: false,
              };
              console.log("readying", newS);
              return newS;
            } else {
              // if they're not in the waiting room, terminate them
              const newS = {
                ...s,
                step: steps.CANCEL,
              };
              console.log("terminating", newS);
              return newS;
            }
          });
        });
        socket.on("admin_term_study", (res) => {
          console.log("terminating...");
          const json = JSON.parse(res);
          update((s) => {
            const newS = {
              ...s,
              step: steps.CANCEL,
            };
            console.log("terminating", newS);
            return newS;
          });
        });
        socket.on("admin_start_disc", (res) => {
          console.log("starting...");
          const json = JSON.parse(res);
          update((s) => {
            const step = s.step;
            if (step === steps.WAITING_ROOM_READY_SUBMITTED) {
              const newS = {
                ...s,
                step: steps.DISCUSSION,
                discussionURL: json.disc_link,
                discEnd: json.disc_end,
                initTimer: false,
              };
              console.log("starting", newS);
              return newS;
            } else {
              // not able to start in time
              const newS = {
                ...s,
                step: steps.CANCEL,
              };
              console.log("starting", newS);
              return newS;
            }
          });
        });
        socket.on("admin_end_disc", (res) => {
          console.log("ending...");
          const json = JSON.parse(res);
          update((s) => {
            const step = s.step;
            if (step === steps.DISCUSSION) {
              const newS = {
                ...s,
                step: steps.SURVEY_TASK,
                trueEndDisc: json.true_disc_end,
              };
              console.log("ending", newS);
              return newS;
            } else {
              // no change
              const newS = { ...s };
              console.log("ending", newS);
              return newS;
            }
          });
        });
      };
    },
  },
  defaultState
);
