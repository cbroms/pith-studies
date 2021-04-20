<script>
  import { studyStore } from "../stores/studyStore";
</script>

<h1>Tutorial</h1>

<h2>Creating a nickname</h2>
<p>
  When you join the discussion, you'll be prompted to create a nickname. Keep in
  mind that other participants in the discussion will see this nickname, so make
  sure it contains no personally identifiable information.
</p>
<img src="tutorial/0.png" alt="Create a nickname" />

<h2>The study interface</h2>
<p>Once in the study, you'll see an interface that looks like this:</p>
{#if $studyStore.testType === 1}
  <img src="tutorial/full1.png" alt="The discussion interface" />
{/if}
{#if $studyStore.testType === 2}
  <img
    src="tutorial/full2.png"
    class="big-image"
    alt="The discussion interface"
  />
  <p>It has two parts:</p>
  <ol>
    <li>The chat</li>
    <li>The summary</li>
  </ol>
  <p>Each part is described in more detail below.</p>
{/if}
{#if $studyStore.testType === 3}
  <img
    src="tutorial/full3.png"
    class="big-image"
    alt="The discussion interface"
  />
  <p>It has four parts:</p>
  <ol>
    <li>The chat</li>
    <li>The summary</li>
    <li>The board</li>
    <li>The focus section</li>
  </ol>
  <p>Each part is described in more detail below.</p>
{/if}
<h2>The Chat</h2>
<h3>Sending messages</h3>
<p>
  Once in the discussion, you can send messages to other participants by typing
  in the editor to the lower left of the screen and pressing the enter key.
</p>
<img src="tutorial/1.png" alt="Sending a message" />
<h3>Referencing messages</h3>
<p>
  You can copy a reference to other messages by hovering on a message and
  clicking on the "#".
</p>
<img src="tutorial/2.png" alt="Copying a message reference" />
<p>Paste the reference in the chat editor, then add any other text.</p>
<img src="tutorial/3.png" alt="Adding a reference to the chat" />
<p>The referenced message will be shown above your message.</p>
<img src="tutorial/4.png" alt="The reference displayed in a message" />
<h3>Flairing your message</h3>
<p>
  You can add a "Flair" to your message by selecting one or more of the flairs
  underneath the editor before sending your message.
</p>
<img src="tutorial/13.png" alt="Selecting a flair" />
<p>The flair will be displayed alongside your message in the chat.</p>
<img src="tutorial/14.png" alt="A flair on a message" />
{#if $studyStore.testType === 2 || $studyStore.testType === 3}
  <h2>The Summary</h2>
  <h3>Pinning messages</h3>
  <p>
    You can add a message to your discussion's "summary" by hovering over the
    message and clicking "Pin &rarr;".
  </p>
  <img src="tutorial/5.png" alt="Pinning a message" />
  <img src="tutorial/6.png" alt="The pinned message displayed in the summary" />
{/if}
{#if $studyStore.testType === 3}
  <h2>The Board</h2>
  <p>
    The board is a two-dimensional space you can place units of text. You can
    rearrange the units on the board by dragging them from their top bar. You
    can navigate this board by clicking and dragging, zooming in using a pinch
    gesture on your trackpad or the scrollwheel on your mouse. You can also use
    the zoom buttons in the lower right of the screen.
  </p>
  <img src="tutorial/8.png" alt="The board" />
  <p>
    You can create links between units by clicking on the black bar on the right
    side of a unit and dragging your mouse over another unit.
  </p>
  <img src="tutorial/10.png" alt="Links between units on the board" />
  <h2>The Focus Section</h2>
  <p>
    Pressing the "Focus" button on a unit will add it to the "Focusing on"
    section of the discussion above the board. Once added, you can remove a unit
    from the focusing section by clicking "Unfocus".
  </p>
  <img src="tutorial/12.png" alt="Focusing a unit" />
  <img src="tutorial/7.png" alt="A unit in the focusing section" />
{/if}

<style>
  img {
    display: block;
    margin: 40px auto;
    max-width: 500px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.301);
    width: 100%;
  }

  .big-image {
    max-width: 800px;
  }
</style>
