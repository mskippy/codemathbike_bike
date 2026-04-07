document.addEventListener("DOMContentLoaded", function () {
  fetch("../data/results.json")
    .then(res => res.json())
    .then(data => {
      const riderDiv = document.getElementById("rider-results");

      if (!riderDiv || !data.riders) return;

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

      for (const label in riderDivisionMap) {
        const key = riderDivisionMap[label];
        if (data.riders[key]) {
          const div = document.createElement("div");
          div.classList.add("card");
          div.innerHTML = `<h3>${label}</h3>`;

          let riderTable = `<table class="result-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>School</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>`;

          data.riders[key].slice(0, 3).forEach((rider, index) => {
            riderTable += `
              <tr>
                <td>${index + 1}</td>
                <td>${rider.name}</td>
                <td>${rider.school}</td>
                <td>${rider.points}</td>
              </tr>`;
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