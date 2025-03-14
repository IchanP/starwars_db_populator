from django.core.management.base import BaseCommand
from starwars.fixtures import load_fixture

class Command(BaseCommand):
    help = 'Load StarWars data into the database'

    def handle(self, *args, **options):
        load_fixture('transport')
        load_fixture('people')
        load_fixture('planets')
        load_fixture('vehicles')
        load_fixture('starships')