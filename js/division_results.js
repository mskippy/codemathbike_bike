document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("division-select");
  const container = document.getElementById("division-results-container");

  const divisionOrder = [
    "Sr Boys",
    "Sr Girls",
    "Jr Boys",
    "Jr Girls",
    "Juv Boys",
    "Juv Girls",
    "Bant Boys",
    "Bant Girls"
  ];

  fetch("data/division_results.json")
    .then((res) => res.json())
    .then((data) => {
      // Populate dropdown in preferred order
      divisionOrder.forEach((division) => {
        if (!data[division]) return;

        const option = document.createElement("option");
        option.value = division;
        option.textContent = division;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        const selected = select.value;
        container.innerHTML = "";

        if (!selected || !data[selected]) return;

        const riders = [...data[selected]].sort((a, b) => {
          const aPts = Number(a.points) || 0;
          const bPts = Number(b.points) || 0;
          return bPts - aPts;
        });

        let table = `
          <h3>${selected}</h3>
          <table class="result-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>School</th>
                <th>Plate</th>
                <th>R1</th>
                <th>R2</th>
                <th>R3</th>
                <th>R4</th>
                <th>R5</th>
                <th>R6</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
        `;

        riders.forEach((r, index) => {
          table += `
            <tr>
              <td>${index + 1}</td>
              <td>${r.name || ""}</td>
              <td>${r.school || ""}</td>
              <td>${r.plate || ""}</td>
              <td>${formatRace(r["R1 Place"], r["R1 Pts"])}</td>
              <td>${formatRace(r["R2 Place"], r["R2 Pts"])}</td>
              <td>${formatRace(r["R3 Place"], r["R3 Pts"])}</td>
              <td>${formatRace(r["R4 Place"], r["R4 Pts"])}</td>
              <td>${formatRace(r["R5 Place"], r["R5 Pts"])}</td>
              <td>${formatRace(r["R6 Place"], r["R6 Pts"])}</td>
              <td><strong>${r.points ?? "-"}</strong></td>
            </tr>
          `;
        });

        table += `
            </tbody>
          </table>
        `;

        container.innerHTML = table;
      });
    })
    .catch((err) => {
      console.error("Failed to load division results:", err);
      container.innerHTML = "<p>Failed to load division results data.</p>";
    });

  function formatRace(place, pts) {
    const hasPlace = place !== "" && place !== null && place !== undefined;
    const hasPts = pts !== "" && pts !== null && pts !== undefined;

    if (!hasPlace && !hasPts) return "-";
    if (hasPlace && hasPts) return `${place} (${pts})`;
    if (hasPlace) return `${place}`;
    return `(${pts})`;
  }
});