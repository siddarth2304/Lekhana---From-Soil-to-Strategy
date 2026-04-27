// Step 2: Use Gemini 1.5 Pro (via TurboticOpenAI) for predictive intelligence and robustly save output
;(async () => {
  try {
    // Read all expected intake variables from context (populated by previous env-intake step)
    const user_role = getContext("user_role")
    const user_name = getContext("user_name")
    const user_location = getContext("user_location")
    const crop_type = getContext("crop_type")
    const issue_description = getContext("issue_description")
    const contact_email = getContext("contact_email")

    const prompt = `You are a Decision-Grade Agri-Analyst. Analyze the provided situation and output your findings in a structured format that the system can parse into individual context keys.\nCRITICAL: Your response must follow this exact structure so the system can set context keys correctly:\n\n[risk_score]: (A number between 0-100)\n[risk_level]: (CRITICAL / HIGH / MEDIUM / LOW)\n[intel_report]: (The full detailed analysis including Situation, Actions, and ROI)\n\n--- ANALYSIS START ---\nUser Type: ${user_role}\nLocation: ${user_location}\nCrop: ${crop_type}\nIssue: ${issue_description}\n--- ANALYSIS END ---`

    // Use Gemini via TurboticOpenAI
    const result = await TurboticOpenAI([{ role: "system", content: prompt }], {
      model: "gemini-1.5-pro",
      temperature: 0
    })

    // Save raw output as intel_report
    const intel_report = result.content || ""
    setContext("intel_report", intel_report)

    // Attempt to extract risk_score (0-100) and risk_level from LLM output
    let risk_score = 0
    let risk_level = "Low"
    if (intel_report) {
      // Now expect strictly bracketed output as per pattern
      const riskScoreMatch = intel_report.match(/\[risk_score\]\s*:\s*(\d{1,3})/i)
      if (riskScoreMatch && !isNaN(Number(riskScoreMatch[1]))) {
        risk_score = Number(riskScoreMatch[1])
      }
      const riskLevelMatch = intel_report.match(/\[risk_level\]\s*:\s*(Critical|High|Medium|Low)/i)
      if (riskLevelMatch) {
        risk_level = riskLevelMatch[1]
      } else {
        // Fallback: Derive from score if not textual
        if (risk_score >= 85) risk_level = "Critical"
        else if (risk_score >= 65) risk_level = "High"
        else if (risk_score >= 35) risk_level = "Medium"
      }
    }
    setContext("risk_score", risk_score)
    setContext("risk_level", risk_level)

    // Final log
    console.log("🧠 Intelligence Analysis Complete. Context Keys Set: risk_score, risk_level.")
  } catch (err) {
    setContext("intel_report", "Fallback Report: Gemini predictive analysis failed.")
    setContext("risk_score", 0)
    setContext("risk_level", "Low")
    console.error("Fallback Report: Gemini predictive analysis failed.", err)
  }
})()
