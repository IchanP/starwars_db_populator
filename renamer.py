import os
import json

directory = './fixtures'

for entry in os.scandir(directory):
    if entry.is_file():
        with open(entry.path, 'r') as f:
            data = json.load(f)
        for item in data:
            item['model'] = item['model'].replace('resources.', 'starwars.')

        with open(entry.path, 'w') as f:
            json.dump(data, f)