<script>
  import { getContext } from "svelte";
  import Tutorial from "./Tutorial.svelte";
  import Instructions from "./Instructions.svelte";

  const { open } = getContext("simple-modal");

  const showTutorial = () => {
    open(Tutorial);
  };

  const showInstructions = () => {
    open(Instructions);
  };
</script>

<div>
  <button on:click={showTutorial}>Tutorial</button>
  <button on:click={showInstructions}>Instructions</button>
</div>

<style>
  button {
    margin-left: 20px;
  }
</style>
