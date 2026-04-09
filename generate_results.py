import openpyxl
import pandas as pd
import json
import sys
from pathlib import Path

# Ensure UTF-8 encoding for console output
sys.stdout.reconfigure(encoding='utf-8')

# === PATH CONFIG ===
BASE_DIR = Path(__file__).resolve().parent
EXCEL_FILE = BASE_DIR / "results_2026_master.xlsx"
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

TEAM_RESULTS_FILE = DATA_DIR / "team_results.json"
RESULTS_FILE = DATA_DIR / "results.json"
DIVISION_RESULTS_FILE = DATA_DIR / "division_results.json"
SCHOOL_RESULTS_FILE = DATA_DIR / "school_results.json"
RACE_RESULTS_FILE = DATA_DIR / "race_results.json"

# === LOAD TEAM DATA ===
df_teams = pd.read_excel(EXCEL_FILE, sheet_name="TeamPoints", header=0, usecols="A:I", nrows=101)

# Clean up column names
df_teams.columns = df_teams.columns.astype(str).str.strip()

# Debug: inspect first rows
print(df_teams.head(10))

# Clean key text columns
df_teams["Division"] = df_teams["Division"].astype(str).str.strip()
df_teams["School"] = df_teams["School"].astype(str).str.strip()

if "Division" not in df_teams.columns:
    raise ValueError("Column 'Division' is missing in the TeamPoints sheet")

# === TOP 3 TEAMS FOR HOME PAGE ===
teams_output = {}
for division in df_teams["Division"].unique():
    top3 = (
        df_teams[df_teams["Division"] == division]
        .sort_values(by="Total", ascending=False)
        .head(3)
        .rename(columns={"School": "name", "Total": "points"})[["name", "points"]]
        .reset_index(drop=True)
    )
    teams_output[division] = top3.to_dict(orient="records")

# === FULL TEAM RESULTS EXPORT ===
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
    division_df = division_df.fillna("")

    teams = []
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

with open(TEAM_RESULTS_FILE, "w", encoding="utf-8") as f:
    json.dump(full_teams_output, f, indent=2)

print(f"✅ team_results.json created at: {TEAM_RESULTS_FILE}")

# === LOAD INDIVIDUAL RESULTS ===
df_individual = pd.read_excel(EXCEL_FILE, sheet_name="Individual Results")
df_individual["Top 5"] = pd.to_numeric(df_individual["Top 5"], errors="coerce")

# === TOP 5 RIDERS FOR HOME PAGE ===
riders_output = {}
for division in df_individual["Division"].dropna().unique():
    top5 = (
        df_individual[df_individual["Division"] == division]
        .sort_values(by="Top 5", ascending=False)
        .head(5)
        .rename(columns={"Student Name": "name", "School": "school", "Top 5": "points"})[
            ["name", "school", "points"]
        ]
        .reset_index(drop=True)
    )
    riders_output[division] = top5.to_dict(orient="records")

results_json = {
    "teams": teams_output,
    "riders": riders_output
}

with open(RESULTS_FILE, "w", encoding="utf-8") as f:
    json.dump(results_json, f, indent=2)

print(f"✅ results.json created at: {RESULTS_FILE}")

# === DIVISION RESULTS EXPORT ===
division_data = {}

df_individual["Top 5"] = pd.to_numeric(df_individual["Top 5"], errors="coerce")
df_individual = df_individual.fillna("")

for division in df_individual["Division"].unique():
    if not division:
        continue

    div_df = df_individual[df_individual["Division"] == division].copy()
    div_df = div_df.sort_values(by="Top 5", ascending=False).reset_index(drop=True)

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

with open(DIVISION_RESULTS_FILE, "w", encoding="utf-8") as f:
    json.dump(division_data, f, indent=2)

print(f"✅ division_results.json created at: {DIVISION_RESULTS_FILE}")

# === SCHOOL RESULTS EXPORT ===
school_data = {}

for division in df_individual["Division"].dropna().unique():
    div_df = df_individual[df_individual["Division"] == division].copy()
    div_df["Top 5"] = pd.to_numeric(div_df["Top 5"], errors="coerce")
    div_df = div_df.fillna("")
    div_df = div_df.sort_values(by="Top 5", ascending=False).reset_index(drop=True)

    for _, row in div_df.iterrows():
        school = row["School"]
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

with open(SCHOOL_RESULTS_FILE, "w", encoding="utf-8") as f:
    json.dump(school_data, f, indent=2)

print(f"✅ school_results.json created at: {SCHOOL_RESULTS_FILE}")

# === RACE RESULTS EXPORT ===
print("Generating race_results.json...")

race_names = {
    "Race 1": "R1 - Richard Juryn XC",
    "Race 2": "R2 - Seymour Enduro",
    "Race 3": "R3 - Fromme XC",
    "Race 4": "R4 - Fromme Enduro",
    "Race 5": "R5 - Squamish Enduro",
    "Race 6": "R6 - Whistler XC"
}

race_col_map = {
    "Race 1": "R1 Pts",
    "Race 2": "R2 Pts",
    "Race 3": "R3 Pts",
    "Race 4": "R4 Pts",
    "Race 5": "R5 Pts",
    "Race 6": "R6 Pts"
}

boys_divisions = ["Sr Boys", "Jr Boys", "Juv Boys", "Bant Boys"]
girls_divisions = ["Sr Girls", "Jr Girls", "Juv Girls", "Bant Girls"]

race_results = {}

for race_key, pts_col in race_col_map.items():
    race_name = race_names.get(race_key, race_key)

    boys = {}
    girls = {}

    for division in boys_divisions:
        sub_df = df_individual[df_individual["Division"] == division].copy()
        sub_df[pts_col] = pd.to_numeric(sub_df[pts_col], errors="coerce")
        sub_df = sub_df[~sub_df[pts_col].isna() & (sub_df[pts_col] > 0)]
        sub_df = sub_df.sort_values(by=pts_col, ascending=False)

        boys[division] = [
            {
                "name": row.get("Student Name", ""),
                "school": row.get("School", "")
            }
            for _, row in sub_df.iterrows()
        ]

    for division in girls_divisions:
        sub_df = df_individual[df_individual["Division"] == division].copy()
        sub_df[pts_col] = pd.to_numeric(sub_df[pts_col], errors="coerce")
        sub_df = sub_df[~sub_df[pts_col].isna() & (sub_df[pts_col] > 0)]
        sub_df = sub_df.sort_values(by=pts_col, ascending=False)

        girls[division] = [
            {
                "name": row.get("Student Name", ""),
                "school": row.get("School", "")
            }
            for _, row in sub_df.iterrows()
        ]

    race_results[race_key] = {
        "race_name": race_name,
        "boys": boys,
        "girls": girls
    }

with open(RACE_RESULTS_FILE, "w", encoding="utf-8") as f:
    json.dump(race_results, f, indent=2, ensure_ascii=False)

print(f"✅ race_results.json created at: {RACE_RESULTS_FILE}")