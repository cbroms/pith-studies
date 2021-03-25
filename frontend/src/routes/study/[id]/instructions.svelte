<script>
  import { studyStore } from "../../../stores/studyStore";

  const onContinue = async () => {
    await studyStore.instructionsComplete($studyStore.pid);
  };
</script>

<div class="container-outer">
  <h1>Instructions</h1>

  <ol>
    <li>
      We request you perform the session on a laptop and use either the Firefox or
      Chrome browser.
    </li>
    <li>
      Please read these instructions carefully. Once you are done, click the
      "Continue" button.
    </li>
    <li>On the next page, you will follow a tutorial to use the platform.</li>
    <li>
      Once you are done with the tutorial, you will be redirected to the waiting
      room. The "Start" button will appear within 15 minutes. <strong
        >Please do not leave the waiting room during this time.</strong
      > Once the button appears, please click on it to join the discussion. You will
      be given a minute to click on the button.
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

  <button on:click={onContinue}>Continue</button>
</div>

<style>
  .container-outer {
    padding: 40px;
  }
</style>
