import { createDerivedSocketStore } from "./createDerivedSocketStore";
import { adminSocket } from "./socket";

// import { steps } from "../steps/steps";

const defaultState = {
  sid: "",
  testType: 0,
  discLink: "",
  completionLink: "",
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
      }
    },
    setTestType: (testType, resolve, reject) => {
      console.log("setTestType");
      return (socket, update) => {
        socket.emit("admin_set_test_type", { test_type: testType }, 
          (res) => { 
            const json = JSON.parse(res);
            console.log("done", json.test_type);
            update((s) => {
              return { ...s, testType: json.test_type };
            });
            resolve(); 
          }
        );
      }
    },
    setDiscLink: (discLink, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_set_disc_link", { disc_link: discLink }, 
          (res) => {
            const json = JSON.parse(res);
            update((s) => {
              return { ...s, discLink: json.disc_link };
            });
            resolve();
          }
        );
      }
    },
    setProlificLink: (prolificLink, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_set_prolific_link", { prolific_link: prolificLink }, 
          (res) => { 
            const json = JSON.parse(res);
            update((s) => {
              return { ...s, prolificLink: json.prolific_link };
            });
            resolve(); 
          }
        );
      }
    },
    readyDisc: (resolve, reject) => {
      console.log("admin_initiate_ready");
      return (socket, update) => {
        socket.emit("admin_initiate_ready", {}, (res) => { 
          update((s) => {
            return { 
              ...s,  
              waitingList: [],
              readyList: [...s.waitingList],
            }
          });
          resolve(); 
        });
      }
    },
    startDisc: (resolve, reject) => { // consider adding a handshake
      console.log("admin_start_disc");
      return (socket, update) => {
        socket.emit("admin_start_disc", {}, (res) => { 
          const json = JSON.parse(res);
          update((s) => {
            return { 
              ...s,  
              startDisc: json.start_disc,
              readySubList: [],
              discussionList: [...s.readySubList],
            };
          });
          resolve(); 
        });
      }
    },
    endDisc: (resolve, reject) => { // consider adding a handshake
      console.log("admin_end_disc");
      return (socket, update) => {
        socket.emit("admin_end_disc", {}, (res) => { 
          const json = JSON.parse(res);
          update((s) => {
            return { 
              ...s,  
              endDisc: json.end_disc,
              discussionList: [],
              surveyTaskList: [...s.discussionList],
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
        /*
        socket.on("ready_disc", (res) => {
          const json = JSON.parse(res);
          const waitingList = [...s.waitingList].filter(
            (e) => !json.participant_id
          );
          update((s) => {
            return { 
              ...s, 
              waitingList: waitingList,
              readyList: [...s.readyList, json.participant_id] // transfer 
            };
          });
          resolve(); 
        }); 
        */
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
        /*
        socket.on("start_disc", (res) => {
          update((s) => {
            const json = JSON.parse(res);
            console.log("start_disc");
            const readySubList = [...s.readySubList].filter(
              (e) => !json.participant_id
            );
            return { 
              ...s, 
              readySubList: readySubList,
              discussionList: [...s.discussionList, json.participant_id] // transfer 
            };
          });
        });
        socket.on("end_disc", (res) => {
          update((s) => {
            const json = JSON.parse(res);
            const discussionList = [...s.discussionList].filter(
              (e) => !json.participant_id
            );
            return { 
              ...s, 
              discussionList: discussionList,
              surveyTaskList: [...s.surveyTaskList, json.participant_id] // transfer 
            };
          });
        });
        */
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
