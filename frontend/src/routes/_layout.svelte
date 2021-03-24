<script>
  import { goto, stores } from "@sapper/app";

  import { afterUpdate, onMount } from "svelte";
  import { studyStore } from "../stores/studyStore";
  import { steps } from "../steps/steps";

  import { studySocket as socket } from "../stores/socket.js";
  const { session } = stores();
  const { CONNECTION } = $session;

  // initialize study socket
  onMount(async () => {
    socket.initialize(CONNECTION, "Studies");
  });

  afterUpdate(() => {
    if ($studyStore.step === steps.INSTRUCTIONS) {
      goto("/instructions");
    } else if ($studyStore.step === steps.CONSENT) {
      goto("/consent");
    } else if (
      $studyStore.step === steps.WAITING_ROOM ||
      $studyStore.step === steps.WAITING_ROOM_READY ||
      $studyStore.step === steps.WAITING_ROOM_READY_SUBMITTED
    ) {
      goto("/waiting");
    }
  });
</script>

<main>
  <slot />
</main>
