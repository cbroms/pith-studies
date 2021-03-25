<script>
  import { studyStore } from "../../../stores/studyStore";

  const onContinue = async () => {
    await studyStore.tutorialComplete($studyStore.pid);
  };
</script>

<div class="container-outer">
  <h1>Tutorial</h1>

  <button on:click={onContinue}>Continue</button>
</div>

<style>
  .container-outer {
    padding: 40px;
  }
</style>

