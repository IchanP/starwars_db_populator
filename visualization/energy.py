# NOTE variables that needs to be set!
# The base_dir path needs to be set to the folder containing the directories
# directories needs to be set to all the directories that should be parsed
# experiment_number needs to be set to specify which experiment to analyze

import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import glob
import warnings
import os
import numpy as np

warnings.simplefilter(action='ignore', category=FutureWarning)

font_size = 38

# TODO - Set me!
# Experiment number (1, 2, or 3)
experiment_number = 1
# TODO - Set me!
# Machines to analyze (list)
machines = [1, 2]

no_work_directory = "no_work"

# Base directory containing the data
base_dir_template = "./data/data_machine_{machine}/"

# Directories to read from - will be set based on experiment_number
experiment_dirs = {
    1: ["100", "200", "300", "400", "500"],
    2: ["Batch", "Batch & Cache", "Cache", "No Cache or Batch"],
    3: ["Normal Fetch", "Overfetch"]
}

directories = experiment_dirs[experiment_number]

def process_powerapi_files(file_list, directory_name):
    dfs = []
    all_values = []
    for path in file_list:
        df = pd.read_csv(path)

        # Convert first column to datetime and set as index
        df.iloc[:, 0] = pd.to_datetime(df.iloc[:, 0])
        df.set_index(df.columns[0], inplace=True)

        # Clean watt strings, if any
        df = df.map(lambda x: float(str(x).strip('W')) if isinstance(x, str) and 'W' in str(x) else x)

        dfs.append(df)
        # Collect all values for std dev calculation
        all_values.extend(df.values.flatten())

    # Combine and average by timestamp
    combined_df = pd.concat(dfs).groupby(level=0).mean()

    # Calculate overall average and standard deviation
    total_average = combined_df.mean().mean()
    std_dev = np.std(all_values)

    return total_average, std_dev

# Collect data for both machines
machine_data = {}
baseline_data = {}

for machine in machines:
    base_dir = base_dir_template.format(machine=machine)
    average_energy_usage = {directory: {} for directory in directories + [no_work_directory]}

    # Get baseline from no_work directory
    base_dir_no_work = os.path.join(base_dir, no_work_directory)
    powerapi_no_work_files = glob.glob(os.path.join(base_dir_no_work, "PowerAPI*.csv"))
    baseline_avg, baseline_std = process_powerapi_files(powerapi_no_work_files, no_work_directory)
    baseline_data[machine] = baseline_avg

    relative_averages = []
    relative_std_devs = []

    for directory in directories:
        powerapi_file_paths = glob.glob(os.path.join(base_dir, directory, "PowerAPI*.csv"))
        avg, std = process_powerapi_files(powerapi_file_paths, directory)
        # Calculate relative values as percentage difference from baseline
        relative_avg = ((avg / baseline_avg) - 1) * 100
        relative_averages.append(relative_avg)
        relative_std_devs.append((std / baseline_avg) * 100)

    machine_data[machine] = {'relative_averages': relative_averages, 'relative_std_devs': relative_std_devs}

# Create the figure
fig = go.Figure()

# Define colors for machines
machine_colors = {1: 'blue', 2: 'red'}

# Add bars for Machine 1 (blue)
fig.add_trace(go.Bar(
    name='Machine 1',
    x=directories,
    y=machine_data[1]['relative_averages'],
    text=[f'{avg:+.1f}%' for avg in machine_data[1]['relative_averages']],
    textposition='outside',
    textfont=dict(size=36),
    cliponaxis=False,
    marker_color='blue',
    error_y=dict(
        type='data',
        array=machine_data[1]['relative_std_devs'],
        visible=True,
        color='black',
        thickness=2.5,
        width=6
    )
))

# Add bars for Machine 2 (red)
fig.add_trace(go.Bar(
    name='Machine 2',
    x=directories,
    y=machine_data[2]['relative_averages'],
    text=[f'{avg:+.1f}%' for avg in machine_data[2]['relative_averages']],
    textposition='outside',
    textfont=dict(size=36),
    cliponaxis=False,
    marker_color='red',
    error_y=dict(
        type='data',
        array=machine_data[2]['relative_std_devs'],
        visible=True,
        color='black',
        thickness=2.5,
        width=6
    )
))

# Update layout
fig.update_layout(
    title=f'Relative Power Consumption: Experiment {experiment_number}',
    title_font=dict(size=font_size),
    font=dict(
        family='Arial',
        size=font_size,
        color='black'
    ),
    xaxis=dict(
        title_text='Test Cases',
        title_font=dict(size=font_size),
        tickfont=dict(size=font_size)
    ),
    yaxis=dict(
        title_text='Power Consumption Relative to Baseline (%)',
        title_font=dict(size=font_size),
        tickfont=dict(size=font_size),
        range=[min([min(machine_data[m]['relative_averages']) for m in machines]) * 1.1 if min([min(machine_data[m]['relative_averages']) for m in machines]) < 0 else 0,
               max([max(machine_data[m]['relative_averages']) for m in machines]) * 1.1],
    ),
    barmode='group'
)

fig.show()