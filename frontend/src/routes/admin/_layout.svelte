<script>
  import { stores } from "@sapper/app";

  import { afterUpdate, onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { adminStore } from "../../stores/adminStore";
  import { timerStore } from "../../stores/timerStore";
  import Timer from "../../components/Timer.svelte";

  import { adminSocket as socket } from "../../stores/socket";
  const { session } = stores();
  const { CONNECTION } = $session;

  let stage = 0;

  // initialize study socket
  onMount(async () => {
    socket.initialize(CONNECTION, "Admin");
  });

  afterUpdate(() => {
    if ($adminStore.sid && stage === 0) {
      goto(`/admin/${$adminStore.sid}`);
    }
    if ($adminStore.timerEnd && stage == 0) {
      timerStore.initialize($adminStore.timerEnd);
      stage += 1;
    }
    else if ($adminStore.readyEnd && stage === 1) {
      timerStore.initialize($adminStore.readyEnd);
      stage += 1;
    }
    else if ($adminStore.discEnd && stage === 2) {
      timerStore.initialize($adminStore.discEnd);
      stage += 1;
    }
  });
</script>

<main>
  <Timer />
  <slot />
</main>
