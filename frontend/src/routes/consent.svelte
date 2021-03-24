<script>
  import { studyStore } from "../stores/studyStore";
  let consent1 = false;
  let consent2 = false;
  let consent3 = false;

  const onSubmit = async () => {
    await studyStore.consentComplete(
      $studyStore.pid,
      consent1,
      consent2,
      consent3
    );
  };
</script>

<h1>Consent</h1>
<p>
  Soluta sed necessitatibus et. Quo fuga dolorem ut ea. Optio sit sit velit
  voluptatibus soluta recusandae. Cumque ut suscipit amet sint nihil facilis
  iure. Exercitationem et et vitae voluptatibus velit nostrum ut voluptatum.
</p>
<p>
  Sapiente et quod sunt harum ipsam quia tempora. Ad corporis laudantium
  excepturi. Doloremque animi quisquam non dolorum quis nisi itaque. Architecto
  ut sequi fugit vel. Sint repellendus et quasi ipsa itaque reprehenderit
  suscipit excepturi.
</p>
<p>
  Quaerat a fugit velit quam dolor. Deserunt laboriosam voluptatem culpa non
  officiis saepe est aut. Quos a minima totam similique. Non a qui commodi
  laboriosam sapiente.
</p>

<label>
  <input type="checkbox" bind:checked={consent1} />
  I am cool
</label>

<label>
  <input type="checkbox" bind:checked={consent2} />
  I am good
</label>

<label>
  <input type="checkbox" bind:checked={consent3} />
  I am nice
</label>

<button on:click={onSubmit}>Submit</button>
