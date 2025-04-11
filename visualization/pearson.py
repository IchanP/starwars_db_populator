import glob
from statistics import mean
import os
import pandas as pd
import numpy as np
import plotly.express as px
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

# --- Function to get per-file averages ---
def average_from_files(file_list):
    averages = []
    for path in file_list:
        df = pd.read_csv(path)
        df.iloc[:, 0] = pd.to_datetime(df.iloc[:, 0])
        df.set_index(df.columns[0], inplace=True)
        df = df.map(lambda x: float(str(x).strip().rstrip('%W')) if isinstance(x, str) and (('%' in str(x)) or ('W' in str(x))) else x)
        downsampled_df = df.resample('5s').mean().dropna().iloc[:61]
        averages.append(downsampled_df.mean().mean())  # average of all values in the file
    return mean(averages)

# --- Prepare to collect data ---
response_times = []
average_cpus = []
average_energies = []

# --- Loop through each folder in ./data/data_machine_1 ---
base_dir = "./data/data_machine_1/"
for folder in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, folder)
    if os.path.isdir(folder_path):  # Only process subfolders
        print(f"Processing folder: {folder}")
        
        # Prepare file paths for the current folder
        summary_file_path = os.path.join(folder_path, "summary.csv")
        combined_file_paths = glob.glob(os.path.join(folder_path, "Combined*.csv"))
        powerapi_file_paths = glob.glob(os.path.join(folder_path, "PowerAPI*.csv"))
        
        # --- Load and prepare summary.csv ---
        if os.path.exists(summary_file_path):
            summary_df = pd.read_csv(summary_file_path)
            average_response_time = summary_df['Average'].mean()
        else:
            average_response_time = 0  # Handle if file doesn't exist

        # --- Compute Averages for CPU and Energy ---
        average_cpu = average_from_files(combined_file_paths)       # average CPU value
        average_energy = average_from_files(powerapi_file_paths)   # average Energy value
        
        # Append to the lists
        response_times.append(average_response_time)
        average_cpus.append(average_cpu)
        average_energies.append(average_energy)

# --- Create DataFrame for correlation ---
data = {
    "CPU (%)": average_cpus,
    "Response Time (ms)": response_times,
    "Energy (W)": average_energies
}
df_corr = pd.DataFrame(data)
print(df_corr)

# --- Compute Pearson Correlation Matrix ---
correlation_matrix = df_corr.corr(method='pearson')
print("Pearson Correlation Matrix:")
print(correlation_matrix)

# --- Plot heatmap ---
fig = px.imshow(
    correlation_matrix,
    text_auto=True,
    color_continuous_scale="RdBu",
    title="Pearson Correlation Heatmap"
)
fig.update_layout(width=500, height=500)
fig.show()

# --- Collect all raw CPU and Energy readings for detailed scatter plot ---
cpu_energy_records = []

for folder in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, folder)
    if os.path.isdir(folder_path):
        combined_file_paths = glob.glob(os.path.join(folder_path, "Combined*.csv"))
        powerapi_file_paths = glob.glob(os.path.join(folder_path, "PowerAPI*.csv"))

        for cpu_file, energy_file in zip(combined_file_paths, powerapi_file_paths):
            # Read and resample CPU data
            df_cpu = pd.read_csv(cpu_file)
            df_cpu.iloc[:, 0] = pd.to_datetime(df_cpu.iloc[:, 0])
            df_cpu.set_index(df_cpu.columns[0], inplace=True)
            df_cpu = df_cpu.map(lambda x: float(str(x).strip().rstrip('%W')) if isinstance(x, str) and (('%' in str(x)) or ('W' in str(x))) else x)
            df_cpu = df_cpu.resample('5s').mean().dropna()

            # Read and resample Energy data
            df_energy = pd.read_csv(energy_file)
            df_energy.iloc[:, 0] = pd.to_datetime(df_energy.iloc[:, 0])
            df_energy.set_index(df_energy.columns[0], inplace=True)
            df_energy = df_energy.map(lambda x: float(str(x).strip().rstrip('%W')) if isinstance(x, str) and (('%' in str(x)) or ('W' in str(x))) else x)
            df_energy = df_energy.resample('5s').mean().dropna()

            # Compute per-timestamp means and name the Series
            cpu_series = df_cpu.mean(axis=1)
            cpu_series.name = "CPU (%)"

            energy_series = df_energy.mean(axis=1)
            energy_series.name = "Energy (W)"

            # Merge on timestamp
            merged_df = pd.merge(cpu_series, energy_series, left_index=True, right_index=True)


            # Append each row to the list
            for _, row in merged_df.iterrows():
                cpu_energy_records.append({
                    "CPU (%)": row["CPU (%)"],
                    "Energy (W)": row["Energy (W)"]
                })

# --- Create DataFrame for full scatter plot ---
df_full_scatter = pd.DataFrame(cpu_energy_records)

# --- Plot scatter: Full Measurement CPU vs Energy ---
fig_full_cpu_energy = px.scatter(
    df_full_scatter,
    x="CPU (%)",
    y="Energy (W)",
    title="Full Data: CPU Usage vs Energy Consumption",
    labels={
        "CPU (%)": "CPU Usage (%)",
        "Energy (W)": "Energy Consumption (W)"
    },
    trendline="ols"
)
fig_full_cpu_energy.show()
