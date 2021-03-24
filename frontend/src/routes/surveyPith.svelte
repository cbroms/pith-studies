<script>
  import { studyStore } from "../stores/studyStore";

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
      "response1": response1,
      "response2": response2,
      "response3": response3,
      "response4": response4,
      "response5": response5,
      "response5": response6,
      "response5": response7,
      "response5": response8,
      "response5": response9,
      "response5": response10,
      "response5": response11
    };

    await studyStore.surveyPithComplete($studyStore.pid, answers);
  };
</script>

<h1>Survey: Discussion Platform</h1>

<p>
<em>Short-answer</em>
<ol>
  <li>
  Please describe what you liked about the platform.
  <input bind:value={response1} />
  </li>
  <li>
  Please describe what you disliked about the platform.
  <input bind:value={response2} />
  </li>
  <li>
  Were there any features you felt were especially useful and why?
  <input bind:value={response3} />
  </li>
  <li>
  Were there any features in the interface that were confusing and why?
  <input bind:value={response4} />
  </li>
  <li>
  How does Pith compare to other similar platforms you have used, such as text messaging, Slack, Discord, Reddit, etc.?
  <input bind:value={response5} />
  </li>
</ol>
</p>

<p>
<em>Multiple Choice (1 is low, 10 is high)</em>
<ol>
  <li>
  How easy is it to use Pith (scale of 1-10)?
  <input type=radio bind:group={response6} value={1} />
  <input type=radio bind:group={response6} value={2} />
  <input type=radio bind:group={response6} value={3} />
  <input type=radio bind:group={response6} value={4} />
  <input type=radio bind:group={response6} value={5} />
  <input type=radio bind:group={response6} value={6} />
  <input type=radio bind:group={response6} value={7} />
  <input type=radio bind:group={response6} value={8} />
  <input type=radio bind:group={response6} value={9} />
  <input type=radio bind:group={response6} value={10} />
  </li>
</ol>
</p>

<p>
Please note down any other observations you would like to share.
<input bind:value={response7} />
</p>

<h1>Survey: Pilot</h1>

<p>
<em>Short-answer</em>
<ol>
  <li>
  Did you use an external aid, such as a notepad, to complete the answers to this survey? Note that answering "yes" will not result in a loss of bonus.
  <input bind:value={response8} />
  </li>
  <li>
  Were there any technical difficulties during the course of your session? If so, please describe what they were.
  <input bind:value={response9} />
  </li>
  <li>
  Was there anything else about the study you felt could be improved?
  <input bind:value={response10} />
  </li>
</ol>
</p>

<p>
Please note down any other observations you would like to share.
<input bind:value={response11} />
</p>

<button on:click={onContinue}>Done</button>
