import pandas as pd
import plotly.graph_objects as go
import glob
import warnings
import os
import numpy as np

warnings.simplefilter(action='ignore', category=FutureWarning)

# TODO - Set me!
experiment_number = 3
# TODO - Set me!
machines = [1, 2]

font_size = 38

experiment_dirs = {
    1: ["100", "200", "300", "400", "500"],
    2: ["Batch", "Batch & Cache", "Cache", "No Cache or Batch"],
    3: ["Normal Fetch", "Overfetch"]
}

directories = experiment_dirs[experiment_number]

def process_cpu_files(file_list, directory_name):
    dfs = []
    all_values = []

    # Read and preprocess each CSV file in the group
    for path in file_list:
        df = pd.read_csv(path)

        # Convert the first column to datetime and set it as index
        df.iloc[:, 0] = pd.to_datetime(df.iloc[:, 0])
        df.set_index(df.columns[0], inplace=True)

        # Convert percentage strings (e.g. "45%") to float values
        df = df.map(lambda x: float(str(x).strip('%')) if isinstance(x, str) and '%' in str(x) else x)

        dfs.append(df)
        # Collect all values for std dev calculation
        all_values.extend(df.values.flatten())

    # Combine all DataFrames and calculate mean per timestamp
    combined_df = pd.concat(dfs).groupby(level=0).mean()

    # Calculate overall average and standard deviation
    total_average = combined_df.mean().mean()
    std_dev = np.std(all_values)

    return total_average, std_dev

# Collect data for both machines
machine_data = {}
for machine in machines:
    base_dir = f"./data/data_machine_{machine}/"
    averages = []
    std_devs = []
    for directory in directories:
        combined_file_paths = glob.glob(os.path.join(base_dir, directory, "Combined*.csv"))
        avg, std = process_cpu_files(combined_file_paths, directory)
        averages.append(avg)
        std_devs.append(std)
    machine_data[machine] = {'averages': averages, 'std_devs': std_devs}

# Create the figure
fig = go.Figure()

# Add bars for Machine 1 (blue)
fig.add_trace(go.Bar(
    name='Machine 1',
    x=directories,
    y=machine_data[1]['averages'],
    text=[f'{avg:.1f}%' for avg in machine_data[1]['averages']],
    textangle=0,
    cliponaxis=False,
    textfont=dict(size=48),
    marker_color='blue',
    error_y=dict(
        type='data',
        array=machine_data[1]['std_devs'],
        visible=True,
        color='black',
        thickness=3.5,
        width=6
    )
))

# Add bars for Machine 2 (red)
fig.add_trace(go.Bar(
    name='Machine 2',
    x=directories,
    y=machine_data[2]['averages'],
    text=[f'{avg:.1f}%' for avg in machine_data[2]['averages']],
    textangle=0,
    cliponaxis=False,
    textfont=dict(size=48),
    marker_color='red',
    error_y=dict(
        type='data',
        array=machine_data[2]['std_devs'],
        visible=True,
        color='black',
        thickness=3.5,
        width=6
    )
))

# Update layout
fig.update_layout(
    title=f'CPU Usage: Experiment {experiment_number}',
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
        title_text='CPU Usage (%)',
        title_font=dict(size=font_size),
        tickfont=dict(size=font_size),
        range=[0, max(max(machine_data[1]['averages']), max(machine_data[2]['averages'])) * 1.1]
    ),
    barmode='group'  # Display bars side by side
)

fig.show()