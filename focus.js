
// AETHRA - Focus Management Module

async function startFocusSession(task, topic, keywords, duration) {

    if (!task || !topic || !keywords || !duration || duration <= 0) {
        console.log("Please provide valid focus details.");
        return;
    }

    const session = {
        task: task,
        topic: topic,
        keywords: keywords,
        duration: duration,
        startTime: Date.now(),
        status: "active"
    };

    // Save session details
    await chrome.storage.local.set({
        focusSession: session
    });
    // Start check-in reminders
    await startCheckInReminder();

    // Create focus timer
    await chrome.alarms.create("focusSessionEnd", {
        delayInMinutes: duration
    });

    console.log("AETHRA Focus Session Started!");
    console.log("Task:", task);
    console.log("Focus Duration:", duration, "minutes");
}
