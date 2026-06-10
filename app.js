const slots = [
    "Mon AM",
    "Mon PM",
    "Tue AM",
    "Tue PM",
    "Wed AM",
    "Wed PM",
    "Thu AM",
    "Thu PM"
  ];
  
  const data = {
    volunteers: [
      {
        id: 1,
        name: "Maya Chen",
        skills: ["Check-in", "Outreach"],
        availability: ["Mon AM", "Tue PM", "Wed PM", "Thu AM"]
      },
      {
        id: 2,
        name: "Jordan Patel",
        skills: ["Setup", "Cleanup"],
        availability: ["Mon PM", "Tue AM", "Wed AM", "Thu PM"]
      },
      {
        id: 3,
        name: "Sam Rivera",
        skills: ["Check-in", "Setup"],
        availability: ["Mon AM", "Tue AM", "Wed PM"]
      }
    ],
  
    events: [
      {
        id: 101,
        name: "Startup Night",
        date: "2026-06-18",
        location: "Innovation Hub",
        roles: ["Check-in", "Setup", "Cleanup"],
        shifts: [
          {
            id: 1001,
            slot: "Mon AM",
            role: "Setup",
            assignedTo: 2
          },
          {
            id: 1002,
            slot: "Mon PM",
            role: "Check-in",
            assignedTo: null
          },
          {
            id: 1003,
            slot: "Tue PM",
            role: "Cleanup",
            assignedTo: null
          }
        ]
      }
    ],
  
    requests: [
      {
        id: 201,
        from: 2,
        shiftId: 1001,
        desiredSlot: "Tue AM",
        status: "Pending"
      }
    ]
  };

  function allShifts() {
    return data.events.flatMap(function (event) {
      return event.shifts.map(function (shift) {
        return {
          ...shift,
          event: event
        };
      });
    });
  }

  function eventCoverage(event) {
    const assignedShifts = event.shifts.filter(function (shift) {
      return shift.assignedTo !== null;
    });
  
    return Math.round((assignedShifts.length / event.shifts.length) * 100);
  }



  function badgeClass(percent) {
    if (percent >= 80) {
      return "good";
    }
  
    if (percent >= 50) {
      return "warn";
    }
  
    return "danger";
  }



  function renderDashboard() {
    const shifts = allShifts();
  
    const assignedShifts = shifts.filter(function (shift) {
      return shift.assignedTo !== null;
    });
  
    const openShifts = shifts.filter(function (shift) {
      return shift.assignedTo === null;
    });
  
    const pendingRequests = data.requests.filter(function (request) {
      return request.status === "Pending";
    });
  
    const coverage =
      shifts.length === 0
        ? 0
        : Math.round((assignedShifts.length / shifts.length) * 100);
  
    document.getElementById("metricEvents").textContent = data.events.length;
    document.getElementById("metricOpenShifts").textContent = openShifts.length;
    document.getElementById("metricCoverage").textContent = `${coverage}%`;
    document.getElementById("metricPendingSwaps").textContent =
      pendingRequests.length;
  
    const coverageList = document.getElementById("coverageList");
  
    coverageList.innerHTML = data.events
      .map(function (event) {
        const percent = eventCoverage(event);
  
        return `
          <article class="coverage-item">
            <div class="coverage-top">
              <div>
                <strong>${event.name}</strong>
                <div class="muted">${event.date} - ${event.location}</div>
              </div>
  
              <span class="badge ${badgeClass(percent)}">
                ${percent}% covered
              </span>
            </div>
  
            <div class="progress-track">
              <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
          </article>
        `;
      })
      .join("");
  }
  

  function renderEvents() {
    const eventsTable = document.getElementById("eventsTable");
  
    eventsTable.innerHTML = data.events
      .map(function (event) {
        const percent = eventCoverage(event);
  
        return `
          <tr>
            <td><strong>${event.name}</strong></td>
            <td>${event.date}</td>
            <td>${event.location}</td>
            <td>${event.roles.join(", ")}</td>
            <td>
              <span class="badge ${badgeClass(percent)}">
                ${percent}%
              </span>
            </td>
          </tr>
        `;
      })
      .join("");
  }


  function addSampleEvent() {
    const eventId = Date.now();
  
    const newEvent = {
      id: eventId,
      name: "Peer Resume Review",
      date: "2026-07-02",
      location: "Engineering Lounge",
      roles: ["Check-in", "Outreach", "Setup", "Cleanup"],
      shifts: [
        {
          id: eventId + 1,
          slot: "Tue AM",
          role: "Check-in",
          assignedTo: null
        },
        {
          id: eventId + 2,
          slot: "Tue PM",
          role: "Outreach",
          assignedTo: null
        },
        {
          id: eventId + 3,
          slot: "Wed AM",
          role: "Setup",
          assignedTo: null
        },
        {
          id: eventId + 4,
          slot: "Wed PM",
          role: "Cleanup",
          assignedTo: null
        }
      ]
    };
  
    data.events.push(newEvent);
  
    renderDashboard();
    renderEvents();
  }


  console.log(data);


//   data.volunteers.forEach(function (volunteer) {
//   const listItem = document.createElement("li");
//   listItem.textContent = `${volunteer.name} - ${volunteer.skills.join(", ")}`;
//   volunteerList.appendChild(listItem);
// });

const viewTitles = {
    dashboard: "Dashboard",
    events: "Events",
    volunteers: "Volunteers",
    schedule: "Schedule",
    requests: "Requests"
  };
  
  const navButtons = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".view");
  const viewTitle = document.getElementById("viewTitle");
  
  navButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const viewName = button.dataset.view;
  
      navButtons.forEach(function (navButton) {
        navButton.classList.remove("active");
      });
  
      button.classList.add("active");
  
      views.forEach(function (view) {
        view.classList.remove("active");
      });
  
      document.getElementById(`${viewName}-view`).classList.add("active");
  
      viewTitle.textContent = viewTitles[viewName];
    });
  });


  function renderVolunteers() {
    const volunteerList = document.getElementById("volunteerList");
  
    volunteerList.innerHTML = data.volunteers
      .map(function (volunteer) {
        return `
          <article class="volunteer-card">
            <div class="volunteer-card-header">
              <h4>${volunteer.name}</h4>
              <span class="badge good">
                ${volunteer.availability.length} slots
              </span>
            </div>
  
            <div class="card-label">Skills</div>
            <div class="skill-list">
              ${volunteer.skills
                .map(function (skill) {
                  return `<span class="skill-pill">${skill}</span>`;
                })
                .join("")}
            </div>
  
            <div class="card-label">Availability</div>
            <div class="availability-list">
              ${volunteer.availability
                .map(function (slot) {
                  return `<span class="availability-pill">${slot}</span>`;
                })
                .join("")}
            </div>
          </article>
        `;
      })
      .join("");
  }

  const addSampleEventButton = document.getElementById("addSampleEventButton");

  addSampleEventButton.addEventListener("click", function () {
    addSampleEvent();
  });

//   render all the data
  renderDashboard();
  renderEvents();
  renderVolunteers();