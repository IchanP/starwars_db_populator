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

# TODO - Set me!
# Experiment number (1, 2, or 3)
experiment_number = 3
# TODO - Set me!
# Machine (1, 2)
machine = 2

# Base directory containing the data
base_dir = f"./data/data_machine_{machine}/"

# Directories to read from - will be set based on experiment_number
experiment_dirs = {
    1: ["100", "200", "300", "400", "500"],
    2: ["ex2 batch", "ex2 batch&cache", "ex2 cache", "ex2 noCachenoBatch"],
    3: ["ex3 overfetch", "ex3 correct"]
}

directories = experiment_dirs[experiment_number]
average_energy_usage = {directory: {} for directory in directories}

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

# Process data and collect averages and standard deviations
averages = []
std_devs = []
for directory in directories:
    powerapi_file_paths = glob.glob(os.path.join(base_dir, directory, "PowerAPI*.csv"))
    avg, std = process_powerapi_files(powerapi_file_paths, directory)
    averages.append(avg)
    std_devs.append(std)

# Create bar chart with error bars
fig = go.Figure(data=[
    go.Bar(
        name='Average Power',
        x=directories,
        y=averages,
        text=[f'{avg:.2f}W' for avg in averages],
        textposition='auto',
        error_y=dict(
            type='data',
            array=std_devs,
            visible=True,
            color='black',
            thickness=2.5,  # Increased from 1 to 2.5
            width=6
        )
    )
])

# Update layout
fig.update_layout(
    title=f'Average Power Consumption: Experiment {experiment_number}',
    title_font=dict(size=24),
    font=dict(
        family='Arial',
        size=24,
        color='black'
    ),
    xaxis=dict(
        title_text='Implementation Type',
        title_font=dict(size=24),
        tickfont=dict(size=24)
    ),
    yaxis=dict(
        title_text='Average Power Consumption (W)',
        title_font=dict(size=24),
        tickfont=dict(size=24),
        range=[0, max(averages) * 1.1]  # Set y-axis range with 10% padding
    )
)

fig.show()

# Print the total average Energy usage per directory and file type
for directory, file_types in average_energy_usage.items():
    print(f"Directory: {directory}")
    for file_type, avg_energy in file_types.items():
        print(f"  {file_type}: {avg_energy:.2f}W")