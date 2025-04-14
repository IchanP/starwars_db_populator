# NOTE variables that needs to be set!
# The base_dir path needs to be set to the folder containing the directories
# directories needs to be set to all the directories that should be parsed

import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import glob
import warnings
import os

warnings.simplefilter(action='ignore', category=FutureWarning)

# TODO - Set me!
# Base directory containing the data
base_dir = "./data/data_machine_1/"

# TODO - Set me!
# Directories to read from
directories = ["100", "200", "300", "400", "500"]
average_cpu_usage = {directory: {} for directory in directories}

# Create subplot figure
fig = make_subplots(
    rows=2, cols=2, shared_xaxes=False, shared_yaxes=False,
    subplot_titles=['Combined', 'Server', 'Redis', 'Postgres']
)

def plot_group_files(file_list, directory_name, row, col, y_range):
    dfs = []

    # Read and preprocess each CSV file in the group
    for path in file_list:
        df = pd.read_csv(path)

        # Convert the first column to datetime and set it as index
        df.iloc[:, 0] = pd.to_datetime(df.iloc[:, 0])
        df.set_index(df.columns[0], inplace=True)

        # Convert percentage strings (e.g. "45%") to float values
        df = df.map(lambda x: float(str(x).strip('%')) if isinstance(x, str) and '%' in str(x) else x)

        dfs.append(df)

    # Combine all DataFrames and calculate mean per timestamp
    combined_df = pd.concat(dfs).groupby(level=0).mean()

    # Resample data to 5-second intervals, average values, and keep first 61 rows (~5 minutes)
    downsampled_df = combined_df.resample('5S').mean().dropna().iloc[:61]

    # Replace datetime index with elapsed time in seconds (0s to 300s)
    new_time_index = pd.timedelta_range(start="0s", periods=61, freq="5S").total_seconds()
    downsampled_df.index = new_time_index

    # Calculate the total average CPU usage for this file type
    total_average = downsampled_df.mean().mean()
    average_cpu_usage[directory_name][file_list[0].split('/')[-1].split('_')[0]] = total_average

    # Plot each column as a stacked line in the specified subplot
    for col_name in downsampled_df.columns:
        fig.add_trace(go.Scatter(
            x=downsampled_df.index,
            y=downsampled_df[col_name],
            name=f"{directory_name} - {col_name}",
            showlegend=True
        ), row=row, col=col)

    # Axis labels and range
    fig.update_xaxes(title_text='Elapsed time (s)', range=[0, 300], row=row, col=col)
    fig.update_yaxes(title_text='CPU Usage (%)', range=y_range, row=row, col=col)

# Plot each group with proper Y-axis ranges
for directory in directories:
    combined_file_paths = glob.glob(os.path.join(base_dir, directory, "Combined*.csv"))
    server_file_paths = glob.glob(os.path.join(base_dir, directory, "Server*.csv"))
    redis_file_paths = glob.glob(os.path.join(base_dir, directory, "Redis*.csv"))
    postgres_file_paths = glob.glob(os.path.join(base_dir, directory, "Postgres*.csv"))

    plot_group_files(combined_file_paths, directory, 1, 1, y_range=[0, 100])
    plot_group_files(server_file_paths, directory, 1, 2, y_range=[0, 100])
    plot_group_files(redis_file_paths, directory, 2, 1, y_range=[0, 10])
    plot_group_files(postgres_file_paths, directory, 2, 2, y_range=[0, 10])

# Final layout
fig.update_layout(
    title='Average CPU Usage: Experiment 1',
    hovermode='x unified',
)

fig.show()

# Print the total average CPU usage per directory and file type
for directory, file_types in average_cpu_usage.items():
    print(f"Directory: {directory}")
    for file_type, avg_cpu in file_types.items():
        file_type: str
        print(f"  {file_type.split(" ")[0]}: {avg_cpu:.2f}%")