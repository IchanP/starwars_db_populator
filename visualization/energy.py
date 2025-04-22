# NOTE variables that needs to be set!
# The base_dir path needs to be set to the folder containing the directories
# directories needs to be set to all the directories that should be parsed
# experiment_number needs to be set to specify which experiment to analyze

import pandas as pd
import plotly.graph_objects as go
import glob
import warnings
import os
import numpy as np

warnings.simplefilter(action='ignore', category=FutureWarning)

font_size = 38

# TODO - Set me!
# Experiment number (1, 2, or 3)
experiment_number = 3
# TODO - Set me!
# Machine (1, 2)
machine = 2

no_work_directory = "no_work"

# Base directory containing the data
base_dir = f"./data/data_machine_{machine}/"

# Directories to read from - will be set based on experiment_number
experiment_dirs = {
    1: ["100", "200", "300", "400", "500"],
    2: ["Batch", "Batch & Cache", "Cache", "No Cache or Batch"],
    3: ["Normal Fetch", "Overfetch"]
}



directories = experiment_dirs[experiment_number]
# Initialize the dictionary with all directories including 'no_work'
average_energy_usage = {directory: {} for directory in directories + [no_work_directory]}

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
    average_energy_usage[directory_name][file_list[0].split('/')[-1].split('_')[0]] = total_average
    
    return total_average, std_dev

# Get baseline from no_work directory
base_dir_no_work = os.path.join(base_dir, no_work_directory)
powerapi_no_work_files = glob.glob(os.path.join(base_dir_no_work, "PowerAPI*.csv"))
baseline_avg, baseline_std = process_powerapi_files(powerapi_no_work_files, no_work_directory)

# Add no_work to the average_energy_usage dictionary if it doesn't exist
if no_work_directory not in average_energy_usage:
    average_energy_usage[no_work_directory] = {}

# Process data and collect averages and standard deviations
averages = []
std_devs = []
relative_averages = []  # For storing percentage differences from baseline
relative_std_devs = []  # For storing relative standard deviations

for directory in directories:
    powerapi_file_paths = glob.glob(os.path.join(base_dir, directory, "PowerAPI*.csv"))
    avg, std = process_powerapi_files(powerapi_file_paths, directory)
    averages.append(avg)
    std_devs.append(std)
    # Calculate relative values as percentage difference from baseline
    relative_avg = ((avg / baseline_avg) - 1) * 100
    relative_averages.append(relative_avg)
    relative_std_devs.append((std / baseline_avg) * 100)

# Create bar chart with error bars
fig = go.Figure(data=[
    go.Bar(
        name='Relative Power Consumption',
        x=directories,
        y=relative_averages,
        text=[f'{avg:+.1f}%' for avg in relative_averages],
        textangle=0,
        cliponaxis=False,
        textfont=dict(size=48),  
        error_y=dict(
            type='data',
            array=relative_std_devs,
            visible=True,
            color='black',
            thickness=2.5,
            width=6
        )
    )
])

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
        title_text='Implementation Type',
        title_font=dict(size=font_size),
        tickfont=dict(size=font_size)
    ),
    yaxis=dict(
        title_text='Power Consumption Relative to Baseline (%)',
        title_font=dict(size=font_size),
        tickfont=dict(size=font_size),
        range=[min(relative_averages) * 1.1 if min(relative_averages) < 0 else 0, 
               max(relative_averages) * 1.1]
    )
)

fig.show()

# Print the relative power usage per directory and file type
print(f"Baseline (no_work) average: {baseline_avg:.2f}W")
for directory, file_types in average_energy_usage.items():
    print(f"\nDirectory: {directory}")
    for file_type, avg_energy in file_types.items():
        relative = ((avg_energy / baseline_avg) - 1) * 100
        print(f"  {file_type}: {avg_energy:.2f}W ({relative:+.1f}% vs baseline)")