import { createDerivedSocketStore } from "./createDerivedSocketStore";
import { adminSocket } from "./socket";

// import { steps } from "../steps/steps";

const defaultState = {
  sid: "",
  startDisc: null,
  endDisc: null,
  consentList: [],
  instrList: [],
  tutorialList: [],
  waitingList: [],
  readyList: [],
  readySubList: [],
  discussionList: [],
  surveyTaskList: [],
  surveyPithList: [],
  doneList: [], 
  cancelList: [],
};

export const adminStore = createDerivedSocketStore(
  adminSocket,
  {
    createStudy: (id, resolve, reject) => {
      id = id.trim();
      return (socket, update) => {
        console.log("create_study", socket);
        socket.emit("admin_study_setup", { session: id }, (res) => {
          // this should always work
          update((s) => {
            return { ...s, sid: id };
          });
          resolve();
        });
      };
    },
    setTestType: (testType, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_set_test_type", { test_type: testType }, 
          (res) => { resolve(); }
        );
      }
    },
    setDiscLink: (discLink, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_set_disc_link", { disc_link: discLink }, (res) => {
          resolve();
        });
      }
    },
    setProlificLink: (prolificLink, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_set_prolific_link", { prolific_link: prolificLink }, 
          (res) => { resolve(); }
        );
      }
    },
    readyDisc: (resolve, reject) => {
      console.log("ready_disc");
      return (socket, update) => {
        socket.emit("admin_initiate_ready", {}, (res) => { 
          update((s) => {
            return { 
              ...s, 
              waitingList: [],
              readyList: [...s.waitingList] // transfer 
            };
          });
          resolve(); 
        });
      }
    },
    startDisc: (resolve, reject) => { // consider adding a handshake
      return (socket, update) => {
        socket.emit("admin_start_disc", {}, (res) => {
          console.log("start_disc", res);
          update((s) => {
            const json = JSON.parse(res);
            return { 
              ...s, 
              startDisc: json.start_disc,
              readySubList: [],
              discussionList: [...s.readySubList] // transfer 
            };
          });
          resolve();
        });
      }
    },
    endDisc: (resolve, reject) => { // consider adding a handshake
      return (socket, update) => {
        socket.emit("admin_end_disc", {}, (res) => {
          update((s) => {
            const json = JSON.parse(res);
            return { 
              ...s, 
              endDisc: json.end_disc, 
              discussionList: [],
              surveyTaskList: [...s.discussionList] // transfer 
            };
          });
          resolve();
        });
      }
    },
    teardownStudy: (resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_study_teardown", {}, (res) => { resolve(); });
      }
    },
    subscribeProgress: () => {
      console.log("subscribe");
      return (socket, update) => {
        socket.on("join_study", (res) => {
          console.log("join_study");
          const json = JSON.parse(res);
          update((s) => {
            return { 
              ...s, 
              consentList: [...s.consentList, json.participant_id]
            };
          });
        });
        socket.on("end_consent", (res) => {
          console.log("end_consent");
          const json = JSON.parse(res);
            update((s) => {
              const consentList = [...s.consentList].filter(
                (e) => !json.participant_id
              );
              if (json.accepted) {
                return { 
                  ...s, 
                  consentList: consentList,
                  instrList: [...s.instrList, json.participant_id]
                };
              }
              else {
                return { 
                  ...s, 
                  consentList: consentList,
                  cancelList: [...s.cancelList, json.participant_id]
                };
              }
            }
          );
        });
        socket.on("end_instr", (res) => {
          const json = JSON.parse(res);
          update((s) => {
            const instrList = [...s.instrList].filter(
              (e) => !json.participant_id
            );
            return { 
              ...s, 
              instrList: instrList,
              tutorialList: [...s.tutorialList, json.participant_id]
            };
          });
        });
        socket.on("end_tutorial", (res) => {
          const json = JSON.parse(res);
          update((s) => {
            const tutorialList = [...s.tutorialList].filter(
              (e) => !json.participant_id
            );
            return { 
              ...s, 
              tutorialList: tutorialList,
              waitingList: [...s.waitingList, json.participant_id]
            };
          });
        });
        socket.on("end_waiting", (res) => {
          const json = JSON.parse(res);
          update((s) => {
            const readyList = [...s.readyList].filter(
              (e) => !json.participant_id
            );
            return { 
              ...s, 
              readyList: readyList,
              readySubList: [...s.readySubList, json.participant_id]
            };
          });
        });
        socket.on("end_survey_task", (res) => {
          const json = JSON.parse(res);
          update((s) => {
            const surveyTaskList = [...s.surveyTaskList].filter(
              (e) => !json.participant_id
            );
            return { 
              ...s, 
              surveyTaskList: surveyTaskList,
              surveyPithList: [...s.surveyPithList, json.participant_id]
            };
          });
        });
        socket.on("end_survey_pith", (res) => {
          const json = JSON.parse(res);
          update((s) => {
            const surveyPithList = [...s.surveyPithList].filter(
              (e) => !json.participant_id
            );
            return { 
              ...s, 
              surveyPithList: surveyPithList,
              doneList: [...s.doneList, json.participant_id]
            };
          });
        });

      };
    },
  },
  defaultState
);
