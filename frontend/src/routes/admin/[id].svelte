<script context="module">
  export async function preload(page, session) {
    const { id } = page.params;
    return { id };
  }
</script>

<script>
  import { onMount } from "svelte";

  import { adminStore } from "../../stores/adminStore";

  export let id;

  let discLink = null;
  let completionLink = null;
  let testType = null;

  onMount(async () => {
    console.log("mount: subscribe");
    adminStore.subscribeProgress();
  });

  const onSetDiscLink = () => {
    adminStore.setDiscLink(discLink);
  };
  const onSetCompletionLink = () => {
    adminStore.setProlificLink(completionLink);
  };
  const onSetTestType = () => {
    adminStore.setTestType(testType);
  };
  const onReadyDisc = () => {
    adminStore.readyDisc();
  }
  const onStartDisc = () => {
    adminStore.startDisc();
  }
  const onEndDisc = () => {
    adminStore.endDisc();
  }
  const onFinishStudy = () => {
    adminStore.teardownStudy();
  }

</script>

<div class="admin-panel-outer">
  <h1>Admin: <em>{id}</em></h1>

  <div class="admin-panel">
    <div class="panel">
      <h2>Control Panel</h2>

      <div class="settings">
        <h3>Parameters</h3>    

        <div class="param">
          <h5>Test Type (Tutorial)</h5>
          <form>
            <label class="option">1<input type="radio" bind:group={testType} value={1} /></label>
            <label class="option">2<input type="radio" bind:group={testType} value={2} /></label>
            <label class="option">3<input type="radio" bind:group={testType} value={3} /></label>
            <button on:click={onSetTestType}>Submit</button>
          </form>
        </div>

        <div class="param">
          <h5>Pith Discussion Link (Discussion)</h5>
          <form>
            <input bind:value={discLink} />
            <button on:click={onSetDiscLink}>Submit</button>
          </form>
        </div>

        <div class="param">
          <h5>Completion Link (Complete)</h5>
          <form>
            <input bind:value={completionLink} />
            <button on:click={onSetCompletionLink}>Submit</button>
          </form>
        </div>
      </div>

      <div class="settings">
        <h3>Discussion</h3>

        <button on:click={onReadyDisc}>Ready</button>
        <button on:click={onStartDisc}>Start</button>
        <button on:click={onEndDisc}>End</button>

        {#if $adminStore.startDisc}
          <p>Start Time: {$adminStore.startDisc}</p>
        {:else}
          <p>Start Time: ---</p>
        {/if}
        {#if $adminStore.endDisc}
          <p>End Time: {$adminStore.endDisc}</p>
        {:else}
          <p>End Time: ---</p>
        {/if}
      </div>

      <div class="settings">
        <h3>Study</h3>
        <button on:click={onFinishStudy}>Finish Study</button>
      </div>

    </div>

    <div class="panel">
      <h2>Participant Progress Panel</h2>
      <div class="progress">
        <div class="column">
          <div class="column-inner">
            <h4>Cancelled</h4>
            <ul>
                {#each $adminStore.cancelList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Consent</h4>
            <ul>
                {#each $adminStore.consentList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Instructions</h4>
            <ul>
                {#each $adminStore.instrList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Tutorial</h4>
            <ul>
                {#each $adminStore.tutorialList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Waiting</h4>
            <ul>
                {#each $adminStore.waitingList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Ready</h4>
            <ul>
                {#each $adminStore.readyList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Ready In</h4>
            <ul>
                {#each $adminStore.readySubList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Discussion</h4>
            <ul>
                {#each $adminStore.discussionList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Survey: Task</h4>
            <ul>
                {#each $adminStore.surveyTaskList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Survey: Pith</h4>
            <ul>
                {#each $adminStore.surveyPithList as pid (pid)}
                  <li>{pid}</li>
                {/each}
            </ul>
          </div>
        </div>
        <div class="column">
          <div class="column-inner">
            <h4>Complete</h4>
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
  .admin-panel-outer {
    margin-left: 50px;
    margin-top: 50px;
  }
  .admin-panel {
    display: flex;
  }
  .panel {
    padding-right: 20px;
  }
  h3 {
    padding: 10px 0 10px 0;
    margin: 0px;
  }
  h5 {
    padding: 5px 0 5px 0;
    margin: 0px;
  }
  p {
    padding: 5px;
    margin: 0px;
  }
  .settings {
    padding: 10px;
    border: 1px solid black;
  }
  .param {
    padding: 5px;
    border: 1px solid black;
  }
  .option {
    display: inline-block;
  }
  .progress {
    display: flex;
  }
  .column {
    width: 100px;
    border-left: 1px solid black;
    border-top: 1px solid black;
  }
  .column-inner {
    margin: 5px;
  }
</style>
