<script>
  import { timerStore } from "../stores/timerStore";
  import { studyStore } from "../stores/studyStore";
  import { steps } from "../steps/steps";
</script>

{#if $timerStore && $studyStore.step <= steps.DISCUSSION}
  <div class="timer">
  {#if $studyStore.step <= steps.WAITING_ROOM}
    {#if $timerStore === "00:00"}
      Main study starting soon...
    {:else}
        Main study starts in <strong>{$timerStore}</strong>
    {/if}
  {:else if $studyStore.step <= steps.WAITING_ROOM_READY_SUBMITTED}
    {#if $timerStore === "00:00"}
      Discussion starting soon...
    {:else}
        Discussion starts in <strong>{$timerStore}</strong>
    {/if}
  {:else if $studyStore.step <= steps.DISCUSSION}
    {#if $timerStore === "00:00"}
      Discussion ending soon...
    {:else}
        Discussion ends in <strong>{$timerStore}</strong>
    {/if}
  {/if}
  </div>
{/if}

<style>
.timer {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-bottom: 2px black solid;
  position: sticky;
  top: 0;
  background-color: white;
}
</style>
