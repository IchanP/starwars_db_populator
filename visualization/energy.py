# NOTE variables that needs to be set!
# The base_dir path needs to be set to the folder containing the directories
# directories needs to be set to all the directories that should be parsed

import pandas as pd
import plotly.graph_objects as go
import glob
import warnings
import os

warnings.simplefilter(action='ignore', category=FutureWarning)

# TODO - Set me!
# Base directory containing the data
base_dir = "./data/data_machine_2/"

# TODO - Set me!
# Directories to read from
directories = ["EX2_Batched", "EX2_Cache", "EX2_Cached_Batched", "EX2_No_Cache_No_Batch"]

average_energy_usage = {directory: {} for directory in directories}

# Create a single subplot figure
fig = go.Figure()

def plot_powerapi_files(file_list, directory_name, y_range):
    dfs = []

    for path in file_list:
        df = pd.read_csv(path)

        # Convert first column to datetime and set as index
        df.iloc[:, 0] = pd.to_datetime(df.iloc[:, 0])
        df.set_index(df.columns[0], inplace=True)

        # Clean watt strings, if any
        df = df.map(lambda x: float(str(x).strip('W')) if isinstance(x, str) and 'W' in str(x) else x)

        dfs.append(df)

    # Combine and average by timestamp
    combined_df = pd.concat(dfs).groupby(level=0).mean()

    # Resample to 5-second intervals and get first 61 points (~5 mins)
    downsampled_df = combined_df.resample('5S').mean().dropna().iloc[:61]

    # Replace index with elapsed time in seconds
    new_time_index = pd.timedelta_range(start="0s", periods=61, freq="5S").total_seconds()
    downsampled_df.index = new_time_index

    total_average = downsampled_df.mean().mean()
    average_energy_usage[directory_name][file_list[0].split('/')[-1].split('_')[0]] = total_average

    # Plot each column as a line
    for col_name in downsampled_df.columns:
        fig.add_trace(go.Scatter(
            x=downsampled_df.index,
            y=downsampled_df[col_name],
            name=f"{directory_name}",
            showlegend=True
        ))

    # Update axes
    fig.update_xaxes(title_text='Elapsed time (s)', range=[0, 300])
    fig.update_yaxes(title_text='Power Consumption (W)', range=y_range)

# Plot PowerAPI data from each directory
for directory in directories:
    powerapi_file_paths = glob.glob(os.path.join(base_dir, directory, "Energy*.csv"))
    plot_powerapi_files(powerapi_file_paths, directory, y_range=[0, 15])

# Final layout
fig.update_layout(
    title='Average Power Consumption: Experiment 2',
    hovermode='x unified'
)

fig.show()

# Print the total average Energy usage per directory and file type
for directory, file_types in average_energy_usage.items():
    print(f"Directory: {directory}")
    for file_type, avg_cpu in file_types.items():
        file_type: str
        print(f"  {file_type.split(" ")[0]}: {avg_cpu:.2f}W")