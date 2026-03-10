document.addEventListener('DOMContentLoaded', function () {
  fetch('data/team_results.json')
    .then(response => response.json())
    .then(data => {
      const divisionOrder = [
        'Sr Boys',
        'Jr Boys',
        'Jr/Sr Girls',
        'Bant/Juv Girls',
        'Juv Boys',
        'Bant Boys'
      ];

      const divisionSection = document.getElementById('division-results');

      divisionOrder.forEach(division => {
        const teams = (data[division] || []).filter(team =>
          team.Total !== null && team.Total !== 0 && !isNaN(team.Total)
        );

        if (teams.length === 0) return;

        // Card wrapper for consistent layout
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `<h3>${division}</h3>`;

        // Build the table
        let table = `<table class="result-table">
          <thead>
            <tr>
              <th>Rank</th><th>School</th>
              <th>Race 1</th><th>Race 2</th><th>Race 3</th>
              <th>Race 4</th><th>Race 5</th><th>Race 6</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>`;

        teams.forEach((team, index) => {
          table += `<tr>
            <td>${index + 1}</td>
            <td>${team.School}</td>
            <td>${team.Race1 || ""}</td>
            <td>${team.Race2 || ""}</td>
            <td>${team.Race3 || ""}</td>
            <td>${team.Race4 || ""}</td>
            <td>${team.Race5 || ""}</td>
            <td>${team.Race6 || ""}</td>
            <td><strong>${team.Total}</strong></td>
          </tr>`;
        });

        table += "</tbody></table>";
        div.innerHTML += table;
        divisionSection.appendChild(div);
      });
    })
    .catch(error => {
      console.error('Error loading team results data:', error);
    });
});
