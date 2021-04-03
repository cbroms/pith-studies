<script>
  import { goto } from "@sapper/app";

  import { studyStore } from "../../../stores/studyStore";

  const onRedirect = async () => {
    console.log($studyStore.endRedirectURL);
    goto($studyStore.endRedirectURL);
  };
</script>

<div class="container-outer">
  <h1>Your session is complete.</h1>
  <h2>Thank you for participating in this study! Please click on the button below to record your completion on Prolific.</h2>

  <div class="container-outer">
      <button on:click={onRedirect}>Complete Study</button>
  </div>
</div>

<style>
  button {
    height: 300px;
    width: 400px;
    font-size: 75px;
  }
</style>

