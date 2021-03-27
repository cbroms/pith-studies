<script>
  import { goto } from "@sapper/app";

  import { studyStore } from "../../../stores/studyStore";

  const onRedirect = async () => {
    goto($studyStore.endRedirectURL);
  };
</script>

<div class="container-outer">
  <h1>The study has been terminated.</h1>
  <h2>Not enough people were available to start the discussion. 
      Please click on the button to complete your session.</h2>

  <div class="container-outer">
      <button on:click={onRedirect}>Go to Prolific</button>
  </div>
</div>

<style>
  button {
    height: 300px;
    width: 400px;
    font-size: 75px;
  }
</style>
