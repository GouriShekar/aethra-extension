
// Load the Focus Management module
importScripts("focus.js", "relevance.js", "reminders.js");

console.log("AETHRA Extension Started!");

// Extension installation event
chrome.runtime.onInstalled.addListener(() => {
    console.log("AETHRA Extension Installed Successfully!");
});

// Listen for focus session requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "START_FOCUS_SESSION") {

        startFocusSession(
            message.task,
            message.topic,
            message.keywords,
            message.duration
        )
        .then(() => {
            sendResponse({ success: true });
        })
        .catch((error) => {
            sendResponse({
                success: false,
                error: error.message
            });
        });

        return true;
    }
});
// Listen for focus timer completion
chrome.alarms.onAlarm.addListener(async (alarm) => {

    if (alarm.name === "focusSessionEnd") {

        const result = await chrome.storage.local.get("focusSession");

        if (result.focusSession) {

            const updatedSession = {
                ...result.focusSession,
                status: "completed",
                endTime: Date.now()
            };

            await chrome.storage.local.set({
                focusSession: updatedSession
            });

            console.log("AETHRA Focus Session Completed!");
        }
    }
});
// Check and track the active website
async function checkCurrentWebsite() {

    const tabs = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    });

    if (tabs.length === 0) return;

    const tab = tabs[0];

    const result = await chrome.storage.local.get("focusSession");

    if (!result.focusSession ||
        result.focusSession.status !== "active") {
        return;
    }

    const session = result.focusSession;

    const isRelevant = checkWebsiteRelevance(
        tab.title || "",
        tab.url || "",
        session.keywords
    );

    const updatedSession = {
        ...session,
        relevantVisits: session.relevantVisits || 0,
        unrelatedVisits: session.unrelatedVisits || 0
    };

    if (isRelevant) {
        updatedSession.relevantVisits++;
    } else {
        updatedSession.unrelatedVisits++;
    }

    await chrome.storage.local.set({
        focusSession: updatedSession
    });

    console.log("Website:", tab.title);
    console.log("Relevant Visits:", updatedSession.relevantVisits);
    console.log("Unrelated Visits:", updatedSession.unrelatedVisits);
}

// Check website whenever the user switches tabs
chrome.tabs.onActivated.addListener(() => {
    checkCurrentWebsite();
});

// Check website when the current tab finishes loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status === "complete" && tab.active) {
        checkCurrentWebsite();
    }

});
// Listen for check-in reminder alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {

    if (alarm.name === "focusCheckIn") {

        const result = await chrome.storage.local.get("focusSession");

        if (result.focusSession &&
            result.focusSession.status === "active") {

            chrome.notifications.create("focusReminder", {
                type: "basic",
                iconUrl: "icon.png",
                title: "AETHRA Focus Check-in",
                message: "Are you still focused on your task?",
                priority: 2
            });

            console.log("AETHRA Check-in Reminder Sent!");
        }
    }
});