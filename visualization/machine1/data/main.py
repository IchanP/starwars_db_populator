import pandas as pd
import plotly.graph_objects as go
import glob
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

file_paths = glob.glob("./data/100/Combined CPU load*.csv")
dfs = []

for path in file_paths:
    df = pd.read_csv(path)
    df.iloc[:, 0] = pd.to_datetime(df.iloc[:, 0])
    df.set_index(df.columns[0], inplace=True)

    df = df.map(lambda x: float(str(x).strip('%')) if isinstance(x, str) and '%' in str(x) else x)

    dfs.append(df)

combined_df = pd.concat(dfs).groupby(level=0).mean()

downsampled_df = combined_df.resample(f'{int(len(combined_df)/60)}s').mean().dropna().iloc[:60]

fig = go.Figure()
for col in downsampled_df.columns:
    fig.add_trace(go.Scatter(
        x=downsampled_df.index,
        y=downsampled_df[col],
        stackgroup='one',
        name=col
    ))

fig.update_layout(
    title='Average CPU Usage',
    xaxis_title='Time',
    yaxis_title='CPU Usage (%)',
    hovermode='x unified'
)

fig.show()
