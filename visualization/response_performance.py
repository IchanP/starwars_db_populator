# NOTE variables that needs to be set!
# The base_dir path needs to be set to the folder containing the files
# The path needs to be extended with the files to be read.

import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import glob
from util.string_splitter import split_last_slash_first_dot

# TODO - Set me!
base_dir = "./data/machine_2_res_time/"

# TODO - Set me!
path = base_dir + "ex2_*.csv"

# Define the path to your data files
data_files = glob.glob(path)

# Read data from each file
data_frames = [pd.read_csv(file) for file in data_files]

# Create subplots
num_plots = len(data_frames)
fig = make_subplots(rows=1, cols=num_plots, subplot_titles=[split_last_slash_first_dot(data_files[i]) for i in range(num_plots)])


# Plot data for each file
for i, df in enumerate(data_frames):
    totals = df[df['Label'] == 'TOTAL']

    totals['Label'] = 'Avg. Response Time'

    # Extract average response time and standard deviation
    avg_response_time = totals['Average'].values[0]
    std_dev = totals['Std. Dev.'].values[0]

    # Extract the number of users from the filename
    num_users = (i + 1) * 100

        # Extract the legend name from the filename
    legend_name = split_last_slash_first_dot(data_files[i])

    # Print the information
    print(f"  Test Case: {legend_name}")
    print(f"  Avg. Res. Time: {avg_response_time:.2f} ms")
    print(f"  Std. Dev. : {std_dev:.2f} ms")


    fig.add_trace(go.Bar(
        x=totals['Label'],
        y=totals['Average'],
        error_y=dict(
            type='data',
            array=totals['Std. Dev.'],
            visible=True,
        ),
        name=legend_name
    ), row=1, col=i+1)



# Calculate the maximum average response time across all data frames
max_avg_response_time = max(df[df['Label'] == 'TOTAL']['Average'].values[0] for df in data_frames)

# TODO the hardcoded value may need slight adjustments
y_max = max_avg_response_time + 100

# Update layout
fig.update_layout(height=600, width=1800, title_text="Response Times under varying queries")

for i in range(1, num_plots + 1):
    fig.update_yaxes(ticksuffix=" ms", row=1, range=[0, y_max], col=i)

fig.show()
