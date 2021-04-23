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
  <h3>
    Please return to Prolific and return your submission with "stop without
    completing".
  </h3>
  <p>
    Either you were not able to join the discussion in time or not enough people
    were available to start the discussion. We will still compensate you $2.50
    if you reached the waiting room. Please send us a message through Prolific
    if you have any issues or questions.
  </p>
</div>
