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
  let response9 = null;
  let response10 = null;
  let response11 = null;

  const onContinue = async () => {
    const answers = {
      response1: response1,
      response2: response2,
      response3: response3,
      response4: response4,
      response5: response5,
      response5: response6,
      response5: response7,
      response5: response8,
      response5: response9,
      response5: response10,
      response5: response11,
    };

    await studyStore.surveyPithComplete($studyStore.session, $studyStore.pid, answers);
  };
</script>

<div class="container-outer">
  <h1>Survey: Discussion Platform</h1>

  <em>Short-answer</em>
  <ol>
    <li>
      Please describe what you liked about the platform.
      <div class="answer">
        <textarea bind:value={response1} />
      </div>
    </li>
    <li>
      Please describe what you disliked about the platform.
      <div class="answer">
        <textarea bind:value={response2} />
      </div>
    </li>
    <li>
      Were there any features you felt were especially useful and why?
      <div class="answer">
        <textarea bind:value={response3} />
      </div>
    </li>
    <li>
      Were there any features in the interface that were confusing and why?
      <div class="answer">
        <textarea bind:value={response4} />
      </div>
    </li>
    <li>
      How does Pith compare to other similar platforms you have used, such as text
      messaging, Slack, Discord, Reddit, etc.?
      <div class="answer">
        <textarea bind:value={response5} />
      </div>
    </li>
  </ol>

  <em>Multiple Choice (1 is low, 10 is high)</em>
  <ol>
    <li>
      How easy is it to use Pith (scale of 1-10)?
      <div class="answer">
        <label class="option">1<input type="radio" bind:group={response6} value={1} /></label>
        <label class="option">2<input type="radio" bind:group={response6} value={2} /></label>
        <label class="option">3<input type="radio" bind:group={response6} value={3} /></label>
        <label class="option">4<input type="radio" bind:group={response6} value={4} /></label>
        <label class="option">5<input type="radio" bind:group={response6} value={5} /></label>
        <label class="option">6<input type="radio" bind:group={response6} value={6} /></label>
        <label class="option">7<input type="radio" bind:group={response6} value={7} /></label>
        <label class="option">8<input type="radio" bind:group={response6} value={8} /></label>
        <label class="option">9<input type="radio" bind:group={response6} value={9} /></label>
        <label class="option">10<input type="radio" bind:group={response6} value={10} /></label>
      </div>
    </li>
  </ol>

  <em>
    Please note down any other observations you would like to share.
  </em>
  <div class="answer">
    <textarea bind:value={response7} />
  </div>

  <h1>Survey: Pilot</h1>

  <em>Short-answer</em>
  <ol>
    <li>
      Did you use an external aid, such as a notepad, to complete the answers to
      this survey? Note that answering "yes" will not result in a loss of bonus.
      <div class="answer">
        <textarea bind:value={response8} />
      </div>
    </li>
    <li>
      Were there any technical difficulties during the course of your session? If
      so, please describe what they were.
      <div class="answer">
        <textarea bind:value={response9} />
      </div>
    </li>
    <li>
      Was there anything else about the study you felt could be improved?
      <div class="answer">
        <textarea bind:value={response10} />
      </div>
    </li>
  </ol>

  <em>
    Please note down any other observations you would like to share.
  </em>
  <div class="answer">
    <textarea bind:value={response11} />
  </div>

  <button on:click={onContinue}>Done</button>
</div>
