<script>
  import { studyStore } from "../../../stores/studyStore";

  let response0 = null;
  let response1 = null;
  let response2 = null;
  let response3 = null;
  let response4 = null;
  let response5 = null;

  const onContinue = async () => {
    const answers = {
      response0: response0,
      response1: response1,
      response2: response2,
      response3: response3,
      response4: response4,
      response5: response5,
    };

    await studyStore.surveyTaskComplete($studyStore.session, $studyStore.pid, answers);
  };
</script>

<div class="container-outer">
  <h1>Survey: Task</h1>

  <p><em>You will only be able to continue once you have answered all the required questions.</em></p>

  <p><em>Short-answer</em></p>
  <ol>
    <li>
      <em>(required)</em> Please input the nickname you used during the discussion. <strong>Failure to do this will result in at most $5 compensation instead of the full $10.</strong>
      <div class="answer"><input bind:value={response0} /></div>
    </li>
    <li>
      <em>(required)</em> Please report the items your group decided to include in the final ranking. <strong>Justify each item in about a sentence. Each item justified can earn you 50 cents bonus if everyone else also justifies the item. Max $5 bonus from ten such items.</strong>
      <div class="answer"><textarea bind:value={response1} /></div>
    </li>
  </ol>

  <p><em>Multiple Choice ((1 is low, 5 is high)</em></p>
  <ol>
    <li>
      <em>(required)</em> Please rate how good you think the group plan is (1-5).
      <div class="answer">
        <label class="option">1<input type="radio" bind:group={response2} value={1} /></label>
        <label class="option">2<input type="radio" bind:group={response2} value={2} /></label>
        <label class="option">3<input type="radio" bind:group={response2} value={3} /></label>
        <label class="option">4<input type="radio" bind:group={response2} value={4} /></label>
        <label class="option">5<input type="radio" bind:group={response2} value={5} /></label>
      </div>
    </li>
    <li>
      <em>(required)</em> Please rate how much you feel you have contributed to the group discussion
      (1-5).
      <div class="answer">
        <label class="option">1<input type="radio" bind:group={response3} value={1} /></label>
        <label class="option">2<input type="radio" bind:group={response3} value={2} /></label>
        <label class="option">3<input type="radio" bind:group={response3} value={3} /></label>
        <label class="option">4<input type="radio" bind:group={response3} value={4} /></label>
        <label class="option">5<input type="radio" bind:group={response3} value={5} /></label>
      </div>
    </li>
    <li>
      <em>(required)</em> Please rate how much you felt your ideas were heard by the group (1-5).
      <div class="answer">
        <label class="option">1<input type="radio" bind:group={response4} value={1} /></label>
        <label class="option">2<input type="radio" bind:group={response4} value={2} /></label>
        <label class="option">3<input type="radio" bind:group={response4} value={3} /></label>
        <label class="option">4<input type="radio" bind:group={response4} value={4} /></label>
        <label class="option">5<input type="radio" bind:group={response4} value={5} /></label>
      </div>
    </li>
  </ol>

  <p><em>Please note down any other observations you would like to share.</em></p>
  <div class="answer">
    <textarea bind:value={response5} />
  </div>

  {#if response0 && response1 && response2 && response3 && response4}
    <div><button on:click={onContinue}>Continue</button></div>
  {/if}
</div>
