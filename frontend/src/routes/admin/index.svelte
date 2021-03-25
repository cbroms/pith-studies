<script>
  import { goto } from "@sapper/app";
  import { adminStore } from "../../stores/adminStore";
  let studyNumber = "";

  const onSubmit = async () => {
    await adminStore.createStudy(studyNumber);
    goto(`admin/${studyNumber}`);
  };
</script>

<h1>Create a new study</h1>

<label for="study">New study ID: </label>
<input name="study" bind:value={studyNumber} />

<button on:click={onSubmit}>Create Study</button>
