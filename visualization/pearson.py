import glob
from statistics import mean
import os
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
from sklearn.linear_model import LinearRegression

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
base_dir = "./data/data_machine_1/" #TODO: ÄNDRA TILL SIN EGNA FOLDER
for folder in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, folder)
    if os.path.isdir(folder_path):  # Only process subfolders
        print(f"Processing folder: {folder}")
        
        # Prepare file paths for the current folder
        summary_file_path = os.path.join(folder_path, "summary.csv") #TODO: ÄNDRA FILNAMN
        combined_file_paths = glob.glob(os.path.join(folder_path, "Combined*.csv")) #TODO: ÄNDRA FILNAMN
        powerapi_file_paths = glob.glob(os.path.join(folder_path, "PowerAPI*.csv")) #TODO: ÄNDRA FILNAMN
        
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

# --- Collect all raw CPU and Energy readings for detailed scatter plot ---
cpu_energy_records = []

for folder in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, folder)
    if os.path.isdir(folder_path):
        combined_file_paths = glob.glob(os.path.join(folder_path, "Combined*.csv")) #TODO: ÄNDRA FILNAMN
        powerapi_file_paths = glob.glob(os.path.join(folder_path, "PowerAPI*.csv")) #TODO: ÄNDRA FILNAMN

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

# --- Create a subplot layout ---
fig = make_subplots(
    rows=1, cols=3,
    column_widths=[0.45, 0.1, 0.45],
    row_heights=[1],
    subplot_titles=["Full Data: CPU Usage vs Energy Consumption","", "Pearson Correlation Heatmap" ],
    shared_yaxes=True,
)

# --- Add the Heatmap to the first subplot ---
heatmap = go.Heatmap(
    z=correlation_matrix.values,
    x=correlation_matrix.columns,
    y=correlation_matrix.index,
    colorscale="RdBu",
    colorbar=dict(title="Correlation"),
    showscale=True,
    zmin=-1, zmax=1,
    text=correlation_matrix.values,  # Display Pearson values inside the boxes
    texttemplate="%{text:.2f}",  # Format the Pearson values to 2 decimal places
)
fig.add_trace(heatmap, row=1, col=3)
fig.update_layout(
    yaxis3=dict(
        tickangle=0,  # Ensure horizontal labels for the y-axis
        tickvals=list(range(len(correlation_matrix.index))),
        ticktext=correlation_matrix.index,  # Set custom y-axis tick text (correlation matrix row names)
        showticklabels=True,  # Make sure the y-axis labels are shown
    ),
)

# --- Add the Scatter Plot to the second subplot ---
scatter = go.Scatter(
    x=df_full_scatter["CPU (%)"],
    y=df_full_scatter["Energy (W)"],
    mode="markers",
    name="CPU vs Energy",
    marker=dict(size=7, color="blue", opacity=0.7),
)

# --- Fit linear regression model for trendline ---
X = df_full_scatter["CPU (%)"].values.reshape(-1, 1)  # Reshape for sklearn
y = df_full_scatter["Energy (W)"].values

regressor = LinearRegression()
regressor.fit(X, y)

# Predict the values for the trendline
y_pred = regressor.predict(X)

# --- Add the trendline to the scatter plot ---
trendline = go.Scatter(
    x=df_full_scatter["CPU (%)"],
    y=y_pred,
    mode="lines",
    name="Trendline",
    line=dict(color="red", width=2)
)

fig.add_trace(scatter, row=1, col=1)
fig.add_trace(trendline, row=1, col=1)

# --- Update layout for better spacing and titles ---
fig.update_layout(
    height=540,
    width=1200,
    title_text="Correlation: Heatmap and Scatter Plot",
    showlegend=False,
    autosize=False,
)

# --- Show the combined plot ---
fig.show()
