<script>
  import { studyStore } from "../../stores/studyStore";

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

    await studyStore.surveyTaskComplete($studyStore.pid, answers);
  };
</script>

<h1>Survey: Task</h1>

<em>Short-answer</em>
<ol>
  <li>
    <p>
      <em>(Required)</em> Please input the nickname you used during the discussion.
    </p>
    <input bind:value={response0} />
  </li>
  <li>
    <p>
      Please report the items your group decided to include in the final
      ranking. Justify each item in about a sentence.
    </p>
    <textarea bind:value={response1} />
  </li>
</ol>

<em>Multiple Choice ((1 is low, 5 is high)</em>
<ol>
  <li>
    Please rate how good you think the group plan is (1-5).
    <input type="radio" bind:group={response2} value={1} />
    <input type="radio" bind:group={response2} value={2} />
    <input type="radio" bind:group={response2} value={3} />
    <input type="radio" bind:group={response2} value={4} />
    <input type="radio" bind:group={response2} value={5} />
  </li>
  <li>
    Please rate how much you feel you have contributed to the group discussion
    (1-5).
    <input type="radio" bind:group={response3} value={1} />
    <input type="radio" bind:group={response3} value={2} />
    <input type="radio" bind:group={response3} value={3} />
    <input type="radio" bind:group={response3} value={4} />
    <input type="radio" bind:group={response3} value={5} />
  </li>
  <li>
    Please rate how much you felt your ideas were heard by the group (1-5).
    <input type="radio" bind:group={response4} value={1} />
    <input type="radio" bind:group={response4} value={2} />
    <input type="radio" bind:group={response4} value={3} />
    <input type="radio" bind:group={response4} value={4} />
    <input type="radio" bind:group={response4} value={5} />
  </li>
</ol>

<p>Please note down any other observations you would like to share.</p>
<textarea bind:value={response5} />

<!-- Give error if response0, for nickname, is null. -->
<div><button on:click={onContinue}>Continue</button></div>
