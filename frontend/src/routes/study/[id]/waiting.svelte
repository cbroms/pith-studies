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

  <h2>Keep in Mind...</h2>

  <ol>
    <li>
      We request you perform the session on a laptop and use either the Firefox or
      Chrome browser. Please do not use the back button during the course of this session.
    </li>
    <li>
      The "Ready" button will appear around the end of the countdown. <strong>Please do not leave the waiting room during this time.</strong> Once the button appears, please click on it to join the discussion. You will be given a minute to click on the button.
    </li>
    <li>
      If the discussion has enough participants to start, you will be redirected to the discussion. Please input a nickname when requested. <strong>Make sure you remember this nickname so you can record it during the survey.</strong> Please make sure your nickname does NOT have any personal identifiable information, such as your name or date of birth. There should be no way that your nickname can be traced back to you. 
    </li>
    <li>
      You will be in the discussion room for 15 minutes with several other people. With this group, you will be solving the "Stranded" problem: <strong>identify and rank the top ten items the group should take if you all were stranded on an island for a long time.</strong> 
    </li>
    <li>
      At the end of the discussion, you will be redirected to a survey. It should take approximately 10 minutes. After submitting the survey, you will be redirected to Prolific to indicate the completion of your session and the submission of your response.
    </li>
    <li>
      If the discussion does not have enough participants to start, you will be sent to a page that will let you redirect back to Prolific.
    </li>
    <li>
    If you have any issues during the course of your session, please contact us at <a href="mailto:slzheng@andrew.cmu.edu">slzheng@andrew.cmu.edu</a>. 
    </li>
  </ol>

  <p>
    <strong>Payment</strong>
  </p>

	<p><em>Base compensation</em></p>
	<p>If you sign the consent form, participate in the discussion, and complete the survey, you will receive the full payment of $10.<p> 

	<p><em>Bonus</em></p>
	<p>After the discussion and in the survey, you will be asked to report the items your group decided to include and say why you've included each item. For each item that <em>all</em> members of the group reported was in the ranking with at least a sentence of justification, each member of the group will receive an additional 50 cents in bonus. Maximum $5 bonus from ten such items.<p>

	<p><em>If you are unable to finish</em></p>
	<ul>
		<li>
			If you sign the consent form and participate in the discussion but do not complete the survey for whatever reason, you will be given $5 and no bonus. Note that the survey will not be considered complete if you do not answer the required questions, or if the nickname you report you used in the discussion is invalid.
		</li>
		<li>
			You will receive $2.50 and no bonus if you sign the consent form and make an effort to reach the waiting room, but are not able to reach the discussion in time. 
		</li>
	</ul>

	<p><em>If the study terminates early</em></p>
	<p>You will receive $2.50 and no bonus if you sign the consent form and make an effort to reach the waiting room, but the study has too few people to continue to the discussion stage.</p>

	<p><em>If you do not consent to the study</em></p>
	<p>If you do not consent to participate via the online consent form, you will not be given any compensation or bonus.</p>

</div>

<style>
  button {
    height: 150px;
    width: 400px;
    font-size: 75px;
  }
</style>
