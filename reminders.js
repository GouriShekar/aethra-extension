// AETHRA - Check-in Reminder Module

async function startCheckInReminder() {

    const result = await chrome.storage.local.get("focusSession");

    if (!result.focusSession ||
        result.focusSession.status !== "active") {
        console.log("No active focus session.");
        return;
    }

    // Create a reminder every 5 minutes
    await chrome.alarms.create("focusCheckIn", {
        delayInMinutes: 5,
        periodInMinutes: 5
    });

    console.log("AETHRA Check-in Reminder Started!");
}