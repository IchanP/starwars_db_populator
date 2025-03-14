import os
from django.conf import settings
from django.core.management import call_command
import json

def load_fixture(fixture_name):
    """Load a fixture into the database."""
    fixture_path = os.path.join(settings.BASE_DIR, 'fixtures', f'{fixture_name}.json')

    data = json.load(fixture_path)
    for item in data:
        item['model'] = item['model'].replace('resources.', 'starwars')
    call_command('loaddata', fixture_path)
