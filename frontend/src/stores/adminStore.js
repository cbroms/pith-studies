import { createDerivedSocketStore } from "./createDerivedSocketStore";
import { adminSocket } from "./socket";

// import { steps } from "../steps/steps";

const defaultState = {
  studyId: "",
};

export const adminStore = createDerivedSocketStore(
  adminSocket,
  {
    createStudy: (id, resolve, reject) => {
      return (socket, update) => {
        console.log("create_study", socket);
        socket.emit("admin_create_study", { session: id }, (res) => {
          // this should always work
          update((s) => {
            return { ...s, studyId: id };
          });
          resolve();
        });
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

console.log(adminStore);
