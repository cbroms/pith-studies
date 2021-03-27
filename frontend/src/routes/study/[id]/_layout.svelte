<script context="module">
  export async function preload(page, session) {
    const { id } = page.params;
    return { id };
  }
</script>

<script>
  export let id;

  import { goto, stores } from "@sapper/app";

  import { afterUpdate, onMount } from "svelte";
  import { studyStore } from "../../../stores/studyStore";
  import { steps } from "../../../steps/steps";

  import { studySocket as socket } from "../../../stores/socket.js";
  const { session } = stores();
  const { CONNECTION } = $session;

  // initialize study socket
  onMount(async () => {
    socket.initialize(CONNECTION, "Study");
  });

  afterUpdate(() => { 
    if ($studyStore.step === steps.CONSENT) {
      goto(`/study/${id}/consent`);
    } else if ($studyStore.step === steps.INSTRUCTIONS) {
      goto(`/study/${id}/instructions`);
    } else if ($studyStore.step === steps.TUTORIAL) {
      goto(`/study/${id}/tutorial`);
    } else if (
      $studyStore.step === steps.WAITING_ROOM ||
      $studyStore.step === steps.WAITING_ROOM_READY ||
      $studyStore.step === steps.WAITING_ROOM_READY_SUBMITTED
    ) {
      goto(`/study/${id}/waiting`);
    } else if ($studyStore.step === steps.DISCUSSION) {
      goto(`study/${id}/discussion`); // TODO
    } else if ($studyStore.step === steps.SURVEY_TASK) {
      goto(`/study/${id}/surveyTask`);
    } else if ($studyStore.step === steps.SURVEY_PITH) {
      goto(`/study/${id}/surveyPith`);
    } else if ($studyStore.step === steps.DONE) {
      goto($studyStore.endRedirectURL);
    } else if ($studyStore.step === steps.CANCEL) {
      goto(`/study/${id}/cancel`);
    }
  });
</script>

<main>
  <slot />
</main>
