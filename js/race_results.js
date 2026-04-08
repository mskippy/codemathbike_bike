document.addEventListener("DOMContentLoaded", () => {
  const raceSelect = document.getElementById("race-select");
  const container = document.getElementById("race-results-container");
  const pageLinks = document.getElementById("race-page-links");

  fetch("../data/race_results.json")
    .then((response) => response.json())
    .then((data) => {
      Object.keys(data).forEach((raceKey) => {
        const option = document.createElement("option");
        option.value = raceKey;
        option.textContent = data[raceKey].race_name || raceKey;
        raceSelect.appendChild(option);
      });

      raceSelect.addEventListener("change", () => {
        const selectedRace = raceSelect.value;
        container.innerHTML = "";
        if (pageLinks) pageLinks.style.display = "none";

        if (!selectedRace || !data[selectedRace]) return;

        const raceData = data[selectedRace];

        const title = document.createElement("h3");
        title.textContent = raceData.race_name || selectedRace;
        container.appendChild(title);

        const boysSection = createTableSection("boys-results", "Boys Divisions", raceData.boys);
        const girlsSection = createTableSection("girls-results", "Girls Divisions", raceData.girls);

        container.appendChild(boysSection);
        container.appendChild(girlsSection);

        if (pageLinks) pageLinks.style.display = "block";
      });
    })
    .catch((error) => {
      console.error("Error loading race results:", error);
      container.innerHTML = "<p>Unable to load race results at this time.</p>";
    });

  function createTableSection(sectionId, title, divisions) {
    const section = document.createElement("section");
    section.id = sectionId;

    const heading = document.createElement("h3");
    heading.textContent = title;
    section.appendChild(heading);

    const table = document.createElement("table");
    table.classList.add("result-table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const rankTh = document.createElement("th");
    rankTh.textContent = "Rank";
    headerRow.appendChild(rankTh);

    const divisionKeys = Object.keys(divisions || {});
    divisionKeys.forEach((division) => {
      const th = document.createElement("th");
      th.textContent = division;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const maxRows = Math.max(0, ...divisionKeys.map((div) => (divisions[div] || []).length));

    for (let i = 0; i < maxRows; i++) {
      const row = document.createElement("tr");

      const rankCell = document.createElement("td");
      rankCell.textContent = i + 1;
      row.appendChild(rankCell);

      divisionKeys.forEach((division) => {
        const td = document.createElement("td");
        const rider = divisions[division][i];

        if (rider) {
          td.innerHTML = `${rider.name}<br><span class="school-name">${rider.school || ""}</span>`;
        } else {
          td.innerHTML = "";
        }

        row.appendChild(td);
      });

      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    section.appendChild(table);
    return section;
  }
});