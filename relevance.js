// AETHRA - Website Relevance Checking

function checkWebsiteRelevance(pageTitle, pageURL, keywords) {

    // Convert website details into lowercase
    const title = pageTitle.toLowerCase();
    const url = pageURL.toLowerCase();

    // Check whether any keyword matches
    const isRelevant = keywords.some(keyword => {

        const word = keyword.toLowerCase();

        return title.includes(word) || url.includes(word);
    });

    if (isRelevant) {
        console.log("Relevant Website!");
        return true;
    } else {
        console.log("Unrelated Website!");
        return false;
    }
}