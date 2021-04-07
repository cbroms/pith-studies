<script>
  import { studyStore } from "../../../stores/studyStore";

  let response1 = null;
  let response2 = null;
  let response3 = null;
  let response4 = null;
  let response5 = null;
  let response6 = null;
  let response7 = null;
  let response8 = null;

  const onContinue = async () => {
    const answers = {
      response1: response1,
      response2: response2,
      response3: response3,
      response4: response4,
      response5: response5,
      response6: response6,
      response7: response7,
      response8: response8,
    };

    await studyStore.surveyPithComplete($studyStore.session, $studyStore.pid, answers);
  };
</script>

<div class="container-outer">
  <h1>Survey: Discussion Platform</h1>

  <p><em>You will only be able to continue once you have answered all the required questions.</em></p>

  <p><em>Short-answer</em></p>
  <ol>
    <li>
      <em>(required)</em> Please describe what you liked about the platform. 
      <div class="answer">
        <textarea bind:value={response1} />
      </div>
    </li>
    <li>
      <em>(required)</em> Please describe what you disliked about the platform.
      <div class="answer">
        <textarea bind:value={response2} />
      </div>
    </li>
  </ol>

  <p><em>Multiple Choice (1 is low, 10 is high)</em></p>
  <ol>
    <li>
      <em>(required)</em> How easy is it to use Pith (scale of 1-10)?
      <div class="answer">
        <label class="option">1<input type="radio" bind:group={response3} value={1} /></label>
        <label class="option">2<input type="radio" bind:group={response3} value={2} /></label>
        <label class="option">3<input type="radio" bind:group={response3} value={3} /></label>
        <label class="option">4<input type="radio" bind:group={response3} value={4} /></label>
        <label class="option">5<input type="radio" bind:group={response3} value={5} /></label>
        <label class="option">6<input type="radio" bind:group={response3} value={6} /></label>
        <label class="option">7<input type="radio" bind:group={response3} value={7} /></label>
        <label class="option">8<input type="radio" bind:group={response3} value={8} /></label>
        <label class="option">9<input type="radio" bind:group={response3} value={9} /></label>
        <label class="option">10<input type="radio" bind:group={response3} value={10} /></label>
      </div>
    </li>
  </ol>

  <p><em>
    Please note down any other observations you would like to share.
  </em></p>
  <div class="answer">
    <textarea bind:value={response4} />
  </div>

  <h1>Survey: Pilot</h1>

  <p><em>Short-answer</em></p>
  <ol>
    <li>
      <em>(required)</em> Did you use an external aid, such as a notepad, to complete the following question on the previous page: "Please report the items your group decided to include in the final ranking"? If so, please explain what you used it for. If not, just say "no". Note that answering "yes" will not result in a loss of bonus.
      <div class="answer">
        <textarea bind:value={response5} />
      </div>
    </li>
    <li>
      <em>(required)</em> Were there any technical difficulties during the course of your session? If so, please describe what they were. If not, just say "no".
      <div class="answer">
        <textarea bind:value={response6} />
      </div>
    </li>
    <li>
      <em>(required)</em> Was there anything else about the study you felt could be improved? If so, please describe what could be improved and why it should be improved. If not, just say "no".
      <div class="answer">
        <textarea bind:value={response7} />
      </div>
    </li>
  </ol>

  <p><em>
    Please note down any other observations you would like to share.
  </em></p>
  <div class="answer">
    <textarea bind:value={response8} />
  </div>

  {#if response1 && response2 && response3 && response5 && response6 
    && response7}
    <button on:click={onContinue}>Done</button>
  {/if}
</div>
