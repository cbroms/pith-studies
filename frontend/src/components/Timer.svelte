<script>
  import { timerStore } from "../stores/timerStore";
  import { adminStore } from "../stores/adminStore";
  import { studyStore } from "../stores/studyStore";
  import { steps } from "../steps/steps";
  import Modal from "svelte-simple-modal";
  import ModalContent from "./ModalContent.svelte";
</script>

{#if $adminStore.isAdmin && $timerStore 
  && $adminStore.trueEndDisc === null && $adminStore.term === false}
  <div class="timer" class:flash={$timerStore.warning}>
    {#if $adminStore.discEnd !== null}
      {#if $timerStore.remaining === "00:00"}
        Discussion ending soon...
      {:else}
        Discussion ends in <strong>{$timerStore.remaining}</strong>
      {/if}
    {:else if $adminStore.readyEnd !== null}
      {#if $timerStore.remaining === "00:00"}
        Discussion starting soon...
      {:else}
        Discussion starts in <strong>{$timerStore.remaining}</strong>
      {/if}
    {:else if $adminStore.timerEnd !== null}
      {#if $timerStore.remaining === "00:00"}
        Main study starting soon...
      {:else}
        Main study starts in <strong>{$timerStore.remaining}</strong>
      {/if}
    {/if}
  </div>
{/if}

{#if $studyStore.isParticipant && $timerStore 
  && $studyStore.trueEndDisc === null && $studyStore.step !== steps.CANCEL} 
  <div class="timer" class:flash={$timerStore.warning}>
    <div>
      {#if $studyStore.discEnd !== null}
        {#if $timerStore.remaining === "00:00"}
          Discussion ending soon...
        {:else}
          Discussion ends in <strong>{$timerStore.remaining}</strong>
        {/if}
      {:else if $studyStore.readyEnd !== null}
        {#if $timerStore.remaining === "00:00"}
          Discussion starting soon...
        {:else}
          Discussion starts in <strong>{$timerStore.remaining}</strong>
        {/if}
      {:else if $studyStore.timerEnd !== null}
        {#if $timerStore.remaining === "00:00"}
          Main study starting soon...
        {:else}
          Main study starts in <strong>{$timerStore.remaining}</strong>
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
