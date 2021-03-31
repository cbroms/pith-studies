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
  import { timerStore } from "../../../stores/timerStore";
  import Timer from "../../../components/Timer.svelte";

  import { studySocket as socket } from "../../../stores/socket.js";
  const { session } = stores();
  const { CONNECTION } = $session;

  let stage = 0;

  // initialize study socket
  onMount(async () => {
    socket.initialize(CONNECTION, "Study");
  });

  afterUpdate(() => { 

    if ($studyStore.step == steps.CONSENT && stage === 0) {
      timerStore.initialize($studyStore.timerEnd);
      stage += 1;
    } 
    else if ($studyStore.step === steps.WAITING_ROOM_READY && stage === 1) {
      timerStore.initialize($studyStore.readyEnd);
      stage += 1;
    }
    else if ($studyStore.step == steps.DISCUSSION && stage === 2) {
      timerStore.initialize($studyStore.discEnd);
      stage += 1;
    }

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
  <Timer />
  <slot />
</main>
