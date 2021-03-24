<script>
  import { studyStore } from "../stores/studyStore";

  const onContinue = async () => {
    await studyStore.instructionsComplete($studyStore.pid);
  };
</script>

<h1>Instructions</h1>

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

<button on:click={onContinue}>Continue</button>
