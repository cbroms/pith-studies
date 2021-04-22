<script>
  import { goto } from "@sapper/app";

  import { studyStore } from "../../../stores/studyStore";

  const onRedirect = async () => {
    console.log($studyStore.cancelRedirectURL);
    goto($studyStore.cancelRedirectURL);
  };
</script>

<div class="container-outer">
  <h1>Your session has been terminated.</h1>
  <h2>
    Either you were not able to join the discussion in time or not enough people
    were available to start the discussion. Please return your session on
    Prolific.
  </h2>

  <!--
  <div class="container-outer">
      <button on:click={onRedirect}>Go to Prolific Home</button>
  </div>
  -->
</div>

<style>
  button {
    height: 300px;
    width: 400px;
    font-size: 75px;
  }
</style>
