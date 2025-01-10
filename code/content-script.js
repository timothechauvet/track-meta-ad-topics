// content-script.js

// Function to handle span click
function handleSpanClick(event) {
    const span = event.target;
    const source = window.location.hostname.includes("website1") ? "website1" : "website2";

    // Extract strings from the span or its context
    const data = extractDataFromSpan(span);

    // Send data to background script
    browser.runtime.sendMessage({
        action: "collectData",
        payload: { source, data }
    }).then(response => {
        if (response.status === "success") {
            // Optionally, show a notification or visual cue
            showFeedback();
        }
    });
}


// Function to extract data (customize based on website structure)
function extractDataFromSpan(span) {
    // Example: Get text content
    if (source === "website1") {
        // Extraction logic for website1
        return extractWebsite1Data(span);
    } else {
        // Extraction logic for website2
        return extractWebsite2Data(span);
    }
}

function extractWebsite1Data(span) {
    // Example: Extract data based on website1's structure
    return span.getAttribute("data-item").split(",").map(item => item.trim());
}

function extractWebsite2Data(span) {
    // Example: Extract data based on website2's structure
    return span.textContent.split(" | ").map(item => item.trim());
}

function showFeedback() {
    // Create a temporary tooltip or highlight the span
    span.style.backgroundColor = "yellow";
    setTimeout(() => {
        span.style.backgroundColor = "";
    }, 1000);
}

// Attach event listener to span elements
document.addEventListener("click", event => {
    if (event.target.tagName.toLowerCase() === "span" && isTargetSpan(event.target)) {
        handleSpanClick(event);
    }
});

// Function to determine if a span is a target
function isTargetSpan(span) {
    // Define criteria to identify target spans, e.g., specific class or attribute
    return span.classList.contains("target-span");
}
