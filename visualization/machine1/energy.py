import pandas as pd
import plotly.graph_objects as go
import glob
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

# File paths for PowerAPI files
powerapi_file_paths = glob.glob("./data/100/PowerAPI*.csv")

# Create a single subplot figure
fig = go.Figure()

def plot_powerapi_files(file_list, y_range):
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

    # Plot each column as a line
    for col_name in downsampled_df.columns:
        fig.add_trace(go.Scatter(
            x=downsampled_df.index,
            y=downsampled_df[col_name],
            name=col_name,
            showlegend=False
        ))

    # Update axes
    fig.update_xaxes(title_text='Elapsed time (s)', range=[0, 300])
    fig.update_yaxes(title_text='Power Consumption (W)', range=y_range)

# Plot PowerAPI data
plot_powerapi_files(powerapi_file_paths, y_range=[0, 15])

# Final layout
fig.update_layout(
    title='Average Power Consumption: Experiment 1 - 100 Concurrent Users',
    hovermode='x unified'
)

fig.show()
