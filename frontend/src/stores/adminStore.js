import { createDerivedSocketStore } from "./createDerivedSocketStore";
import { adminSocket } from "./socket";

// import { steps } from "../steps/steps";

const defaultState = {
  session: "",
  valid: null,
  testType: 0,
  discLink: "",
  completionLink: "",
  startDisc: null,
  endDisc: null,
  startList: [],
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
  finish: false,
};

export const adminStore = createDerivedSocketStore(
  adminSocket,
  {
    createStudy: (session, resolve, reject) => {
      session = session.trim();
      return (socket, update) => {
        console.log("create_study", socket);
        socket.emit("admin_study_setup", { session}, (res) => {
          // this should always work
          update((s) => {
            return { ...s, session: session };
          });
          resolve();
        });
      }
    },
    checkSession: (session, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_test_connect", {session}, (res) => {
          const json = JSON.parse(res);
          console.log("valid", json.valid);
          update((s) => {
            return { ...s, valid: json.valid };
          });
          resolve();
        });
      }
    },
    setTestType: (session, testType, resolve, reject) => {
      console.log("setTestType");
      return (socket, update) => {
        socket.emit("admin_set_test_type", { session, test_type: testType }, 
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
    setDiscLink: (session, discLink, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_set_disc_link", { session, disc_link: discLink }, 
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
    setProlificLink: (session, prolificLink, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_set_prolific_link", { session, prolific_link: prolificLink }, 
          (res) => { 
            const json = JSON.parse(res);
            update((s) => {
              return { ...s, completionLink: json.prolific_link };
            });
            resolve(); 
          }
        );
      }
    },
    readyDisc: (session, resolve, reject) => {
      console.log("admin_initiate_ready");
      return (socket, update) => {
        socket.emit("admin_initiate_ready", {session}, (res) => { 
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
    startDisc: (session, resolve, reject) => { // consider adding a handshake
      console.log("admin_start_disc");
      return (socket, update) => {
        socket.emit("admin_start_disc", {session}, (res) => { 
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
    endDisc: (session, resolve, reject) => { // consider adding a handshake
      console.log("admin_end_disc");
      return (socket, update) => {
        socket.emit("admin_end_disc", {session}, (res) => { 
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
    teardownStudy: (session, resolve, reject) => {
      return (socket, update) => {
        socket.emit("admin_study_teardown", {session}, (res) => { 
          update((s) => {
            return { 
              ...s,  
              finish: true,
            };
          });
          resolve(); 
        });
      }
    },
    subscribeProgress: (session) => {
      console.log("subscribe");
      return (socket, update) => {
        socket.on("test_connect", (res) => {
          console.log("test_connect");
          const json = JSON.parse(res);
          update((s) => {
            return { 
              ...s, 
              startList: [...s.startList, json.participant_id]
            };
          });
        });
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
