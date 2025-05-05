# NOTE variables that needs to be set!
# The base_dir path needs to be set to the folder containing the files
# The path needs to be extended with the files to be read.

import pandas as pd
import plotly.graph_objects as go
from util.string_splitter import split_last_slash_first_dot
import glob

# TODO - Set me!
machine = 1

# TODO - Set me!
experiment_number = 2

font_size = 40

base_dir = f"./data/machine_{machine}_res_time/"

path = base_dir + f"EX{experiment_number}*.csv"

# Define the path to your data files
data_files = glob.glob(path)

# Create a single figure
fig = go.Figure()

# Process data from each file
for i, file in enumerate(data_files):
    df = pd.read_csv(file)
    totals = df[df['Label'] == 'TOTAL']
    totals['Label'] = 'Avg. Response Time'

    # Extract average response time and standard deviation
    avg_response_time = totals['Average'].values[0]
    std_dev = totals['Std. Dev.'].values[0]

    # Extract the legend name from the filename and clean it
    legend_name = split_last_slash_first_dot(file)
    legend_name = legend_name.split('_', 1)[1] if '_' in legend_name else legend_name

    # Print the information
    print(f"  Test Case: {legend_name}")
    print(f"  Avg. Res. Time: {avg_response_time:.2f} ms")
    print(f"  Std. Dev. : {std_dev:.2f} ms")

    fig.add_trace(go.Bar(
        name=legend_name,
        x=[legend_name],
        y=[avg_response_time],
        text=[f"{avg_response_time:.1f}"],
        textposition='auto',
        textfont=dict(size=35),
        error_y=dict(
            type='data',
            array=[std_dev],
            thickness=4,
            width=6,
            visible=True
        )
    ))

# Calculate the maximum average response time across all files
max_avg_response_time = max(pd.read_csv(file)[pd.read_csv(file)['Label'] == 'TOTAL']['Average'].values[0] for file in data_files)

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
    showlegend=False
)

fig.show()
