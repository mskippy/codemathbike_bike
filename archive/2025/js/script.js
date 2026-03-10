document.addEventListener("DOMContentLoaded", function () {
    fetch('data/results.json')
      .then(res => res.json())
      .then(data => {
        const teamDiv = document.getElementById('team-results');
        const riderDiv = document.getElementById('rider-results');
  
        // Rider display labels mapped to JSON keys
        const riderDivisionMap = {
          "Sr Boys (Gr 11/12)": "Sr Boys",
          "Sr Girls (Gr 11/12)": "Sr Girls",
          "Jr Boys (Gr 10)": "Jr Boys",
          "Jr Girls (Gr 10)": "Jr Girls",
          "Juv Boys (Gr 9)": "Juv Boys",
          "Juv Girls (Gr 9)": "Juv Girls",
          "Bant Boys (Gr 8)": "Bant Boys",
          "Bant Girls (Gr 8)": "Bant Girls"
        };
  
        // Team display order (no mapping, use exact keys)
        const teamDivisionOrder = [
          "Sr Boys",
          "Jr Boys",
          "Jr/Sr Girls",
          "Bant/Juv Girls",
          "Juv Boys",
          "Bant Boys"
        ];
  
        // Render teams (flat order, no labels)
        teamDivisionOrder.forEach(division => {
          if (data.teams && data.teams[division]) {
            const div = document.createElement('div');
            div.classList.add('card');
            div.innerHTML = `<h3>${division}</h3>`;
  
            let teamTable = `<table class="result-table">
              <thead><tr><th>Rank</th><th>Team</th><th>Points</th></tr></thead>
              <tbody>`;
  
            data.teams[division].forEach((team, index) => {
              teamTable += `<tr><td>${index + 1}</td><td>${team.name}</td><td>${team.points}</td></tr>`;
            });
  
            teamTable += `</tbody></table>`;
            div.innerHTML += teamTable;
            teamDiv.appendChild(div);
          }
        });
  
        // Render riders (with label mapping)
        for (const label in riderDivisionMap) {
          const key = riderDivisionMap[label];
          if (data.riders && data.riders[key]) {
            const div = document.createElement('div');
            div.classList.add('card');
            div.innerHTML = `<h3>${label}</h3>`;
  
            let riderTable = `<table class="result-table">
              <thead><tr><th>Rank</th><th>Name (School)</th><th>Points</th></tr></thead>
              <tbody>`;
  
            data.riders[key].forEach((rider, index) => {
              riderTable += `<tr><td>${index + 1}</td><td>${rider.name} (${rider.school})</td><td>${rider.points}</td></tr>`;
            });
  
            riderTable += `</tbody></table>`;
            div.innerHTML += riderTable;
            riderDiv.appendChild(div);
          }
        }
      })
      .catch(err => {
        console.error("Error loading results:", err);
      });
  });
  