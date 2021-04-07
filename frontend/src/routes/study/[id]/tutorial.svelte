<script>
  import { studyStore } from "../../../stores/studyStore";
  import Tutorial from "../../../components/Tutorial.svelte";

  const onContinue = async () => {
    await studyStore.tutorialComplete($studyStore.session, $studyStore.pid);
  };
</script>

<div class="container-outer">
  <Tutorial />
  <button on:click={onContinue}>Continue</button>
</div>
