<script context="module">
  export async function preload(page, session) {
    const { id } = page.params;
    return { id };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";

  import { setValue } from "../../../utils/localStorage";
  import { studyStore } from "../../../stores/studyStore";

  export let id;

  let pid;
  let pressed = false;

  onMount(async () => {
    await studyStore.checkSession(id);
    console.log($studyStore.valid);
    if ($studyStore.valid) {
      const url = new URL(window.location.href);
      pid = url.searchParams.get("PROLIFIC_PID");
      studyStore.subscribeStudy(id, pid);
    } else {
      goto("/404");
    }
  });

  const onContinue = async () => {
    pressed = true;
    await studyStore.joinStudy(id, pid);

    // local storage params
    setValue(`pid-${id}`, pid);
  };
</script>

<div class="container-outer">
  <h1>Welcome!</h1>

  <h3>
    Please enter your Prolific ID. Make sure it is entered correctly before
    pressing continue.
  </h3>
  <input bind:value={pid} />

  <button on:click={onContinue}>Continue</button>
</div>
