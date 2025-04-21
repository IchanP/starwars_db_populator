import pandas as pd
import plotly.graph_objects as go
import glob
import warnings
import os
import numpy as np

warnings.simplefilter(action='ignore', category=FutureWarning)

# TODO - Set me!a
experiment_number = 2

# TODO - Set me!
machine = 2

font_size = 38

base_dir = f"./data/data_machine_{machine}/"

experiment_dirs = {
    1: ["100", "200", "300", "400", "500"],
    2: ["Batch", "Batch & Cache", "Cache", "No Cache or Batch"],
    3: ["Normal Fetch", "Overfetch"]
}

directories = experiment_dirs[experiment_number]
average_cpu_usage = {directory: {} for directory in directories}

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
    average_cpu_usage[directory_name][file_list[0].split('/')[-1].split('_')[0]] = total_average

    return total_average, std_dev

# Process data and collect averages and standard deviations
averages = []
std_devs = []

for directory in directories:
    combined_file_paths = glob.glob(os.path.join(base_dir, directory, "Combined*.csv"))
    avg, std = process_cpu_files(combined_file_paths, directory)
    averages.append(avg)
    std_devs.append(std)

# Create bar chart with error bars
fig = go.Figure(data=[
    go.Bar(
        name='CPU Usage',
        x=directories,
        y=averages,
        text=[f'{avg:.1f}%' for avg in averages],
        textangle=0,
        cliponaxis=False,  
        textfont=dict(size=48),  
        error_y=dict(
            type='data',
            array=std_devs,
            visible=True,
            color='black',
            thickness=3.5,
            width=6
        )
    )
])

# Update layout
fig.update_layout(
    title='CPU Usage: Experiment 3',
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
        range=[0, max(averages) * 1.1]
    )
)

fig.show()

# Print the relative CPU usage per directory and file type
# for directory, file_types in average_cpu_usage.items():
#     print(f"\nDirectory: {directory}")
#     for file_type, avg_cpu in file_types.items():
#         relative = ((avg_cpu / baseline_avg) - 1) * 100
#         print(f"  {file_type}: {avg_cpu:.2f}% ({relative:+.1f}% vs baseline)")