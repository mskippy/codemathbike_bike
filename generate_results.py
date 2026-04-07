import openpyxl
import pandas as pd
import json
import sys

# Ensure UTF-8 encoding for console output
sys.stdout.reconfigure(encoding='utf-8')

# === CONFIG ===
EXCEL_FILE = "results_2026_master.xlsx"
TEAM_RESULTS_FILE = "data/team_results.json"  # Export path for team results


# Load TeamPoints sheet with specific columns A to I (0 to 8) and use the first 101 rows (A1:I101)
df_teams = pd.read_excel(EXCEL_FILE, sheet_name="TeamPoints", header=0, usecols="A:I", nrows=101)

# Clean up column names: Remove leading/trailing spaces and ensure they are strings
df_teams.columns = df_teams.columns.astype(str).str.strip()

# Debug: Print out the first 10 rows to inspect the data
print(df_teams.head(10))

# Force 'Division' and 'School' columns to be strings (to handle potential formatting issues)
df_teams['Division'] = df_teams['Division'].astype(str).str.strip()
df_teams['School'] = df_teams['School'].astype(str).str.strip()

# Ensure 'Division' column exists
if 'Division' not in df_teams.columns:
    raise ValueError("Column 'Division' is missing in the TeamPoints sheet")

# === CLEAN TEAM DATA ===
# Select columns 0 (Division), 1 (School), and 8 (Total), with Race columns 2-7
left = df_teams.iloc[:, [0, 1, 8]]  # Left table (Division, School, Total)
left.columns = ['Division', 'School', 'Total']

# Organize top 3 teams per division
teams_output = {}
for division in df_teams['Division'].unique():
    top3 = (
        df_teams[df_teams['Division'] == division]
        .sort_values(by='Total', ascending=False)
        .head(3)
        .rename(columns={'School': 'name', 'Total': 'points'})
        [['name', 'points']].reset_index(drop=True)
    )
    teams_output[division] = top3.to_dict(orient='records')

# === FULL TEAM RESULTS EXPORT (for team_results page) ===
full_teams_output = {}
division_order = [
    "Sr Boys",
    "Jr Boys",
    "Jr/Sr Girls",
    "Bant/Juv Girls",
    "Juv Boys",
    "Bant Boys"
]

for division in division_order:
    division_df = df_teams[df_teams["Division"] == division].copy()
    division_df = division_df.dropna(subset=["Total"])
    division_df = division_df[division_df["Total"] > 0]
    division_df = division_df.sort_values(by="Total", ascending=False)
    division_df = division_df.fillna("")  # <- This line ensures NaN is removed before exporting

    teams = []
        # Replace NaNs in the race columns before exporting
    division_df = division_df.fillna("")

    for _, row in division_df.iterrows():
        team_data = {
            "School": row["School"],
            "Race1": row["Race 1"],
            "Race2": row["Race 2"],
            "Race3": row["Race 3"],
            "Race4": row["Race 4"],
            "Race5": row["Race 5"],
            "Race6": row["Race 6"],
            "Total": row["Total"]
        }
        teams.append(team_data)


    full_teams_output[division] = teams

# Export full team results to team_results.json
with open("data/team_results.json", "w") as f:
    json.dump(full_teams_output, f, indent=2)

print("✅ team_results.json created at: data/team_results.json")


# === EXPORT TEAM RESULTS TO JSON ===
# with open(TEAM_RESULTS_FILE, "w") as f:
#    json.dump(teams_output, f, indent=2)

#print(f"✅ team_results.json created at: {TEAM_RESULTS_FILE}")


# === CLEAN RIDERS DATA ===
df_individual = pd.read_excel(EXCEL_FILE, sheet_name="Individual Results")
df_individual['Top 5'] = pd.to_numeric(df_individual['Top 5'], errors='coerce')
OUTPUT_FILE = "data/results.json"

riders_output = {}
for division in df_individual['Division'].dropna().unique():
    top5 = (
        df_individual[df_individual['Division'] == division]
        .sort_values(by='Top 5', ascending=False)
        .head(5)
        .rename(columns={'Student Name': 'name', 'School': 'school', 'Top 5': 'points'})
        [['name', 'school', 'points']].reset_index(drop=True)
    )
    riders_output[division] = top5.to_dict(orient='records')

# === EXPORT TO JSON ===
results_json = {
    "teams": teams_output,
    "riders": riders_output
}

with open(OUTPUT_FILE, "w") as f:
    json.dump(results_json, f, indent=2)

print("✅ results.json created at:", OUTPUT_FILE)


# === EXPORT DIVISION RESULTS ===
division_data = {}

# Clean up NaN and convert Top 5 to numeric for sorting
df_individual['Top 5'] = pd.to_numeric(df_individual['Top 5'], errors='coerce')
df_individual = df_individual.fillna("")  # Replace all NaNs with empty strings

for division in df_individual['Division'].unique():
    if not division:
        continue

    div_df = df_individual[df_individual['Division'] == division].copy()
    div_df = div_df.sort_values(by='Top 5', ascending=False).reset_index(drop=True)



    riders = []
    for _, row in div_df.iterrows():
        rider = {
            "name": row.get("Student Name", ""),
            "school": row.get("School", ""),
            "plate": row.get("Plate #", ""),
            "R1 Place": row.get("R1 Place", ""),
            "R1 Pts": row.get("R1 Pts", ""),
            "R2 Place": row.get("R2 Place", ""),
            "R2 Pts": row.get("R2 Pts", ""),
            "R3 Place": row.get("R3 Place", ""),
            "R3 Pts": row.get("R3 Pts", ""),
            "R4 Place": row.get("R4 Place", ""),
            "R4 Pts": row.get("R4 Pts", ""),
            "R5 Place": row.get("R5 Place", ""),
            "R5 Pts": row.get("R5 Pts", ""),
            "R6 Place": row.get("R6 Place", ""),
            "R6 Pts": row.get("R6 Pts", ""),
            "points": row.get("Top 5", "")
        }
        riders.append(rider)

    division_data[division] = riders

# Save to file
with open("data/division_results.json", "w") as f:
    json.dump(division_data, f, indent=2)

print("✅ division_results.json created at: data/division_results.json")


# === EXPORT SCHOOL RESULTS ===
school_data = {}

# Group by division first
for division in df_individual['Division'].dropna().unique():
    div_df = df_individual[df_individual['Division'] == division].copy()
    div_df['Top 5'] = pd.to_numeric(div_df['Top 5'], errors='coerce')

    # Replace NaN in all relevant fields with empty strings to make it JSON safe
    div_df = div_df.fillna("")

    div_df = div_df.sort_values(by='Top 5', ascending=False).reset_index(drop=True)

    for _, row in div_df.iterrows():
        school = row['School']
        if not school:
            continue

        if school not in school_data:
            school_data[school] = []

        school_data[school].append({
            "name": row.get("Student Name", ""),
            "plate": row.get("Plate #", ""),
            "division": division,
            "R1 Place": row.get("R1 Place", ""),
            "R1 Pts": row.get("R1 Pts", ""),
            "R2 Place": row.get("R2 Place", ""),
            "R2 Pts": row.get("R2 Pts", ""),
            "R3 Place": row.get("R3 Place", ""),
            "R3 Pts": row.get("R3 Pts", ""),
            "R4 Place": row.get("R4 Place", ""),
            "R4 Pts": row.get("R4 Pts", ""),
            "R5 Place": row.get("R5 Place", ""),
            "R5 Pts": row.get("R5 Pts", ""),
            "R6 Place": row.get("R6 Place", ""),
            "R6 Pts": row.get("R6 Pts", ""),
            "Top 5": row.get("Top 5", ""),
            "points": row.get("Top 5", "")
        })

# Write school data safely to JSON
with open("data/school_results.json", "w") as f:
    json.dump(school_data, f, indent=2)

print("✅ school_results.json created at: data/school_results.json")


# === EXPORT RACE COMPARISON RESULTS ===
print("Generating race_comparison.json...")

race_names = {
    "Race 1": "Richard Juryn XC",
    "Race 2": "Seymour Enduro",
    "Race 3": "Alice Lake XC",
    "Race 4": "Alice Lake Enduro",
    "Race 5": "Fromme Enduro",
    "Race 6": "Whistler XC"
}

race_col_map = {
    "Race 1": "R1 Pts",
    "Race 2": "R2 Pts",
    "Race 3": "R3 Pts",
    "Race 4": "R4 Pts",
    "Race 5": "R5 Pts",
    "Race 6": "R6 Pts"
}

race_comparison = {}

for race_key, race_name in race_names.items():
    boys = {"Sr Boys": [], "Jr Boys": [], "Juv Boys": [], "Bant Boys": []}
    girls = {"Sr Girls": [], "Jr Girls": [], "Juv Girls": [], "Bant Girls": []}
    race_col = race_col_map[race_key]

    for division_dict in (boys, girls):
        for division in division_dict:
            sub_df = df_individual[df_individual["Division"] == division].copy()
            sub_df[race_col] = pd.to_numeric(sub_df[race_col], errors="coerce")
            sub_df = sub_df[~sub_df[race_col].isna() & (sub_df[race_col] > 0)]
            sub_df = sub_df.sort_values(by=race_col, ascending=False)
            riders = sub_df.apply(lambda row: f"{row['Student Name']} ({row['School']})", axis=1).tolist()
            division_dict[division] = riders

    race_comparison[race_key] = {
        "race_name": race_name,
        "boys": boys,
        "girls": girls
    }

with open("data/race_comparison.json", "w") as f:
    json.dump(race_comparison, f, indent=2)

print("✅ race_comparison.json created at: data/race_comparison.json")
