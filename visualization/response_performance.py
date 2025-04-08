import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import glob

machine = "data_machine_2"

path = "./data/" + machine +"/response_times/ex1_*.csv"

# Define the path to your data files
data_files = glob.glob(path)

# Read data from each file
data_frames = [pd.read_csv(file) for file in data_files]

# Create subplots
num_plots = len(data_frames)
fig = make_subplots(rows=1, cols=num_plots, subplot_titles=[f"{(i+1) * 100} Users" for i in range(num_plots)])

# Plot data for each file
for i, df in enumerate(data_frames):
    totals = df[df['Label'] == 'TOTAL']

    fig.add_trace(go.Bar(
        x=totals['Label'],
        y=totals['Average'],
        error_y=dict(
            type='data',
            array=totals['Std. Dev.'],
            visible=True
        ),
        name='Average Response Time with Std. Dev.'
    ), row=1, col=i+1)

# Update layout
fig.update_layout(height=600, width=2000, title_text="Response Times Under Varying Load")

y_max = 2000
for i in range(1, num_plots + 1):
    fig.update_yaxes(ticksuffix=" ms", row=1, range=[0, y_max], col=i)


for i in range(1, num_plots + 1):
    fig.update_xaxes(title_text="Average Response Time", row=1, col=i)

fig.show()
