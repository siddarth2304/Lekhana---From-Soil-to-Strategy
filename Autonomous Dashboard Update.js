// Step 3: Append result to Google Sheets via SERVICE_ACCOUNT_JSON, robust fallback handling
;(async () => {
  const { google } = require("googleapis")
  try {
    const user_role = getContext("user_role")
    const user_name = getContext("user_name")
    const user_location = getContext("user_location")
    const crop_type = getContext("crop_type")
    const risk_score = getContext("risk_score")
    const intel_report = getContext("intel_report")
    const spreadsheetId = process.env.TARGET_SPREADSHEET_ID
    const serviceAccountJSON = process.env.SERVICE_ACCOUNT_JSON

    if (!spreadsheetId || !serviceAccountJSON) throw new Error("Google Sheets credentials/env vars missing")

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountJSON),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    })
    const sheets = google.sheets({ version: "v4", auth })
    const now = new Date().toISOString()

    const row = [now, user_name, user_role, user_location, crop_type, risk_score, intel_report]
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:A",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] }
    })

    console.log("✅ Live Dashboard Sync: Successful.")
  } catch (err) {
    console.error("Fallback Report: Google Sheets dashboard update failed.", err)
  }
})()
