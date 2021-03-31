<script>
  import { stores } from "@sapper/app";

  import { afterUpdate, onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { adminStore } from "../../stores/adminStore";
  import Timer from "../../components/Timer.svelte";

  import { adminSocket as socket } from "../../stores/socket";
  const { session } = stores();
  const { CONNECTION } = $session;

  // initialize study socket
  onMount(async () => {
    socket.initialize(CONNECTION, "Admin");
  });

  afterUpdate(() => {
    if ($adminStore.sid) {
      goto(`/admin/${$adminStore.sid}`);
    }
  });
</script>

<main>
  <Timer />
  <slot />
</main>
