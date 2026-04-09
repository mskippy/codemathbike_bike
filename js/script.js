document.addEventListener("DOMContentLoaded", function () {
  fetch("../data/results.json")
    .then((res) => res.json())
    .then((data) => {
      const teamDiv = document.getElementById("team-results");

if (teamDiv && data.teams) {
  teamDiv.innerHTML = "";

  const teamDivisionOrder = [
    "Sr Boys",
    "Jr Boys",
    "Jr/Sr Girls",
    "Bant/Juv Girls",
    "Juv Boys",
    "Bant Boys"
  ];

  teamDivisionOrder.forEach((division) => {
    const teams = Array.isArray(data.teams[division]) ? [...data.teams[division]] : [];
    if (teams.length === 0) return;

    const card = document.createElement("div");
    card.className = "card results-card";

    let html = `<h3>${division}</h3>`;
    html += `
      <table class="result-table compact-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
    `;

    teams.forEach((team, index) => {
      html += `
        <tr>
          <td>${index + 1}</td>
          <td>${team.name ?? ""}</td>
          <td>${team.points ?? ""}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    card.innerHTML = html;
    teamDiv.appendChild(card);
  });
}

      const riderDiv = document.getElementById("rider-results");
      if (!riderDiv || !data.riders) return;

      riderDiv.innerHTML = "";

      const riderDivisionMap = [
        ["Sr Boys (Gr 11/12)", "Sr Boys"],
        ["Sr Girls (Gr 11/12)", "Sr Girls"],
        ["Jr Boys (Gr 10)", "Jr Boys"],
        ["Jr Girls (Gr 10)", "Jr Girls"],
        ["Juv Boys (Gr 9)", "Juv Boys"],
        ["Juv Girls (Gr 9)", "Juv Girls"],
        ["Bant Boys (Gr 8)", "Bant Boys"],
        ["Bant Girls (Gr 8)", "Bant Girls"]
      ];

      riderDivisionMap.forEach(([label, key]) => {
        const riders = Array.isArray(data.riders[key]) ? [...data.riders[key]] : [];
        if (riders.length === 0) return;

        riders.sort((a, b) => Number(b.points ?? 0) - Number(a.points ?? 0));
        const topThree = riders.slice(0, 3);

        const card = document.createElement("div");
        card.className = "card results-card";

        let html = `<h3>${label}</h3>`;
        html += `
          <table class="result-table compact-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>School</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
        `;

        topThree.forEach((rider, index) => {
          html += `
            <tr>
              <td>${index + 1}</td>
              <td>${rider.name ?? ""}</td>
              <td>${rider.school ?? ""}</td>
              <td>${rider.points ?? ""}</td>
            </tr>
          `;
        });

        html += `</tbody></table>`;
        card.innerHTML = html;
        riderDiv.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Error loading results:", err);
    });
});