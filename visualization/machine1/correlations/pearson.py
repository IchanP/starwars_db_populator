import glob
import pandas as pd

# Load your dataset
df = pd.read_csv("../data/100/summary.csv")
combined_file_paths = glob.glob("./data/100/Combined*.csv")
powerapi_file_paths = glob.glob("./data/100/PowerAPI*.csv")

# Select only the relevant numeric columns
df_corr = df[['CPU (%)', 'Response Time (ms)', 'Energy (W)']]

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

# Plot each group with proper Y-axis ranges
plot_group_files(combined_file_paths, 1, 1, y_range=[0, 100])
plot_group_files(server_file_paths, 1, 2, y_range=[0, 100])

# Compute Pearson correlation
correlation_matrix = df_corr.corr(method='pearson')

print("Pearson Correlation Matrix:")
print(correlation_matrix)
