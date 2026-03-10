document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("division-select");
  const container = document.getElementById("division-results-container");

  // Fetch division data
  fetch("data/division_results.json")
    .then((res) => res.json())
    .then((data) => {
      const divisions = Object.keys(data).sort();

      // Populate dropdown
      divisions.forEach((division) => {
        const option = document.createElement("option");
        option.value = division;
        option.textContent = division;
        select.appendChild(option);
      });

      // When a division is selected
      select.addEventListener("change", () => {
        const selected = select.value;
        container.innerHTML = "";

        if (!selected || !data[selected]) return;

        const riders = [...data[selected]].sort((a, b) => b.points - a.points);

        let table = `<h3>${selected}</h3>
        <table class="result-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name (School)</th>
              <th>Plate</th>
              <th>R1</th><th>R2</th><th>R3</th>
              <th>R4</th><th>R5</th><th>R6</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>`;

        riders.forEach((r, index) => {
          const schoolText = r.school ? ` (${r.school})` : "";
          table += `<tr>
            <td>${index + 1}</td>
            <td>${r.name}${schoolText}</td>
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
        container.innerHTML = table;
      });
    })
    .catch((err) => {
      console.error("Failed to load division results:", err);
      container.innerHTML = "<p>Failed to load division results data.</p>";
    });

  function formatRace(place, pts) {
    if (!pts && !place) return "-";
    if (!pts) return `${place}`;
    return `${place ?? "-"} (${pts})`;
  }
});
