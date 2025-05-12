# NOTE variables that needs to be set!
# The base_dir path needs to be set to the folder containing the files
# The path needs to be extended with the files to be read.

import pandas as pd
import plotly.graph_objects as go
from util.string_splitter import split_last_slash_first_dot
import glob

# TODO - Set me!
machines = [1, 2]

# TODO - Set me!
experiment_number = 3  # Changed to 1 to match the image

font_size = 40

base_dir_template = "./data/machine_{machine}_res_time/"

# Collect data for both machines
machine_data = {machine: {} for machine in machines}
all_legend_names = set()

for machine in machines:
    base_dir = base_dir_template.format(machine=machine)
    path = base_dir + f"EX{experiment_number}*.csv"
    data_files = glob.glob(path)
    for file in data_files:
        df = pd.read_csv(file).copy()
        totals = df[df['Label'] == 'TOTAL'].copy()
        totals.loc[:, 'Label'] = 'Avg. Response Time'

        avg_response_time = totals['Average'].values[0]
        std_dev = totals['Std. Dev.'].values[0]

        legend_name = split_last_slash_first_dot(file)
        legend_name = legend_name.split('_', 1)[1] if '_' in legend_name else legend_name
        all_legend_names.add(legend_name)
        machine_data[machine][legend_name] = {'avg': avg_response_time, 'std': std_dev}

# Convert the set of legend names to a sorted list
sorted_legend_names = sorted(list(all_legend_names))

# Create the figure
fig = go.Figure()

# Define colors for machines
machine_colors = {1: 'blue', 2: 'red'}

# Add traces for each machine, iterating through the sorted test cases
for machine in machines:
    x_values = []
    y_values = []
    error_values = []
    names = []
    for legend_name in sorted_legend_names:
        if legend_name in machine_data[machine]:
            x_values.append(legend_name)
            y_values.append(machine_data[machine][legend_name]['avg'])
            error_values.append(machine_data[machine][legend_name]['std'])
            names.append(f'Machine {machine}')

    fig.add_trace(go.Bar(
        name=f'Machine {machine}',
        x=x_values,
        y=y_values,
        marker_color=machine_colors[machine],
        text=[f"{val:.1f}" for val in y_values],
        textposition='outside',
        textfont=dict(size=35),
        error_y=dict(
            type='data',
            array=error_values,
            thickness=4,
            width=6,
            visible=True
        )
    ))

# Calculate the maximum average response time
max_avg_response_time = 0
for machine in machines:
    for legend_name in machine_data[machine]:
        max_avg_response_time = max(max_avg_response_time, machine_data[machine][legend_name]['avg'])

# TODO the hardcoded value may need slight adjustments
y_max = max_avg_response_time + 300

# Update layout
fig.update_layout(
    height=600,
    width=1800,
    title_text=f"Response Time: Experiment {experiment_number}",
    title_font_size=font_size,
    legend_font_size=30,
    font=dict(size=font_size),
    yaxis=dict(
        title='Response Time',
        ticksuffix=" ms",
        range=[0, y_max],
        tickfont=dict(size=25),
        title_font=dict(size=28)
    ),
    xaxis=dict(
        title='Test Cases',
        tickfont=dict(size=25),
        title_font=dict(size=28)
    ),
    barmode='group'
)

fig.show()

# Print the information for each machine and test case
for machine in machines:
    print(f"\n--- Machine {machine} ---")
    base_dir = base_dir_template.format(machine=machine)
    path = base_dir + f"EX{experiment_number}*.csv"
    data_files = glob.glob(path)
    for file in data_files:
        df = pd.read_csv(file)
        totals = df[df['Label'] == 'TOTAL']
        totals['Label'] = 'Avg. Response Time'

        avg_response_time = totals['Average'].values[0]
        std_dev = totals['Std. Dev.'].values[0]

        legend_name = split_last_slash_first_dot(file)
        legend_name = legend_name.split('_', 1)[1] if '_' in legend_name else legend_name

        print(f"  Test Case: {legend_name}")
        print(f"    Avg. Res. Time: {avg_response_time:.2f} ms")
        print(f"    Std. Dev. : {std_dev:.2f} ms")