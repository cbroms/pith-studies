import { createDerivedSocketStore } from "./createDerivedSocketStore";
import { adminSocket } from "./socket";
import { steps } from "../steps/steps";

// import { steps } from "../steps/steps";

const defaultState = {
  isAdmin: false,
  session: "",
  valid: null,
  testType: 0,
  discLink: null,
  completionLink: null,
  cancelLink: null,
  timerStart: null,
  timerEnd: null, // timer
  readyStart: null,
  readyEnd: null, // timer
  discStart: null,
  discEnd: null, // timer
  trueEndDisc: null,
  participants: {},
  participantList: [],
  finish: false,
  term: false,
};

export const adminStore = createDerivedSocketStore(
  adminSocket,
  {
    createStudy: (session, resolve, reject) => {
      session = session.trim();
      return (socket, update) => {
        console.log("create_study", socket);
        socket.emit("admin_study_setup", { session }, (res) => {
          // this should always work
          update((s) => {
            return { ...s, session: session };
          });
          resolve();
        });
      };
    },
    checkSession: (session, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_test_connect", { session }, (res) => {
          const json = JSON.parse(res);
          console.log("valid", json.valid);
          update((s) => {
            return { ...s, valid: json.valid, isAdmin: true };
          });
          resolve();
        });
      };
    },
    setTestType: (session, testType, resolve, reject) => {
      console.log("setTestType");
      return (socket, update) => {
        socket.emit(
          "admin_set_test_type",
          { session, test_type: testType },
          (res) => {
            const json = JSON.parse(res);
            update((s) => {
              return { ...s, testType: json.test_type };
            });
            resolve();
          }
        );
      };
    },
    setDiscLink: (session, discLink, resolve, reject) => {
      return (socket, update) => {
        socket.emit(
          "admin_set_disc_link",
          { session, disc_link: discLink },
          (res) => {
            const json = JSON.parse(res);
            update((s) => {
              return { ...s, discLink: json.disc_link };
            });
            resolve();
          }
        );
      };
    },
    setProlificLink: (session, prolificLink, resolve, reject) => {
      return (socket, update) => {
        socket.emit(
          "admin_set_prolific_link",
          { session, prolific_link: prolificLink },
          (res) => {
            const json = JSON.parse(res);
            update((s) => {
              return { ...s, completionLink: json.prolific_link };
            });
            resolve();
          }
        );
      };
    },
    setCancelLink: (session, cancelLink, resolve, reject) => {
      return (socket, update) => {
        socket.emit(
          "admin_set_cancel_link",
          { session, cancel_link: cancelLink },
          (res) => {
            const json = JSON.parse(res);
            update((s) => {
              return { ...s, cancelLink: json.cancel_link };
            });
            resolve();
          }
        );
      };
    },
    readyDisc: (session, resolve, reject) => {
      console.log("admin_initiate_ready");
      return (socket, update) => {
        socket.emit("admin_initiate_ready", { session }, (res) => {
          const json = JSON.parse(res);
          update((s) => {
            let participants = { ...s.participants };
            for (const pid in participants) {
              if (participants[pid] === steps.WAITING_ROOM) {
                participants[pid] = steps.WAITING_ROOM_READY;
              }
            }
            return {
              ...s,
              readyStart: json.ready_start,
              readyEnd: json.ready_end,
              participants: participants,
            };
          });
          resolve();
        });
      };
    },
    termStudy: (session, resolve, reject) => {
      console.log("admin_term_study");
      return (socket, update) => {
        socket.emit("admin_term_study", { session }, (res) => {
          update((s) => {
            return {
              ...s,
              term: true,
            };
          });
          resolve();
        });
      };
    },
    startDisc: (session, resolve, reject) => {
      // consider adding a handshake
      console.log("admin_start_disc");
      return (socket, update) => {
        socket.emit("admin_start_disc", { session }, (res) => {
          const json = JSON.parse(res);
          update((s) => {
            let participants = { ...s.participants };
            for (const pid in participants) {
              if (participants[pid] === steps.WAITING_ROOM_READY_SUBMITTED) {
                participants[pid] = steps.DISCUSSION;
              }
            }
            return {
              ...s,
              discStart: json.disc_start,
              discEnd: json.disc_end,
              participants: participants,
            };
          });
          resolve();
        });
      };
    },
    endDisc: (session, resolve, reject) => {
      // consider adding a handshake
      console.log("admin_end_disc");
      return (socket, update) => {
        socket.emit("admin_end_disc", { session }, (res) => {
          const json = JSON.parse(res);
          update((s) => {
            let participants = { ...s.participants };
            for (const pid in participants) {
              if (participants[pid] === steps.DISCUSSION) {
                participants[pid] = steps.SURVEY_TASK;
              }
            }
            return {
              ...s,
              trueDiscEnd: json.true_disc_end,
              participants: participants,
            };
          });
          resolve();
        });
      };
    },
    teardownStudy: (session, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_study_teardown", { session }, (res) => {
          update((s) => {
            return {
              ...s,
              finish: true,
            };
          });
          resolve();
        });
      };
    },
    subscribeProgress: (session) => {
      console.log("subscribe");
      return (socket, update) => {
        socket.on("test_connect", (res) => {
          const json = JSON.parse(res);
          console.log("test_connect", json);
          update((s) => {
            return {
              ...s,
            };
          });
        });
        socket.on("join_study", (res) => {
          const json = JSON.parse(res);
          console.log("join_study", json);
          update((s) => {
            const participantList = [...s.participantList, json.participant_id];
            const participants = {
              ...s.participants,
              [json.participant_id]: steps.CONSENT,
            };
            console.log("participants", participantList, participants);
            if ("timer_start" in json) {
              return {
                ...s,
                timerStart: json.timer_start,
                timerEnd: json.timer_end,
                participantList: participantList,
                participants: participants,
              };
            } else {
              return {
                ...s,
                participantList: participantList,
                participants: participants,
              };
            }
          });
        });
        socket.on("end_consent", (res) => {
          const json = JSON.parse(res);
          console.log("end_consent", json);
          update((s) => {
            if (json.accepted) {
              return {
                ...s,
                participants: {
                  ...s.participants,
                  [json.participant_id]: steps.INSTRUCTIONS,
                },
              };
            } else {
              return {
                ...s,
              };
            }
          });
        });
        socket.on("end_instr", (res) => {
          const json = JSON.parse(res);
          console.log("end_instr", json);
          update((s) => {
            return {
              ...s,
              participants: {
                ...s.participants,
                [json.participant_id]: steps.TUTORIAL,
              },
            };
          });
        });
        socket.on("end_tutorial", (res) => {
          const json = JSON.parse(res);
          console.log("end_tutorial", json);
          update((s) => {
            return {
              ...s,
              participants: {
                ...s.participants,
                [json.participant_id]: steps.WAITING_ROOM,
              },
            };
          });
        });
        socket.on("end_waiting", (res) => {
          const json = JSON.parse(res);
          console.log("end_waiting", json);
          update((s) => {
            return {
              ...s,
              participants: {
                ...s.participants,
                [json.participant_id]: steps.WAITING_ROOM_READY_SUBMITTED,
              },
            };
          });
        });
        socket.on("end_survey_task", (res) => {
          const json = JSON.parse(res);
          console.log("end_survey_task", json);
          update((s) => {
            return {
              ...s,
              participants: {
                ...s.participants,
                [json.participant_id]: steps.SURVEY_PITH,
              },
            };
          });
        });
        socket.on("end_survey_pith", (res) => {
          const json = JSON.parse(res);
          console.log("end_survey_pith", json);
          update((s) => {
            return {
              ...s,
              participants: {
                ...s.participants,
                [json.participant_id]: steps.DONE,
              },
            };
          });
        });
      };
    },
  },
  defaultState
);
