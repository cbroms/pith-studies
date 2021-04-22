<script>
  import { stores } from "@sapper/app";

  import { afterUpdate, onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { adminStore } from "../../stores/adminStore";
  import { timerStore } from "../../stores/timerStore";
  import Timer from "../../components/Timer.svelte";

  import { adminSocket as socket } from "../../stores/socket";
  import { getValue, setValue } from "../../utils/localStorage";
  const { session } = stores();
  const { CONNECTION } = $session;

  // initialize study socket
  onMount(async () => {
    socket.initialize(CONNECTION, "Admin");
  });

  afterUpdate(() => {
    if (
      $adminStore.timerEnd &&
      !$adminStore.readyEnd &&
      !$adminStore.initTimer
    ) {
      timerStore.initialize($adminStore.timerEnd);
      adminStore.initTimer();
    } else if (
      $adminStore.readyEnd &&
      !$adminStore.discEnd &&
      !$adminStore.initTimer
    ) {
      timerStore.initialize($adminStore.readyEnd);
      adminStore.initTimer();
    } else if (
      $adminStore.discEnd &&
      !$adminStore.trueEndDisc &&
      !$adminStore.initTimer
    ) {
      timerStore.initialize($adminStore.discEnd);
      adminStore.initTimer();
    }
  });
</script>

<main>
  <Timer />
  <slot />
</main>
