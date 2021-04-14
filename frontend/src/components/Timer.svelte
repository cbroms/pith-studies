<script>
  import { timerStore } from "../stores/timerStore";
  import { adminStore } from "../stores/adminStore";
  import { studyStore } from "../stores/studyStore";
  import { steps } from "../steps/steps";
  import Modal from "svelte-simple-modal";
  import ModalContent from "./ModalContent.svelte";
</script>

{#if $adminStore.isAdmin && $timerStore && $adminStore.trueEndDisc === null}
  <p>{$timerStore.warning}</p>
  <div class="timer" class:flash={$timerStore.warning}>
    {#if $adminStore.readyStart === null}
      {#if $timerStore.remaining === "00:00"}
        Main study starting soon...
      {:else}
        Main study starts in <strong>{$timerStore.remaining}</strong>
      {/if}
    {:else if $adminStore.discStart === null}
      {#if $timerStore.remaining === "00:00"}
        Discussion starting soon...
      {:else}
        Discussion starts in <strong>{$timerStore.remaining}</strong>
      {/if}
    {:else if $adminStore.trueEndDisc === null}
      {#if $timerStore.remaining === "00:00"}
        Discussion ending soon...
      {:else}
        Discussion ends in <strong>{$timerStore.remaining}</strong>
      {/if}
    {/if}
  </div>
{/if}

{#if $studyStore.isParticipant && $timerStore 
  && $studyStore.step <= steps.DISCUSSION}
  <div class="timer" class:flash={$timerStore.warning}>
    <div>
      {#if $studyStore.step <= steps.WAITING_ROOM}
        {#if $timerStore.remaining === "00:00"}
          Main study starting soon...
        {:else}
          Main study starts in <strong>{$timerStore.remaining}</strong>
        {/if}
      {:else if $studyStore.step <= steps.WAITING_ROOM_READY_SUBMITTED}
        {#if $timerStore.remaining === "00:00"}
          Discussion starting soon...
        {:else}
          Discussion starts in <strong>{$timerStore.remaining}</strong>
        {/if}
      {:else if $studyStore.step <= steps.DISCUSSION}
        {#if $timerStore.remaining === "00:00"}
          Discussion ending soon...
        {:else}
          Discussion ends in <strong>{$timerStore.remaining}</strong>
        {/if}
      {/if}
    </div>

    <div>
      {#if $studyStore.step >= steps.TUTORIAL}
        <Modal><ModalContent /></Modal>
      {/if}
    </div>
  </div>
{/if}

<style>
  .flash {
    background-color: indianred !important;
  }

  .timer {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    border-bottom: 2px black solid;
    position: sticky;
    top: 0;
    background-color: white;
    display: flex;
    justify-content: space-between;
  }
</style>
