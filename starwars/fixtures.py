import os
import json
from django.conf import settings
from django.core.management import call_command

def load_fixture(app_name, fixture_name):
    """Load a fixture into the database."""
    # TODO - check that the BASE_DIR is correct
    fixture_path = os.path.join(settings.BASE_DIR, 'fixtures', f'{fixture_name}.json')
    call_command('loaddate', fixture_path)
