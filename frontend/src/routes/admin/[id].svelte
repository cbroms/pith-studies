<script context="module">
  export async function preload(page, session) {
    const { id } = page.params;
    return { id };
  }
</script>

<script>
  import { adminStore } from "../../stores/adminStore";

  export let id;

  let discLink = null;
  let completionLink = null;
  let testType = null;

  const onDiscLink = async () => {
    await adminStore.setDiscLink(discLink);
  };
  const onCompletionLink = async () => {
    await adminStore.setProlificLink(completionLink);
  };
  const onTestType = async () => {
    await adminStore.setTestType(testType);
  };
  const onReadyDisc = async () => {
    await adminStore.readyDisc();
  }
  const onStartDisc = async () => {
    await adminStore.startDisc();
  }
  const onEndDisc = async () => {
    await adminStore.endDisc();
  }
  const onFinishStudy = async () => {
    await adminStore.teardownStudy();
  }

</script>

<div class="admin-panel">
  <h1>Admin: <em>{id}</em></h1>

  <div>
    <div class="panel">
      <div class="param_settings">
        <div class="param">
          <h5>Test Type (Tutorial): {$adminStore.testType}</h5>
            <label class="option">1<input type="radio" bind:group={testType} value={1} /></label>
            <label class="option">2<input type="radio" bind:group={testType} value={2} /></label>
            <label class="option">3<input type="radio" bind:group={testType} value={3} /></label>
          <button on:click={onTestType}>Submit</button>
        </div>

        <div class="param">
          <h5>Pith Discussion Link (Discussion): <a href={$adminStore.discLink}>{$adminStore.discLink}</a></h5>
          <input bind:value={discLink} />
          <button on:click={onDiscLink}>Submit</button>
        </div>

        <div class="param">
          <h5>Completion Link (Complete): <a href={$adminStore.completionLink}>{$adminStore.completionLink}</a></h5>
          <input bind:value={completionLink} />
          <button on:click={onCompletionLink}>Submit</button>
        </div>
      </div>

      <div class="disc_settings">
        <div class="disc_buttons">
          <button class="disc_button" on:click={onReadyDisc}>Ready</button>
          <button class="disc_button" on:click={onStartDisc}>Start</button>
          <button class="disc_button" on:click={onEndDisc}>End</button>
        </div>

        <div>
          {#if $adminStore.startDisc}
            <h5>Start Time: {$adminStore.startDisc}</h5>
          {:else}
            <h5>Start Time: ---</h5>
          {/if}
          {#if $adminStore.endDisc}
            <h5>End Time: {$adminStore.endDisc}</h5>
          {:else}
            <h5>End Time: ---</h5>
          {/if}
        </div>
      </div>

      <div class="finish_settings">
        <button on:click={onFinishStudy}>Finish Study</button>
      </div>

    </div>

    <div class="panel">
      <div class="progress">
        <div class="column" style="margin-left: -2px">
          <div class="column-inner">
            <h5>Cancelled</h5>
            <ul>
                {#each $adminStore.cancelList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Consent</h5>
            <ul>
                {#each $adminStore.consentList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Instructions</h5>
            <ul>
                {#each $adminStore.instrList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Tutorial</h5>
            <ul>
                {#each $adminStore.tutorialList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Waiting</h5>
            <ul>
                {#each $adminStore.waitingList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Ready Out</h5>
            <ul>
                {#each $adminStore.readyList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Ready In</h5>
            <ul>
                {#each $adminStore.readySubList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Discussion</h5>
            <ul>
                {#each $adminStore.discussionList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Survey: Task</h5>
            <ul>
                {#each $adminStore.surveyTaskList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Survey: Pith</h5>
            <ul>
                {#each $adminStore.surveyPithList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h5>Complete</h5>
            <ul>
                {#each $adminStore.doneList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  .admin-panel {
    border: 4px solid black;
    margin: 100px auto;
    max-width: 1200px;
    width: 100%;
    border-collapse: collapse;
  }
  .panel {
    display: flex;
    width: 100%;
  }
  h1 {
    margin: 20px auto 20px auto;
    text-align-last: center;
    padding: 0;
  }
  h5 {
    padding: 5px 0 5px 0;
    margin: 0px;
  }
  .param_settings {
    display: flex;
    padding: 10px;
  }
  .disc_settings {
    padding: 5px;
  }
  .finish_settings {
    display: flex;
    padding: 10px;
  }
  .param {
    padding: 10px;
  }
  .option {
    display: inline-block;
  }
  .progress {
    display: flex;
    width: 100%;
  }
  .column {
    min-height: 400px;
    width: 100%;
    border-left: 2px solid black;
    border-top: 2px solid black;
  }
  .column-inner {
    margin: 5px;
  }
  .disc_buttons {
    display: flex;
    padding: 10px;
  }
  .disc_button {
    margin: 5px;
    width: 75px;
  }
  button {
    margin-top: 10px;
    height: auto;
  }
</style>
