<script>
  import { studyStore } from "../../stores/studyStore";
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
  This task and survey is part of a research study conducted by Principal
  Investigator Sydney Zheng with Faculty Advisor Kathleen Carley and Additional
  Investigator Christian Broms at Carnegie Mellon University and is funded by
  the Undergraduate Research Office at Carnegie Mellon University through the
  Small Undergraduate Research Grant.
</p>

<p>
  <strong>Title</strong>: "Pith"
</p>

<p>
  <strong>Summary</strong>
  <br />
  You will be put in a group with several other participants to work together to
  complete a collaborative task on a text-based discussion platform. After the discussion,
  you will be redirected to a survey asking about your experience completing the
  task and the platform itself. We request you perform the session on a laptop and
  use either the Firefox or Chrome browser.
</p>

<p>
  <strong>Purpose</strong>
  <br />
  The purpose of the research is to test the design of the Pith discussion platform.
</p>

<p>
  <strong>Procedures</strong>
  <br />
  <em>Duration</em>: Overall, we expect your session to take 30-40 minutes.
  <br />
  We are recruiting participants through Prolific. Participants will be asked to
  read and approve a consent form, read the instructions, and then wait in the waiting
  room. After about 5-15 minutes, they should receive a button they can click to
  start the discussion.
  <br />
  Participants will have exactly 15 minutes to work together on the Pith discussion
  platform to solve the Stranded challenge. The goal is to identify and rank 10 items
  they would take with them as a group if all of them are stranded.
  <br />
  Once the 15 minutes are up, the participants will be redirected to a Qualtrics
  survey, which they should be able to complete in about 10 minutes. Once they are
  done, they will be redirected to the Prolific site and their session is complete.
</p>

<p>
  <strong>Participant Requirements</strong>
  <br />
  Participation in this study is limited to individuals age 18 and older and who
  can speak English fluently.
</p>

<p>
  <strong>Risks</strong>
  <br />
  The risks and discomfort associated with participation in this study are no greater
  than those ordinarily encountered in daily life or while interacting with others
  in online activities.
</p>

<p>
  <strong>Benefits</strong>
  <br />
  Participants can receive compensation.
</p>

<p>
  <strong>Compensation & Costs</strong>
  <br />
  There is a $10 compensation for successful completion of the study, should your
  response be accepted. There is the possibility for a maximum of $5 bonus.
  <br />
  There will be no cost to you if you participate in this study.
</p>

<p>
  <strong>Confidentiality</strong>
  <br />
  The data captured for the research does not include any personally identifiable
  information about you. Your IP address will not be captured. We will record your
  Prolific participant ID.
  <br />
  We will have access to your discussion even after its conclusion. Therefore, we
  will know your nickname and associated contributions to the discussion. We will
  also have access to your answers to the survey.
  <br />
  By participating in this research, you understand and agree that Carnegie Mellon
  may be required to disclose your consent form, data and other personally identifiable
  information as required by law, regulation, subpoena or court order. Otherwise,
  your confidentiality will be maintained in the following manner:
  <br />
  Your data and consent form will be kept separate. Your consent form will be stored
  in a secure location on Carnegie Mellon property and will not be disclosed to third
  parties. By participating, you understand and agree that the data and information
  gathered during this study may be used by Carnegie Mellon and published and/or
  disclosed by Carnegie Mellon to others outside of Carnegie Mellon. However, your
  name, address, contact information and other direct personal identifiers will not
  be mentioned in any such publication or dissemination of the research data and/or
  results by Carnegie Mellon. Note that per regulation all research data must be
  kept for a minimum of 3 years.
</p>

<p>
  <strong>Right to Ask Questions &amp; Contact Information</strong>
  <br />
  If you have any questions about this study, you should feel free to ask them by
  contacting the Principal Investigator now through email at
  <a href="mailto:slzheng@andrew.cmu.edu">slzheng@andrew.cmu.edu</a>. If you
  have questions later, desire additional information, or wish to withdraw your
  participation please contact the Principal Investigator through the contact
  information listed above.
  <br />
  If you have questions pertaining to your rights as a research participant; or to
  report concerns to this study, you should contact the Office of Research integrity
  and Compliance at Carnegie Mellon University. Email:
  <a href="irb-review@andrew.cmu.edu">irb-review@andrew.cmu.edu</a>. Phone:
  412-268-1901 or 412-268-5460.
</p>

<p>
  <strong>Voluntary Participation</strong>
  <br />
  Your participation in this research is voluntary. You may discontinue participation
  at any time during the research activity. You may print a copy of this consent
  form for your records.
</p>

<!-- Only show each question if the previous one is answered. -->

<label>
  <input type="checkbox" bind:checked={consent1} />
  I am age 18 or older.
</label>

<label>
  <input type="checkbox" bind:checked={consent2} />
  I have read and understand the information above.
</label>

<label>
  <input type="checkbox" bind:checked={consent3} />
  I want to participate in this research and continue with the task and survey.
</label>

<button on:click={onSubmit}>Submit</button>
