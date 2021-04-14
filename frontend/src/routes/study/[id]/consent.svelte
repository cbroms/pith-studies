<script>
  import { studyStore } from "../../../stores/studyStore";
  let consent1 = false;
  let consent2 = false;
  let consent3 = false;

  const onSubmit = async () => {
    await studyStore.consentComplete(
      $studyStore.session,
      $studyStore.pid,
      consent1,
      consent2,
      consent3
    );
  };
</script>

<div class="container-outer">
  <h1>Consent</h1>

  <p>
    This activity is part of a research study conducted by Principal Investigator Sydney Zheng with Faculty Advisor Kathleen Carley and Additional Investigator Christian Broms at Carnegie Mellon University and is funded by the Undergraduate Research Office at Carnegie Mellon University through the Small Undergraduate Research Grant.
  </p>

  <p>
    <strong>Title</strong>: "Pith: A Space for Productive Discussion"
  </p>

  <p>
    <strong>Summary</strong>
  </p>
  <p>
    You will work online in a group with &lt;10 other participants to solve a collaborative problem on a text-based discussion platform. After the discussion, you will be redirected to a survey asking about your experience completing the task and the platform itself. We request you perform the session on a laptop and use either the Firefox or Chrome browser. 
  </p>

  <p>
    <strong>Purpose</strong>
  </p>
  <p>
    The purpose of the research is to test the design of the Pith discussion platform that we have created.
  </p>

  <p>
    <strong>Procedures</strong>
  </p>
  <p>
    <em>Duration</em>: Overall, we expect your session to take 30-40 minutes.
  </p>
  <p>
    You will be asked to read and approve the consent form, read the instructions, and then wait in the waiting room for other participants to join the session. There will be a timer present from the moment you see the consent form to indicate how much time you have left until you should be in the waiting room. You should have between 5-15 minutes. 
  </p>
  <p>
    If you are in the waiting room, you will receive a button that you can click on to join the discussion around the time the timer finishes. You must click the button within a minute after seeing it. <strong>If you do not enter the waiting room in time and click on the button, you will not be able to progress further in the study.</strong>
  </p>
  <p>
    You will have exactly 15 minutes to work with the others in the discussion on the Pith platform to solve the Stranded problem. The goal is to identify and rank 10 items you would take with you as a group if all of you are stranded. 
  </p>
  <p>
    Once the 15 minutes are up, you will be redirected to a survey, which you should be able to complete in about 10 minutes. Once you are done, you will be redirected to the Prolific site and your session is complete.
  </p>
  <p>
    NOTE: In the case that there are fewer than <em>three</em> people that are ready to start the discussion, the discussion will also not continue. The study will end early, and if you have clicked the button in the waiting room, you can be redirected to Prolific.
  </p>
  
  <p>
    <strong>Participant Requirements</strong>
  </p>
  <p>
    Participation in this study is limited to individuals who are age 18 and older, can speak English fluently, have a Prolific approval rating >95%, and have not been in a previous study with us.
  </p>
  <!-- <p>
    We also require that you have done between 100-10000 Prolific studies previously.
  </p> -->

  <p>
    <strong>Risks</strong>
  </p>
  <p>
    The risks and discomfort associated with participation in this study are no greater than those ordinarily encountered in daily life or while interacting with others in online activities.
  </p>

  <p>
    <strong>Benefits</strong>
  </p>
  <p>
    Participants may enjoy using and contributing feedback about a novel discussion platform aimed at productive large-scale discussion.
  </p>

  <p>
    <strong>Compensation & Costs</strong>
  </p>

	<p><em>Base compensation</em></p>
	<p>If you sign the consent form, participate in the discussion, and complete the survey, you will receive the full payment of $10.<p> 

	<p><em>Bonus</em></p>
	<p>After the discussion and in the survey, you will be asked to report the items your group decided to include and say why you've included each item. For each item that <em>all</em> members of the group reported was in the ranking with at least a sentence of justification, each member of the group will receive an additional 50 cents in bonus. Maximum $5 bonus from ten such items.<p>

	<p><em>If you are unable to finish</em></p>
	<ul>
		<li>
			If you sign the consent form and participate in the discussion but do not complete the survey for whatever reason, you will be given $5 and no bonus. Note that the survey will not be considered complete if you do not answer the required questions, or if the nickname you report you used in the discussion is invalid.
		</li>
		<li>
			You will receive $2.50 and no bonus if you sign the consent form and make an effort to reach the waiting room, but are not able to reach the discussion in time. 
		</li>
	</ul>

	<p><em>If the study terminates early</em></p>
	<p>You will receive $2.50 and no bonus if you sign the consent form and make an effort to reach the waiting room, but the study has too few people to continue to the discussion stage.</p>

	<p><em>If you do not consent to the study</em></p>
	<p>If you do not consent to participate via the online consent form, you will not be given any compensation or bonus.</p>


  <p>
    <em>Cost</em>
  </p>
  <p>
    There will be no cost to you if you participate in this study. 
  </p>

  <p>
    <strong>Confidentiality</strong>
  </p>
  <p>
    The data captured for the research does not include any personally identifiable information about you.  Your IP address will not be captured. We will record your Prolific participant ID.
  </p>
  <p>
    We will be collecting a record of the discussion between you and the other participants in your group while using our platform. Therefore, we will need to know your “nickname”, your discussion username, in order to determine your contributions to the discussion.
  </p>
  <p>
    By participating in this research, you understand and agree that Carnegie Mellon may be required to disclose your consent form, data and other personally identifiable information as required by law, regulation, subpoena or court order.  Otherwise, your confidentiality will be maintained in the following manner:
  </p>
  <p>
    Your data and consent form will be kept separate. Your consent form will be stored in a secure location on Carnegie Mellon property and will not be disclosed to third parties. By participating, you understand and agree that the data and information gathered during this study may be used by Carnegie Mellon and published and/or disclosed by Carnegie Mellon to others outside of Carnegie Mellon.  However, your name, address, contact information and other direct personal identifiers will not be mentioned in any such publication or dissemination of the research data and/or results by Carnegie Mellon. Note that per regulation all research data must be kept for a minimum of 3 years.
  </p>

  <p>
    <strong>Right to Ask Questions &amp; Contact Information</strong>
  </p>
  <p>
    If you have any questions about this study, you should feel free to ask them by
    contacting the Principal Investigator now through email at
    <a href="mailto:slzheng@andrew.cmu.edu">slzheng@andrew.cmu.edu</a>. If you
    have questions later, desire additional information, or wish to withdraw your
    participation please contact the Principal Investigator through the contact
    information listed above.
  </p>
  <p>
    If you have questions pertaining to your rights as a research participant; or to
    report concerns to this study, you should contact the Office of Research integrity
    and Compliance at Carnegie Mellon University. Email:
    <a href="irb-review@andrew.cmu.edu">irb-review@andrew.cmu.edu</a>. Phone:
    412-268-1901 or 412-268-5460.
  </p>

  <p>
    <strong>Voluntary Participation</strong>
  </p>
  <p>
    Your participation in this research is voluntary. You may discontinue participation
    at any time during the research activity. You may print a copy of this consent
    form for your records.
  </p>

  <div class="response">
    <div>
      <strong class="sign">I am age 18 or older.</strong>
      <label class="option">Yes<input type="radio" bind:group={consent1} value={true} /></label>
      <label class="option">No<input type="radio" bind:group={consent1} value={false} /></label>
    </div>

    {#if consent1}
      <div>
        <strong class="sign">I have read and understand the information above.</strong>
        <label class="option">Yes<input type="radio" bind:group={consent2} value={true} /></label>
        <label class="option">No<input type="radio" bind:group={consent2} value={false} /></label>
      </div>
    {/if}

    {#if consent1 && consent2}
      <div>
        <strong class="sign">I want to participate in this research and continue with the activity.</strong>
        <label class="option">Yes<input type="radio" bind:group={consent3} value={true} /></label>
        <label class="option">No<input type="radio" bind:group={consent3} value={false} /></label>
      </div>
    {/if}

    <div class="submission">
    {#if consent1 && consent2 && consent3}
      <button on:click={onSubmit}>Submit</button>
    {/if}
    </div>
  </div>
  <div class="footer"/>
</div>

<style>
  input[type='radio'] {
    border-radius: 0%;
  }
  .response {
    margin: 20px 0 20px 0;
  }
  .footer {
    margin: 200px;
  }
  .sign {
    margin-right: 20px;
    font-size: 21px;
  }
  .submission {
    margin-top: 10px;
  }
</style>
