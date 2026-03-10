document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("school-select");
  const container = document.getElementById("school-results-container");

  fetch("data/school_results.json")
    .then((res) => res.json())
    .then((data) => {
      const schools = Object.keys(data).sort();

      // Populate dropdown
      schools.forEach((school) => {
        const option = document.createElement("option");
        option.value = school;
        option.textContent = school;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        const selected = select.value;
        container.innerHTML = "";

        if (!selected || !data[selected]) return;

        const riders = [...data[selected]];
        const divisions = ["Sr Boys", "Sr Girls", "Jr Boys", "Jr Girls", "Juv Boys", "Juv Girls", "Bant Boys", "Bant Girls"];

        // Group riders by division
        const grouped = {};
        riders.forEach((rider) => {
          if (!grouped[rider.division]) grouped[rider.division] = [];
          grouped[rider.division].push(rider);
        });

        // Sort divisions in desired order
        divisions.forEach((division) => {
          if (!grouped[division]) return;

          const ridersInDiv = grouped[division].sort((a, b) => b.points - a.points);

          let table = `<h3>${division}</h3>
          <table class="result-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Plate</th>
                <th>R1</th><th>R2</th><th>R3</th>
                <th>R4</th><th>R5</th><th>R6</th>
                <th>Total</th>
              </tr>
            </thead><tbody>`;

          ridersInDiv.forEach((r) => {
            table += `<tr>
              <td>${r.name}</td>
              <td>${r.plate}</td>
              <td>${formatRace(r["R1 Place"], r["R1 Pts"])}</td>
              <td>${formatRace(r["R2 Place"], r["R2 Pts"])}</td>
              <td>${formatRace(r["R3 Place"], r["R3 Pts"])}</td>
              <td>${formatRace(r["R4 Place"], r["R4 Pts"])}</td>
              <td>${formatRace(r["R5 Place"], r["R5 Pts"])}</td>
              <td>${formatRace(r["R6 Place"], r["R6 Pts"])}</td>
              <td><strong>${r.points ?? "-"}</strong></td>
            </tr>`;
          });

          table += "</tbody></table>";
          container.innerHTML += table;
        });
      });
    })
    .catch((err) => {
      console.error("Failed to load school results:", err);
      container.innerHTML = "<p>Failed to load school results data.</p>";
    });

  function formatRace(place, pts) {
    if (!pts && !place) return "-";
    if (!pts) return `${place}`;
    return `${place ?? "-"} (${pts})`;
  }
});
