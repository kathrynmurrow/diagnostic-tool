Publish this whole folder together.

Use index.html as the site entry point.

Files required in same folder:
- index.html
- tool.html
- mvp-spec.html
- public-workflow.html

What this version now does:
- Generates the diagnostic
- Builds an on-screen 30-60-90 roadmap
- Embeds coaching questions and tips inside each roadmap phase
- Lets the user download the roadmap before sending it
- Packages the diagnostic + roadmap into a webhook-ready payload

Before going live:
1. Open tool.html
2. Add your ROADMAP_WEBHOOK_URL
3. Add your FEEDBACK_WEBHOOK_URL
4. Test the download button
5. Test the roadmap-send button with consent checked
6. Test the feedback form
7. Review privacy / consent language for your public audience


Public-sharing notes:
- Safe to share publicly as a prototype before your automation is live.
- Keep language honest: this is a directional diagnostic, not a formal assessment.
- Do not promise email delivery until ROADMAP_WEBHOOK_URL is connected.
- Finalize your privacy and consent language before turning on live email sending.
