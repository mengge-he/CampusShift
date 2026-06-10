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
  
  console.log(data);

  const volunteerList = document.getElementById("volunteerList");

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

  renderDashboard();
  
  data.volunteers.forEach(function (volunteer) {
    const listItem = document.createElement("li");
    listItem.textContent = `${volunteer.name} - ${volunteer.skills.join(", ")}`;
    volunteerList.appendChild(listItem);
  });

