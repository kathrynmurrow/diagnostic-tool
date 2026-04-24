
    // ======= CONFIGURE THESE BEFORE GO-LIVE =======
    const ROADMAP_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/26912613/ujjrsil/";
    const FEEDBACK_WEBHOOK_URL = "";
    // ==============================================

    const form = document.getElementById('diagnosticForm');
    const resultsPanel = document.getElementById('resultsPanel');
    const steps = [...document.querySelectorAll('.form-step')];
    const pills = {1: pill1 = document.getElementById('pill-1'), 2: pill2 = document.getElementById('pill-2'), 3: pill3 = document.getElementById('pill-3')};
    document.getElementById('roadmapEndpointLabel').textContent = ROADMAP_WEBHOOK_URL || "https://hooks.zapier.com/hooks/catch/26912613/ujjrsil/";
    document.getElementById('feedbackEndpointLabel').textContent = FEEDBACK_WEBHOOK_URL || "Not set";

    let latestPayload = null;

    function setStep(step){
      steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === step));
      [1,2,3].forEach(n => {
        pills[n].classList.remove('active','done');
        if(n < step) pills[n].classList.add('done');
        if(n === step) pills[n].classList.add('active');
      });
      window.scrollTo({top:0, behavior:'smooth'});
    }

    function bindRange(id, outId){
      const input = document.getElementById(id);
      const out = document.getElementById(outId);
      const sync = () => out.textContent = input.value;
      input.addEventListener('input', sync);
      sync();
    }
    ['clarity','support','visibility','workflowClarity','tools','governanceScore'].forEach(id => {
      const outMap = {clarity:'clarityValue',support:'supportValue',visibility:'visibilityValue',workflowClarity:'workflowValue',tools:'toolsValue',governanceScore:'governanceValue'};
      bindRange(id, outMap[id]);
    });

    document.getElementById('toStep2').onclick = () => setStep(2);
    document.getElementById('backTo1').onclick = () => setStep(1);
    document.getElementById('toStep3').onclick = () => setStep(3);
    document.getElementById('backTo2').onclick = () => setStep(2);
    document.getElementById('editInputs').onclick = () => { resultsPanel.classList.remove('active'); setStep(1); };

    function resetAll(){
      form.reset();
      ['clarity','support','visibility','workflowClarity','tools','governanceScore'].forEach(id => document.getElementById(id).value = 3);
      ['clarity','support','visibility','workflowClarity','tools','governanceScore'].forEach(id => {
        const outMap = {clarity:'clarityValue',support:'supportValue',visibility:'visibilityValue',workflowClarity:'workflowValue',tools:'toolsValue',governanceScore:'governanceValue'};
        document.getElementById(outMap[id]).textContent = 3;
      });
      document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
      resultsPanel.classList.remove('active');
      latestPayload = null;
      document.getElementById('payloadPreview').textContent = "{}";
      document.getElementById('sendStatus').textContent = "Status: prototype ready — generate a roadmap to begin";
      setSuccessState(false, 'Ready', 'Generate a roadmap to see what happens next.');
      document.getElementById('roadmapSummary').textContent = 'Generate the diagnostic to build a roadmap with embedded actions, coaching questions, and practical tips.';
      ['phase30Actions','phase30Questions','phase30Tips','phase60Actions','phase60Questions','phase60Tips','phase90Actions','phase90Questions','phase90Tips'].forEach(id => document.getElementById(id).innerHTML = '');
      document.getElementById('phase30Title').textContent = 'Stabilize';
      document.getElementById('phase60Title').textContent = 'Align';
      document.getElementById('phase90Title').textContent = 'Scale';
      document.getElementById('roadmapEvidence').textContent = '';
      document.getElementById('roadmapWatchout').textContent = '';
      setStep(1);
    }
    ['resetBtnTop','resetBtnBottom','resetBtnResults'].forEach(id => document.getElementById(id).onclick = resetAll);

    function unique(arr){ return [...new Set(arr)]; }
    function listToHTML(el, items){ el.innerHTML = items.map(i => `<li>${i}</li>`).join(''); }

    function setSuccessState(show, title, message){
      const box = document.getElementById('successState');
      const titleEl = document.getElementById('successTitle');
      const msgEl = document.getElementById('successMessage');
      box.style.display = show ? 'block' : 'none';
      titleEl.textContent = title;
      msgEl.textContent = message;
    }


    function buildPayload(values, diagnosticOutput, roadmap){
      return {
        submissionId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        submittedAt: new Date().toISOString(),
        source: "public_enablement_diagnostic",
        recipient: {
          email: values.recipientEmail || "",
          name: values.recipientName || "",
          organization: values.organization || ""
        },
        inputs: values,
        diagnosticOutput,
        roadmap
      };
    }

    function roadmapLibrary(primary, secondary, values){
      const audienceLabel = {frontline:'frontline users', managers:'people leaders', multiunit:'cross-functional leaders', admins:'system owners', mixed:'mixed audiences'}[values.audience] || 'target users';
      const primaryMap = {
        clarity: {
          phase30Title:'Clarify what success looks like',
          phase30Actions:['Define the few non-negotiable behaviors or outputs that prove readiness.', 'Translate expectations into visible checklists, examples, or success criteria inside the workflow.', 'Audit where people currently receive mixed signals or implied expectations.'],
          phase30Questions:['What would great execution look like in one observable example?', 'Where are people guessing instead of working from a clear standard?'],
          phase30Tips:['Use examples, not abstract standards.', 'Put role expectations at the point of need, not only in kickoff materials.'],
          phase60Title:'Align managers and measures',
          phase60Actions:['Coach leaders on how to reinforce the same standard across teams.', 'Update scorecards, dashboards, or reviews so they mirror the clarified expectations.', 'Remove duplicate or conflicting guidance from legacy resources.'],
          phase60Questions:['Are leaders reinforcing the same definition of success?', 'What signal would show the new expectation is sticking?'],
          phase60Tips:['Make one source of truth obvious.', 'Pair every expectation with the evidence that proves it happened.'],
          phase90Title:'Scale consistency',
          phase90Actions:['Embed clarified expectations into onboarding, refreshers, and manager routines.', 'Spot-check whether execution is consistent across locations or teams.', 'Capture the strongest examples and convert them into lightweight exemplars.'],
          phase90Questions:['Where is consistency improving, and where is drift still showing up?', 'Which exemplars should be standardized for new people?'],
          phase90Tips:['Protect against drift with regular audits.', 'Scale the examples people actually use, not just the ones you like.']
        },
        support: {
          phase30Title:'Stabilize reinforcement',
          phase30Actions:['Identify the moments where '+audienceLabel+' need support but currently hit silence.', 'Create quick manager prompts, coaching nudges, or short point-of-need guides.', 'Define who should check in during the first 30 days after exposure.'],
          phase30Questions:['Where does support drop off after the initial learning moment?', 'What follow-up behavior should a leader be doing that is not happening today?'],
          phase30Tips:['Keep reinforcement lightweight and repeatable.', 'Build supports for managers, not just learners.'],
          phase60Title:'Build coaching rhythm',
          phase60Actions:['Introduce a steady coaching cadence tied to real work.', 'Give leaders a short set of questions to use during observation or follow-up.', 'Track whether supports are actually being used, not just published.'],
          phase60Questions:['Which coaching move leads to better execution fastest?', 'Are the supports visible enough to be used in the moment?'],
          phase60Tips:['Tie coaching to live work, not generic check-ins.', 'Measure usage of support tools alongside performance.'],
          phase90Title:'Normalize reinforcement',
          phase90Actions:['Embed support prompts into the system or workflow itself.', 'Review adoption data and tune the supports based on where usage drops.', 'Scale the most effective coaching patterns across leaders.'],
          phase90Questions:['Which supports changed behavior, and which ones became noise?', 'How do we keep reinforcement going without adding admin burden?'],
          phase90Tips:['Retire supports that do not move behavior.', 'Standardize the strongest coaching prompts.']
        },
        visibility: {
          phase30Title:'Surface the signal',
          phase30Actions:['Name the few indicators leaders need to spot the issue earlier.', 'Audit where the signal is currently hidden, delayed, or too hard to interpret.', 'Create a temporary visibility view or dashboard that makes the risk obvious.'],
          phase30Questions:['What do leaders need to see earlier?', 'What decisions are being made today without enough signal?'],
          phase30Tips:['Show exceptions and risk, not just completion.', 'Design views around action, not vanity metrics.'],
          phase60Title:'Connect signal to action',
          phase60Actions:['Define who should act when a signal changes.', 'Pair every dashboard metric with a next-step expectation.', 'Test whether leaders can interpret the view without extra explanation.'],
          phase60Questions:['When the signal turns red, who acts and how fast?', 'Are we showing information or enabling decisions?'],
          phase60Tips:['Every metric should answer “so what?”', 'Keep the dashboard language plain and operational.'],
          phase90Title:'Operationalize visibility',
          phase90Actions:['Embed the new signals into leader routines, reviews, and escalation paths.', 'Remove unused metrics and sharpen the few that drive action.', 'Document the signal logic so it survives turnover or system changes.'],
          phase90Questions:['Which signals changed leader behavior the most?', 'What should stay on the dashboard and what should go?'],
          phase90Tips:['Protect focus by reducing clutter.', 'Treat visibility as part of enablement, not just reporting.']
        },
        workflow: {
          phase30Title:'Reduce friction fast',
          phase30Actions:['Map the current workflow and isolate the handoff or step where it breaks most often.', 'Remove unnecessary clicks, approvals, or duplicate steps where possible.', 'Clarify the exact sequence at the point of execution.'],
          phase30Questions:['Where does the workflow fail even when people are trying?', 'Which step creates the most confusion or rework?'],
          phase30Tips:['Fix the path before adding more instructions.', 'A cleaner workflow beats a longer course every time.'],
          phase60Title:'Redesign for reliability',
          phase60Actions:['Pilot a simpler workflow with a small group before broad rollout.', 'Update job aids, LMS placements, or prompts to reflect the new sequence.', 'Define the handoff ownership between teams or roles.'],
          phase60Questions:['What changed in the pilot that made execution easier?', 'Who owns each handoff and how is that visible?'],
          phase60Tips:['Pilot in the messiest real context you have.', 'Document handoffs as carefully as the steps themselves.'],
          phase90Title:'Lock in the new path',
          phase90Actions:['Scale the improved workflow and retire the outdated version.', 'Measure time, rework, and consistency before and after the redesign.', 'Create a lightweight governance loop to catch workflow drift early.'],
          phase90Questions:['How will we know the workflow is holding over time?', 'What drift indicators should trigger a future review?'],
          phase90Tips:['Retire the old path decisively.', 'Use workflow metrics, not anecdotes, to prove improvement.']
        },
        access: {
          phase30Title:'Remove blockers',
          phase30Actions:['Audit the critical tools, permissions, and resources people need to execute.', 'Fix the most common access failures first.', 'Make one clear path to the resources people use most often.'],
          phase30Questions:['What is blocking execution even when intent is high?', 'Which tools or resources are hardest to find or open?'],
          phase30Tips:['Solve the top blockers first, not every blocker at once.', 'Discoverability is part of enablement.'],
          phase60Title:'Improve discoverability',
          phase60Actions:['Reorganize resources around real tasks rather than internal ownership.', 'Reduce duplicate files, buried links, or conflicting versions.', 'Test whether a new user can find what they need without live help.'],
          phase60Questions:['Can someone find the right resource in under a minute?', 'Where do workarounds still show up?'],
          phase60Tips:['Label resources in user language.', 'One reliable resource is better than five partial ones.'],
          phase90Title:'Sustain access health',
          phase90Actions:['Create a recurring review for access issues and outdated links.', 'Monitor usage to confirm the new access path is actually preferred.', 'Fold access checks into onboarding or launch readiness reviews.'],
          phase90Questions:['What access issues are still recurring?', 'How do we catch broken permissions before users do?'],
          phase90Tips:['Treat broken access as an operational risk.', 'Review usage data to validate the fix.']
        },
        governance: {
          phase30Title:'Clarify ownership now',
          phase30Actions:['Name the business owner, decision owner, and escalation owner for this problem.', 'Document where approvals are slowing action or creating confusion.', 'Make the current decision path visible to the people in it.'],
          phase30Questions:['Who actually owns this today?', 'Where are decisions getting stuck or duplicated?'],
          phase30Tips:['Ownership should be explicit, not assumed.', 'Separate input from decision rights.'],
          phase60Title:'Tighten the decision model',
          phase60Actions:['Simplify approval logic and remove unnecessary gates.', 'Define service levels or response expectations for decisions.', 'Update documentation, dashboards, or workflows so the governance path is embedded.'],
          phase60Questions:['Which approvals are truly necessary?', 'What decisions should happen faster and by whom?'],
          phase60Tips:['Use governance to speed clarity, not slow work.', 'Put escalation rules where people will actually see them.'],
          phase90Title:'Institutionalize accountability',
          phase90Actions:['Review whether the clarified governance model reduced delay or duplication.', 'Embed ownership into leader routines and operating reviews.', 'Set a regular governance review cadence for future changes.'],
          phase90Questions:['Is accountability stronger, or just more documented?', 'What governance reviews should happen on a schedule now?'],
          phase90Tips:['If no one can explain the decision path simply, it is still too fuzzy.', 'Governance should survive turnover and scale.']
        }
      };
      const primaryData = primaryMap[primary] || primaryMap.support;
      const secondaryPrompt = {
        clarity:'Cross-check whether expectations are visible inside the system, not just mentioned verbally.',
        support:'Layer in manager reinforcement so the roadmap does not rely on a one-time launch.',
        visibility:'Make sure the roadmap includes a signal leaders can see early.',
        workflow:'Verify that the sequence itself supports the behavior you want.',
        access:'Check whether users can actually reach the resource at the moment of need.',
        governance:'Clarify who owns the next move and who approves changes.'
      }[secondary] || 'Check whether a secondary structural issue is undermining execution.';
      return {
        summary:`This roadmap is built to address ${primary} as the primary enablement issue, with ${secondary} as the secondary condition to monitor.`,
        evidence: 'Use the evidence signals below to confirm whether the structural change is improving execution, not just whether people completed another step.',
        watchout: secondaryPrompt,
        phase30Title: primaryData.phase30Title,
        phase30Actions: primaryData.phase30Actions,
        phase30Questions: primaryData.phase30Questions,
        phase30Tips: primaryData.phase30Tips,
        phase60Title: primaryData.phase60Title,
        phase60Actions: primaryData.phase60Actions,
        phase60Questions: primaryData.phase60Questions,
        phase60Tips: primaryData.phase60Tips,
        phase90Title: primaryData.phase90Title,
        phase90Actions: primaryData.phase90Actions,
        phase90Questions: primaryData.phase90Questions,
        phase90Tips: primaryData.phase90Tips
      };
    }

    function renderRoadmap(roadmap, evidenceNarrative, notYet){
      document.getElementById('roadmapSummary').textContent = roadmap.summary;
      document.getElementById('phase30Title').textContent = roadmap.phase30Title;
      document.getElementById('phase60Title').textContent = roadmap.phase60Title;
      document.getElementById('phase90Title').textContent = roadmap.phase90Title;
      listToHTML(document.getElementById('phase30Actions'), roadmap.phase30Actions);
      listToHTML(document.getElementById('phase30Questions'), roadmap.phase30Questions);
      listToHTML(document.getElementById('phase30Tips'), roadmap.phase30Tips);
      listToHTML(document.getElementById('phase60Actions'), roadmap.phase60Actions);
      listToHTML(document.getElementById('phase60Questions'), roadmap.phase60Questions);
      listToHTML(document.getElementById('phase60Tips'), roadmap.phase60Tips);
      listToHTML(document.getElementById('phase90Actions'), roadmap.phase90Actions);
      listToHTML(document.getElementById('phase90Questions'), roadmap.phase90Questions);
      listToHTML(document.getElementById('phase90Tips'), roadmap.phase90Tips);
      document.getElementById('roadmapEvidence').textContent = evidenceNarrative;
      document.getElementById('roadmapWatchout').textContent = notYet;
    }

    function downloadRoadmapFile(){
      const status = document.getElementById('sendStatus');
      if(!latestPayload){
        status.textContent = 'Status: generate the diagnostic first';
        setSuccessState(true, 'Nothing downloaded yet', 'Generate the roadmap first, then download your copy.');
        return;
      }
      const payload = latestPayload;
      const roadmap = payload.roadmap;
      const docTitle = `Enablement Strategy Roadmap${payload.recipient.name ? ' - ' + payload.recipient.name : ''}`;
      const makeList = (items) => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${docTitle}</title><style>body{font-family:Arial,sans-serif;color:#13263d;line-height:1.5;padding:28px;max-width:940px;margin:0 auto}h1,h2,h3{color:#13263d}h1{font-size:28px;margin-bottom:4px}h2{margin-top:26px;font-size:22px}h3{margin-top:18px;font-size:18px}p,li{font-size:14px}small{color:#637489;text-transform:uppercase;letter-spacing:.12em;font-weight:700}section{border:1px solid #dfe5ec;border-radius:14px;padding:18px;margin-top:16px;background:#fff} .meta{color:#637489;font-size:13px;margin-bottom:18px}</style></head><body><h1>${docTitle}</h1><div class="meta">Generated ${new Date(payload.submittedAt).toLocaleString()}${payload.recipient.organization ? ' • ' + payload.recipient.organization : ''}</div><p>${roadmap.summary}</p><section><h2>Diagnosis snapshot</h2><p><strong>Primary diagnosis:</strong> ${payload.diagnosticOutput.primaryDiagnosis}</p><p><strong>Owner:</strong> ${payload.diagnosticOutput.ownerPrimary}</p><p><strong>Training answer:</strong> ${payload.diagnosticOutput.trainingAnswer}</p><p><strong>Intervention type:</strong> ${payload.diagnosticOutput.interventionType}</p><p><strong>Evidence to watch:</strong> ${payload.diagnosticOutput.evidenceNarrative}</p><p><strong>Watch-out:</strong> ${payload.diagnosticOutput.notYet}</p></section><section><small>Days 1–30</small><h2>${roadmap.phase30Title}</h2><h3>Actions</h3>${makeList(roadmap.phase30Actions)}<h3>Coaching questions</h3>${makeList(roadmap.phase30Questions)}<h3>Tips</h3>${makeList(roadmap.phase30Tips)}</section><section><small>Days 31–60</small><h2>${roadmap.phase60Title}</h2><h3>Actions</h3>${makeList(roadmap.phase60Actions)}<h3>Coaching questions</h3>${makeList(roadmap.phase60Questions)}<h3>Tips</h3>${makeList(roadmap.phase60Tips)}</section><section><small>Days 61–90</small><h2>${roadmap.phase90Title}</h2><h3>Actions</h3>${makeList(roadmap.phase90Actions)}<h3>Coaching questions</h3>${makeList(roadmap.phase90Questions)}<h3>Tips</h3>${makeList(roadmap.phase90Tips)}</section></body></html>`;
      const blob = new Blob([html], {type:'application/msword'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (payload.recipient.name || payload.diagnosticOutput.primaryDiagnosis || 'roadmap').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase();
      a.href = url;
      a.download = `${safeName || 'enablement-roadmap'}-30-60-90.doc`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 500);
      status.textContent = 'Status: roadmap downloaded';
      setSuccessState(true, 'Roadmap downloaded', 'Your roadmap was downloaded successfully. You can review it now and connect email delivery later.');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const values = {
        challenge: document.getElementById('challenge').value.trim(),
        context: document.getElementById('context').value,
        audience: document.getElementById('audience').value,
        journeyStage: document.getElementById('journeyStage').value,
        recurrence: document.getElementById('recurrence').value,
        severity: document.getElementById('severity').value,
        resourceState: document.getElementById('resourceState').value,
        dataView: document.getElementById('dataView').value,
        clarity: Number(document.getElementById('clarity').value),
        support: Number(document.getElementById('support').value),
        visibility: Number(document.getElementById('visibility').value),
        workflowClarity: Number(document.getElementById('workflowClarity').value),
        tools: Number(document.getElementById('tools').value),
        governanceScore: Number(document.getElementById('governanceScore').value),
        symptoms: document.getElementById('symptoms').value.trim(),
        frictions: [...document.querySelectorAll('.check-item input:checked')].map(i => i.value),
        recipientEmail: document.getElementById('recipientEmail').value.trim(),
        recipientName: document.getElementById('recipientName').value.trim(),
        organization: document.getElementById('organization').value.trim(),
        consent: document.getElementById('consent').checked
      };

      const domainScores = {
        clarity: 6 - values.clarity,
        support: 6 - values.support,
        visibility: 6 - values.visibility,
        workflow: 6 - values.workflowClarity,
        access: 6 - values.tools,
        governance: 6 - values.governanceScore
      };

      if(values.severity === 'high'){ Object.keys(domainScores).forEach(k => domainScores[k] += 0.6); }
      else if(values.severity === 'medium'){ Object.keys(domainScores).forEach(k => domainScores[k] += 0.25); }

      if(values.recurrence === 'recurring'){ domainScores.governance += 0.5; domainScores.support += 0.4; domainScores.workflow += 0.4; }
      if(values.resourceState === 'yes-buried'){ domainScores.visibility += 0.8; }
      else if(values.resourceState === 'none'){ domainScores.support += 0.7; domainScores.access += 0.4; }
      else if(values.resourceState === 'partial'){ domainScores.support += 0.4; }
      if(values.dataView === 'no'){ domainScores.visibility += 0.9; }
      else if(values.dataView === 'somewhat'){ domainScores.visibility += 0.4; }

      values.frictions.forEach(f => {
        if(f === 'users'){ domainScores.clarity += 0.4; domainScores.support += 0.2; }
        if(f === 'admins'){ domainScores.governance += 0.5; domainScores.access += 0.3; }
        if(f === 'workflow'){ domainScores.workflow += 0.8; }
        if(f === 'governance'){ domainScores.governance += 0.9; }
        if(f === 'access'){ domainScores.access += 0.8; domainScores.visibility += 0.2; }
        if(f === 'leaders'){ domainScores.support += 0.7; domainScores.visibility += 0.2; }
      });

      if(values.context === 'onboarding'){ domainScores.clarity += 0.4; domainScores.support += 0.5; }
      if(values.context === 'adoption'){ domainScores.support += 0.4; domainScores.visibility += 0.2; }
      if(values.context === 'workflow'){ domainScores.workflow += 0.8; }
      if(values.context === 'governance'){ domainScores.governance += 0.9; }
      if(values.context === 'visibility'){ domainScores.visibility += 0.9; }
      if(values.journeyStage === 'transition'){ domainScores.workflow += 0.3; domainScores.clarity += 0.3; }
      if(values.journeyStage === 'leader'){ domainScores.support += 0.5; domainScores.visibility += 0.2; }
      if(values.journeyStage === 'reporting'){ domainScores.visibility += 0.6; domainScores.governance += 0.3; }

      const ranking = Object.entries(domainScores).sort((a,b) => b[1]-a[1]);
      const primary = ranking[0][0];
      const secondary = ranking[1][0];
      const scoreAvg = Object.values(domainScores).reduce((a,b)=>a+b,0) / Object.values(domainScores).length;
      let riskLevel = 'low';
      if(scoreAvg >= 2.6 || values.severity === 'high') riskLevel = 'high';
      else if(scoreAvg >= 2.0 || values.severity === 'medium') riskLevel = 'medium';

      const names = {
        clarity: 'role clarity',
        support: 'support structure',
        visibility: 'visibility',
        workflow: 'workflow design',
        access: 'access / tools',
        governance: 'governance / ownership'
      };
      const diagnosisMap = {
        clarity: 'This appears primarily to be a role clarity problem.',
        support: 'This appears primarily to be a support and reinforcement problem.',
        visibility: 'This appears primarily to be a visibility and signal problem.',
        workflow: 'This appears primarily to be a workflow design problem.',
        access: 'This appears primarily to be an access / tools problem.',
        governance: 'This appears primarily to be a governance and ownership problem.'
      };
      const ownerMap = {
        clarity: ['Enablement', 'Clarify role expectations, milestones, and performance evidence.'],
        support: ['Managers + Enablement', 'Strengthen reinforcement, coaching supports, and manager-facing guidance.'],
        visibility: ['Analytics / LMS / Business Owner', 'Improve dashboard visibility and make the issue measurable.'],
        workflow: ['Operations + Enablement', 'Redesign sequence, handoffs, and decision points before adding more training.'],
        access: ['LMS / Systems / Admin Owner', 'Resolve tool access, permissions, and resource discoverability barriers.'],
        governance: ['Governance Lead + Business Owner', 'Clarify decision rights, ownership, approval pathways, and escalation rules.']
      };
      const interventionMap = {
        clarity: 'Clarify expectations, role milestones, and evidence of success before expanding content.',
        support: 'Add reinforcement mechanisms, manager check-ins, quick supports, and execution coaching.',
        visibility: 'Improve dashboards, reporting access, and decision-support visibility before assuming the issue is capability alone.',
        workflow: 'Redesign the workflow or sequence first, then determine what learning support is still needed.',
        access: 'Fix access, permissions, and discoverability so people can use the right tools at the right time.',
        governance: 'Clarify who owns what, who approves what, and how decisions move before creating more assets.'
      };
      const trainingMap = {
        clarity: ['Maybe later', 'Training may help, but only after expectations are made clearer.'],
        support: ['Not primary', 'Training is unlikely to be the first answer if reinforcement and support remain weak.'],
        visibility: ['Not primary', 'This looks more like a visibility problem than a content problem.'],
        workflow: ['Not primary', 'Do not add more training before checking whether the process itself is broken or unclear.'],
        access: ['Not primary', 'Training will not solve missing access, missing tools, or poor discoverability.'],
        governance: ['Not primary', 'Training is not the first answer when ownership and decision rights are unclear.']
      };

      const root = [], gaps = [], questions = [], actions = [], tags = [];
      ranking.slice(0,3).forEach(([k]) => {
        if(k === 'clarity'){ root.push('People may not have a clear picture of what good execution looks like in this role or stage.'); gaps.push('Clarify expectations, milestones, and the behaviors that demonstrate readiness.'); questions.push('Where are expectations defined today, and are they visible in the system or only assumed?'); actions.push('Define or simplify role expectations and make them visible at the point of need.'); tags.push('Role clarity');}
        if(k === 'support'){ root.push('The system may be asking people to execute without enough reinforcement, coaching, or support tools.'); gaps.push('Strengthen manager-facing reinforcement and point-of-need supports.'); questions.push('What manager behaviors or follow-up structures should exist but currently do not?'); actions.push('Add manager supports, check-ins, quick guides, and reinforcement points.'); tags.push('Support');}
        if(k === 'visibility'){ root.push('Leaders may not be able to see the problem clearly enough to act consistently or early.'); gaps.push('Increase visibility into progress, risk, or failure points.'); questions.push('What should leaders be able to see that they currently cannot see easily?'); actions.push('Create or refine dashboards, signals, and action-oriented reporting views.'); tags.push('Visibility');}
        if(k === 'workflow'){ root.push('The process itself may be too confusing, fragmented, or inconsistent for people to succeed reliably.'); gaps.push('Simplify sequence, handoffs, and workflow guidance.'); questions.push('Where does the process break down, and is the sequence actually executable?'); actions.push('Map the current workflow, remove friction, and redesign unclear handoffs before creating more learning.'); tags.push('Workflow');}
        if(k === 'access'){ root.push('People may be blocked by missing tools, permissions, or hard-to-find resources.'); gaps.push('Improve access, discoverability, and ease of use for the required tools and resources.'); questions.push('Are the right resources available at the right time, and can people actually access them?'); actions.push('Resolve access issues, improve placement, and make critical resources easier to find.'); tags.push('Access');}
        if(k === 'governance'){ root.push('Ownership, approval, or decision rights may be too unclear for the system to function consistently.'); gaps.push('Clarify ownership, decision rights, and escalation logic.'); questions.push('Who owns this issue today, and who is supposed to decide what happens next?'); actions.push('Document ownership, define escalation paths, and remove ambiguity from governance decisions.'); tags.push('Governance');}
      });

      const diagnosisNarrative = diagnosisMap[primary] + ` The secondary signal points to ${names[secondary]}.`;
      const fixFirst = names[primary].replace(/\b\w/g, c => c.toUpperCase());
      const [owner, ownerDetail] = ownerMap[primary];
      const [trainingAnswer, trainingDetail] = trainingMap[primary];
      const interventionType = interventionMap[primary];

      let evidenceNarrative = 'Look for improved consistency, reduced repeated questions, clearer ownership, and stronger signal visibility in the area most affected.';
      if(primary === 'workflow') evidenceNarrative = 'Watch for fewer handoff failures, fewer missed steps, and more consistent execution across the same workflow.';
      if(primary === 'visibility') evidenceNarrative = 'Watch for earlier intervention, clearer dashboards, fewer hidden issues, and better leader action based on visible signals.';
      if(primary === 'support') evidenceNarrative = 'Watch for fewer clarifying questions, stronger manager follow-up, and more consistent use of support resources.';
      if(primary === 'clarity') evidenceNarrative = 'Watch for more consistent execution, fewer expectation-related questions, and stronger alignment across the role.';
      if(primary === 'access') evidenceNarrative = 'Watch for fewer access requests, stronger resource usage, and less workaround behavior.';
      if(primary === 'governance') evidenceNarrative = 'Watch for faster decisions, fewer duplicate requests, and less confusion around ownership or approvals.';

      let notYet = 'Do not default to building more training until the primary structural issue is addressed.';
      if(primary === 'clarity') notYet = 'Do not build more content before confirming that expectations, readiness milestones, and success criteria are actually clear.';
      if(primary === 'support') notYet = 'Do not assume the issue is solved by more training if reinforcement, coaching, and support tools remain weak.';
      if(primary === 'workflow') notYet = 'Do not create another course before testing whether the workflow itself needs redesign.';
      if(primary === 'visibility') notYet = 'Do not rely on anecdotal follow-up alone when better visibility and measurement are needed first.';
      if(primary === 'access') notYet = 'Do not ask people to perform better in a system they cannot fully access or navigate.';
      if(primary === 'governance') notYet = 'Do not add more assets or requests into a system where ownership and approval logic remain unclear.';

      const riskBadge = document.getElementById('riskBadge');
      riskBadge.textContent = `${riskLevel} risk`;
      riskBadge.className = 'risk-badge ' + (riskLevel === 'low' ? 'risk-low' : riskLevel === 'medium' ? 'risk-medium' : 'risk-high');

      document.getElementById('primaryDiagnosis').textContent = fixFirst + ' is the primary diagnosis';
      document.getElementById('diagnosisNarrative').textContent = diagnosisNarrative;
      document.getElementById('fixFirst').textContent = fixFirst;
      document.getElementById('fixFirstDetail').textContent = `Primary issue domain based on the current inputs and condition ratings.`;
      document.getElementById('ownerPrimary').textContent = owner;
      document.getElementById('ownerDetail').textContent = ownerDetail;
      document.getElementById('trainingAnswer').textContent = trainingAnswer;
      document.getElementById('trainingDetail').textContent = trainingDetail;
      document.getElementById('evidenceNarrative').textContent = evidenceNarrative;
      document.getElementById('interventionType').textContent = interventionType;
      document.getElementById('notYet').textContent = notYet;
      listToHTML(document.getElementById('rootCauses'), unique(root).slice(0,4));
      listToHTML(document.getElementById('readinessGaps'), unique(gaps).slice(0,4));
      listToHTML(document.getElementById('ownershipQuestions'), unique(questions).slice(0,4));
      listToHTML(document.getElementById('nextActions'), unique(actions).slice(0,5));

      const tagBox = document.getElementById('diagnosticTags');
      const tagItems = unique([...tags, values.context, values.audience, values.severity, values.recurrence]);
      tagBox.innerHTML = tagItems.map(t => `<span class="tag">${String(t).replace(/\b\w/g, c => c.toUpperCase())}</span>`).join('');

      const roadmap = roadmapLibrary(primary, secondary, values);
      const diagnosticOutput = {
        primaryDiagnosis: fixFirst,
        secondaryDiagnosis: names[secondary].replace(/\b\w/g, c => c.toUpperCase()),
        riskLevel, fixFirst, ownerPrimary: owner, trainingAnswer, interventionType,
        rootCauses: unique(root).slice(0,4),
        readinessGaps: unique(gaps).slice(0,4),
        ownershipQuestions: unique(questions).slice(0,4),
        nextActions: unique(actions).slice(0,5),
        notYet, evidenceNarrative, tags: tagItems
      };
      renderRoadmap(roadmap, evidenceNarrative, notYet);
      latestPayload = buildPayload(values, diagnosticOutput, roadmap);
      document.getElementById('payloadPreview').textContent = JSON.stringify(latestPayload, null, 2);

      // Prefill feedback email if available
      document.getElementById('feedbackEmail').value = values.recipientEmail || "";
      document.getElementById('feedbackOrg').value = values.organization || "";

      resultsPanel.classList.add('active');
      document.getElementById('sendStatus').textContent = "Status: roadmap generated — download now or connect delivery later";
      setSuccessState(true, "Roadmap generated", "Your roadmap is ready. Download it now, or send it after you connect your automation.");
      window.scrollTo({top: resultsPanel.offsetTop - 20, behavior: 'smooth'});
    });

   async function postJSON(url, payload){
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      data: JSON.stringify(payload)
    })
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.text().catch(() => "");
}
