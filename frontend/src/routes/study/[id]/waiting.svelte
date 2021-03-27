<script>
  import { steps } from "../../../steps/steps";
  import { studyStore } from "../../../stores/studyStore";

  let clicked = false;

  const onReady = async () => {
    await studyStore.readyComplete($studyStore.session, $studyStore.pid);
  };
</script>

<div class="container-outer">
  {#if $studyStore.step === steps.WAITING_ROOM}
    <h1>Waiting for others to join...</h1>
    <h2>Please don't leave the page.</h2>
  {/if}

  {#if $studyStore.step === steps.WAITING_ROOM_READY}
    <h1>Press ready to start (you have one minute to click)</h1>
    <button on:click={onReady}>Ready</button>
  {/if}

  {#if $studyStore.step === steps.WAITING_ROOM_READY_SUBMITTED}
    <h1>Waiting for others to continue...</h1>
  {/if}

  <hr size="5" noshade>

  <h2>Keep in Mind...</h2>

  <ol>
    <li>
      We request you perform the session on a laptop and use either the Firefox or
      Chrome browser. Please do not use the back button during the course of this session. 
    </li>
    <li>
      When you join the Pith discussion, please input a nickname. <strong
        >Make sure you remember this nickname so you can record it during the
        survey.</strong
      > Please make sure your nickname does NOT have any personal identifiable information,
      such as your name or date of birth. There should be no way that your nickname
      can be traced back to you.
    </li>
    <li>
      You will be in the discussion room for 15 minutes with several other people.
      With this group, you will be completing the "Stranded" task: <strong
        >identify and rank the top ten items the group should take if you all were
        stranded on an island for a long time.</strong
      >
    </li>
    <li>
      At the end of the discussion, you will be redirected to a survey. It should
      take approximately 10 minutes. After submitting the survey, you will be
      redirected to Prolific to indicate the completion of your session and the
      submission of your response.
    </li>
  </ol>

  <p>
    <em>Payment</em>
    <br />
    Accepted responses will receive $10. After the discussion and in the survey, you
    will be asked to report the items your group decided to include and say why you’ve
    included each item. For each item that all members of the group reported was in
    the ranking, each member of the group will receive an additional 50 cents in bonus.
    Maximum ten items, or $5 bonus.
  </p>
</div>

<style>
  button {
    height: 150px;
    width: 400px;
    font-size: 75px;
  }
</style>
