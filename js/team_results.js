document.addEventListener("DOMContentLoaded", () => {
  const divisionOrder = [
    "Sr Boys",
    "Jr Boys",
    "Jr/Sr Girls",
    "Bant/Juv Girls",
    "Juv Boys",
    "Bant Boys"
  ];

  const divisionSection = document.getElementById("division-results");

  fetch("../data/team_results.json")
    .then((response) => response.json())
    .then((data) => {
      divisionOrder.forEach((division) => {
        const teams = (data[division] || [])
          .filter((team) => Number(team.Total) > 0)
          .sort((a, b) => Number(b.Total) - Number(a.Total));

        if (teams.length === 0) return;

        const section = document.createElement("section");
        section.classList.add("content-section");

        let html = `
          <h3>${division}</h3>
          <table class="result-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>School</th>
                <th>Race 1</th>
                <th>Race 2</th>
                <th>Race 3</th>
                <th>Race 4</th>
                <th>Race 5</th>
                <th>Race 6</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
        `;

        teams.forEach((team, index) => {
          html += `
            <tr>
              <td>${index + 1}</td>
              <td>${team.School ?? ""}</td>
              <td>${formatScore(team.Race1)}</td>
              <td>${formatScore(team.Race2)}</td>
              <td>${formatScore(team.Race3)}</td>
              <td>${formatScore(team.Race4)}</td>
              <td>${formatScore(team.Race5)}</td>
              <td>${formatScore(team.Race6)}</td>
              <td><strong>${formatScore(team.Total)}</strong></td>
            </tr>
          `;
        });

        html += `
            </tbody>
          </table>
        `;

        section.innerHTML = html;
        divisionSection.appendChild(section);
      });

      if (!divisionSection.innerHTML.trim()) {
        divisionSection.innerHTML = "<p>No team results available yet.</p>";
      }
    })
    .catch((error) => {
      console.error("Error loading team results data:", error);
      divisionSection.innerHTML = "<p>Failed to load team results data.</p>";
    });

  function formatScore(value) {
    if (value === null || value === undefined || value === "" || Number(value) === 0) {
      return "";
    }
    return value;
  }
});