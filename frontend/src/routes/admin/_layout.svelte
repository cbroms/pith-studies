<script>
  import { stores } from "@sapper/app";

  import { onMount } from "svelte";

  import { adminSocket as socket } from "../../stores/socket.js";
  const { session } = stores();
  const { CONNECTION } = $session;

  // initialize admin socket
  onMount(async () => {
    socket.initialize(CONNECTION, "Studies");
  });
</script>

<main>
  <slot />
</main>
