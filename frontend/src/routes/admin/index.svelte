<script>
  import { goto } from "@sapper/app";

  import { adminStore } from "../../stores/adminStore";

  let studyNumber = "";

  const onSubmit = async () => {
    await adminStore.createStudy(studyNumber);
    goto(`admin/${studyNumber}`);
  };
</script>

<div class="container-outer">
  <h1>Create a new study</h1>

  <h3>New study ID: </h3>
  <input bind:value={studyNumber} />

  <button on:click={onSubmit}>Create Study</button>
</div>
