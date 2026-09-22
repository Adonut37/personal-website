let editingEventIndex = null;

function updateLocationOptions() {

    // Get the selected modality
    const modality = document.getElementById("event_modality").value;

    // Get the two containers
    const locationContainer = document.getElementById("location_container");
    const remoteContainer = document.getElementById("remote_url_container");

    // Get the actual input fields
    const locationInput = document.getElementById("event_location");
    const remoteInput = document.getElementById("event_remote_url");

    if (modality === "in-person") {

        locationContainer.style.display = "block";
        remoteContainer.style.display = "none";

        locationInput.required = true;
        remoteInput.required = false;

    } else if (modality === "remote") {

        locationContainer.style.display = "none";
        remoteContainer.style.display = "block";

        locationInput.required = false;
        remoteInput.required = true;
    }
}

const events = [];
function saveEvent() {
    const form = document.getElementById("event_form");

    // Don't save if the form is invalid
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Read the form values
    const name = document.getElementById("event_name").value;
    const weekday = document.getElementById("event_weekday").value;
    const time = document.getElementById("event_time").value;
    const modality = document.getElementById("event_modality").value;
    const attendees = document.getElementById("event_attendees").value;
    const category = document.getElementById("event_category").value;

    // Only save the location type that applies
    const location =
        modality === "in-person"
            ? document.getElementById("event_location").value
            : null;

    const remote_url =
        modality === "remote"
            ? document.getElementById("event_remote_url").value
            : null;

    // Create the event object
    const eventDetails = {
        name: name,
        weekday: weekday,
        time: time,
        modality: modality,
        location: location,
        remote_url: remote_url,
        attendees: attendees,
        category: category
    };

    // If we are creating a new event
    if (editingEventIndex === null) {
        events.push(eventDetails);
        addEventToCalendarUI(eventDetails);
    }

    // If we are editing an existing event
    else {
        events[editingEventIndex] = eventDetails;
        refreshCalendar();
        editingEventIndex = null;
    }

    console.log(events);

    // Clear the form
    form.reset();

    // Close the modal
    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.hide();
}

function addEventToCalendarUI(eventDetails) {

    // Find the correct weekday column
    const dayColumn = document.getElementById(eventDetails.weekday);

    // Create a new event card
    const eventCard = document.createElement("div");
    eventCard.className = "card mb-2";
    eventCard.style.cursor = "pointer";

    // Decide whether to show location or remote URL
    let locationInfo;

    if (eventDetails.modality === "in-person") {
        locationInfo = eventDetails.location;
    } else {
        locationInfo = eventDetails.remote_url;
    }

    // Color the card based on category
    if (eventDetails.category === "academic") {
        eventCard.classList.add("bg-primary", "text-white");
    }
    else if (eventDetails.category === "work") {
        eventCard.classList.add("bg-warning", "text-dark");
    }
    else if (eventDetails.category === "personal") {
        eventCard.classList.add("bg-success", "text-white");
    }
    else if (eventDetails.category === "social") {
        eventCard.classList.add("bg-info", "text-dark");
    }

    // Fill the card with event information
    eventCard.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${eventDetails.name}</h5>
            <p class="card-text">
                Time: ${eventDetails.time}<br>
                Category: ${eventDetails.category}<br>
                Modality: ${eventDetails.modality}<br>
                Location/URL: ${locationInfo}<br>
                Attendees: ${eventDetails.attendees}
            </p>
        </div>
    `;

    // Clicking the card opens it for editing
    eventCard.addEventListener("click", function () {

        editingEventIndex = events.indexOf(eventDetails);

        document.getElementById("event_name").value = eventDetails.name;
        document.getElementById("event_weekday").value = eventDetails.weekday;
        document.getElementById("event_time").value = eventDetails.time;
        document.getElementById("event_modality").value = eventDetails.modality;
        document.getElementById("event_attendees").value = eventDetails.attendees;
        document.getElementById("event_category").value = eventDetails.category;

        if (eventDetails.modality === "in-person") {
            document.getElementById("event_location").value = eventDetails.location;
            document.getElementById("event_remote_url").value = "";
        }
        else {
            document.getElementById("event_remote_url").value = eventDetails.remote_url;
            document.getElementById("event_location").value = "";
        }

        updateLocationOptions();

        const modalElement = document.getElementById("event_modal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    });

    // Add the card to the correct weekday
    dayColumn.appendChild(eventCard);
}

function refreshCalendar() {

    const weekdays = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];

    weekdays.forEach(function(day) {
        const dayColumn = document.getElementById(day);
        const cards = dayColumn.querySelectorAll(".card");

        cards.forEach(function(card) {
            card.remove();
        });
    });

    events.forEach(function(eventDetails) {
        addEventToCalendarUI(eventDetails);
    });
}