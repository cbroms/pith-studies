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
  import { getValue, setValue } from "../../../utils/localStorage";
  const { session } = stores();
  const { CONNECTION } = $session;

  // initialize study socket
  onMount(async () => {
    socket.initialize(CONNECTION, "Study");

    const prevPid = getValue(`pid-${id}`);
    console.log("prevPid", prevPid);
    if (prevPid !== null) {
      await studyStore.reload(id, prevPid);
      studyStore.subscribeStudy(id, prevPid);
    }
  });

  afterUpdate(() => {
    if (
      $studyStore.timerEnd &&
      !$studyStore.readyEnd &&
      !$studyStore.initTimer
    ) {
      timerStore.initialize($studyStore.timerEnd);
      studyStore.initTimer();
    } else if (
      $studyStore.readyEnd &&
      !$studyStore.discEnd &&
      !$studyStore.initTimer
    ) {
      timerStore.initialize($studyStore.readyEnd);
      studyStore.initTimer();
    } else if (
      $studyStore.discEnd &&
      !$studyStore.trueEndDisc &&
      !$studyStore.initTimer
    ) {
      timerStore.initialize($studyStore.discEnd);
      studyStore.initTimer();
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
      goto(`/study/${id}/complete`);
    } else if ($studyStore.step === steps.CANCEL) {
      goto(`/study/${id}/cancel`);
    }
  });
</script>

<main>
  <Timer />
  <slot />
</main>
