// Step 4: Send reporting email via Outlook connector, fallback if failed
;(async () => {
  try {
    const contact_email = getContext("contact_email")
    const user_name = getContext("user_name")
    const crop_type = getContext("crop_type")
    const user_location = getContext("user_location")
    const risk_score = getContext("risk_score")
    const risk_level = getContext("risk_level")
    const intel_report = getContext("intel_report")

    const subject = `🔴 [${risk_level}] Lekhana -From Soil to Strategy. - ${crop_type} | ${user_location}`
    const body = `Dear ${user_name},\n\nLekhana -From Soil to Strategy. has detected a supply chain signal.\n\nRISK SCORE: ${risk_score}/100\n\nINTEL:\n${intel_report}\n\nGenerated autonomously via Lekhana -From Soil to Strategy. on Turbotic.`

    await sendEmailViaTurbotic({
      to: contact_email,
      subject: subject,
      text: body
    })
    console.log(`✅ Executive Dispatch: Delivered to ${contact_email}.`)
  } catch (err) {
    console.error("Fallback Report: Outlook executive reporting failed.", err)
  }
})()
