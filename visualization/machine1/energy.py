import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import glob
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

# File paths
combined_file_paths = glob.glob("./data/100/Combined*.csv")
server_file_paths = glob.glob("./data/100/Server*.csv")
redis_file_paths = glob.glob("./data/100/Redis*.csv")
postgres_file_paths = glob.glob("./data/100/Postgres*.csv")

# Create subplot figure
fig = make_subplots(
    rows=2, cols=2, shared_xaxes=False, shared_yaxes=False,
    subplot_titles=['Combined', 'Server', 'Redis', 'Postgres']
)

def plot_group_files(file_list, row, col, y_range):
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

    # Plot each column as a stacked line in the specified subplot
    for col_name in downsampled_df.columns:
        fig.add_trace(go.Scatter(
            x=downsampled_df.index,
            y=downsampled_df[col_name],
            stackgroup='one',
            name=col_name,
            showlegend=False
        ), row=row, col=col)

    # Axis labels and range
    fig.update_xaxes(title_text='Elapsed time (s)', range=[0, 300], row=row, col=col)
    fig.update_yaxes(title_text='CPU Usage (%)', range=y_range, row=row, col=col)

# Plot each group with proper Y-axis ranges
plot_group_files(combined_file_paths, 1, 1, y_range=[0, 100])
plot_group_files(server_file_paths, 1, 2, y_range=[0, 100])
plot_group_files(redis_file_paths, 2, 1, y_range=[0, 10])
plot_group_files(postgres_file_paths, 2, 2, y_range=[0, 10])

# Final layout
fig.update_layout(
    title='Average CPU Usage Of 5 Runs: Experiment 1 - 100 Concurrent Users',
    hovermode='x unified',
)

fig.show()
