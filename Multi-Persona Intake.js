// Step 1: Collect Lekhana -From Soil to Strategy. intake from environment variables and save to context synchronously.
;(async () => {
  try {
    const user_role = process.env.USER_ROLE || ""
    setContext("user_role", user_role)

    const user_name = process.env.USER_NAME || ""
    setContext("user_name", user_name)

    const user_location = process.env.USER_LOCATION || ""
    setContext("user_location", user_location)

    const crop_type = process.env.CROP_TYPE || ""
    setContext("crop_type", crop_type)

    const issue_description = process.env.ISSUE_DESCRIPTION || ""
    setContext("issue_description", issue_description)

    const contact_email = process.env.CONTACT_EMAIL || ""
    setContext("contact_email", contact_email)

    console.log("Intake loaded from environment variables and saved to context.")
  } catch (err) {
    console.error("Error in intake env step", err)
    // Optionally fallback report or context value
  }
})()
