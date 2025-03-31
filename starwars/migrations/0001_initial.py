# Generated by Django 5.1.7 on 2025-03-28 11:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EditableModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('editable', models.BooleanField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Film',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100)),
                ('episode_id', models.IntegerField()),
                ('opening_crawl', models.TextField(max_length=1000)),
                ('director', models.CharField(max_length=100)),
                ('producer', models.CharField(max_length=100)),
                ('release_date', models.DateField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='People',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('height', models.CharField(blank=True, max_length=10)),
                ('mass', models.CharField(blank=True, max_length=10)),
                ('hair_color', models.CharField(blank=True, max_length=20)),
                ('skin_color', models.CharField(blank=True, max_length=20)),
                ('eye_color', models.CharField(blank=True, max_length=20)),
                ('birth_year', models.CharField(blank=True, max_length=10)),
                ('gender', models.CharField(blank=True, max_length=40)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Planet',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('rotation_period', models.CharField(max_length=40)),
                ('orbital_period', models.CharField(max_length=40)),
                ('diameter', models.CharField(max_length=40)),
                ('climate', models.CharField(max_length=40)),
                ('gravity', models.CharField(max_length=40)),
                ('terrain', models.CharField(max_length=40)),
                ('surface_water', models.CharField(max_length=40)),
                ('population', models.CharField(max_length=40)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Transport',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=40)),
                ('model', models.CharField(max_length=40)),
                ('manufacturer', models.CharField(max_length=80)),
                ('cost_in_credits', models.CharField(max_length=40)),
                ('length', models.CharField(max_length=40)),
                ('max_atmosphering_speed', models.CharField(max_length=40)),
                ('crew', models.CharField(max_length=40)),
                ('passengers', models.CharField(max_length=40)),
                ('cargo_capacity', models.CharField(max_length=40)),
                ('consumables', models.CharField(max_length=40)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FilmCharacter',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('film', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.film')),
                ('people', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.people')),
            ],
            options={
                'db_table': 'starwars_film_characters',
            },
        ),
        migrations.AddField(
            model_name='film',
            name='characters',
            field=models.ManyToManyField(blank=True, related_name='films', through='starwars.FilmCharacter', to='starwars.people'),
        ),
        migrations.AddField(
            model_name='people',
            name='homeworld',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='residents', to='starwars.planet'),
        ),
        migrations.CreateModel(
            name='FilmPlanet',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('film', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.film')),
                ('planet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.planet')),
            ],
            options={
                'db_table': 'starwars_film_planets',
            },
        ),
        migrations.AddField(
            model_name='film',
            name='planets',
            field=models.ManyToManyField(blank=True, related_name='films', through='starwars.FilmPlanet', to='starwars.planet'),
        ),
        migrations.CreateModel(
            name='Species',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('edited', models.DateTimeField(auto_now=True)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=40)),
                ('classification', models.CharField(max_length=40)),
                ('designation', models.CharField(max_length=40)),
                ('average_height', models.CharField(max_length=40)),
                ('skin_colors', models.CharField(max_length=200)),
                ('hair_colors', models.CharField(max_length=200)),
                ('eye_colors', models.CharField(max_length=200)),
                ('average_lifespan', models.CharField(max_length=40)),
                ('language', models.CharField(max_length=40)),
                ('homeworld', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='starwars.planet')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FilmSpecies',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('film', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.film')),
                ('species', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.species')),
            ],
            options={
                'db_table': 'starwars_film_species',
            },
        ),
        migrations.AddField(
            model_name='film',
            name='species',
            field=models.ManyToManyField(blank=True, related_name='films', through='starwars.FilmSpecies', to='starwars.species'),
        ),
        migrations.CreateModel(
            name='SpeciesPeople',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('people', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.people')),
                ('species', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.species')),
            ],
            options={
                'db_table': 'starwars_species_people',
            },
        ),
        migrations.AddField(
            model_name='species',
            name='people',
            field=models.ManyToManyField(blank=True, related_name='species', through='starwars.SpeciesPeople', to='starwars.people'),
        ),
        migrations.CreateModel(
            name='Starship',
            fields=[
                ('transport_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='starwars.transport')),
                ('hyperdrive_rating', models.CharField(max_length=40)),
                ('MGLT', models.CharField(max_length=40)),
                ('starship_class', models.CharField(max_length=40)),
            ],
            options={
                'abstract': False,
            },
            bases=('starwars.transport',),
        ),
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('transport_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='starwars.transport')),
                ('vehicle_class', models.CharField(max_length=40)),
            ],
            options={
                'abstract': False,
            },
            bases=('starwars.transport',),
        ),
        migrations.CreateModel(
            name='StarshipPilot',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('people', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.people')),
                ('starship', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.starship')),
            ],
            options={
                'db_table': 'starwars_starship_pilots',
            },
        ),
        migrations.AddField(
            model_name='starship',
            name='pilots',
            field=models.ManyToManyField(blank=True, related_name='starships', through='starwars.StarshipPilot', to='starwars.people'),
        ),
        migrations.CreateModel(
            name='FilmStarship',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('film', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.film')),
                ('starship', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.starship')),
            ],
            options={
                'db_table': 'starwars_film_starships',
            },
        ),
        migrations.AddField(
            model_name='film',
            name='starships',
            field=models.ManyToManyField(blank=True, related_name='films', through='starwars.FilmStarship', to='starwars.starship'),
        ),
        migrations.CreateModel(
            name='VehiclePilots',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('people', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.people')),
                ('vehicle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.vehicle')),
            ],
            options={
                'db_table': 'starwars_vehicle_pilots',
            },
        ),
        migrations.AddField(
            model_name='vehicle',
            name='pilots',
            field=models.ManyToManyField(blank=True, related_name='vehicles', through='starwars.VehiclePilots', to='starwars.people'),
        ),
        migrations.CreateModel(
            name='FilmVehicle',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('film', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.film')),
                ('vehicle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starwars.vehicle')),
            ],
            options={
                'db_table': 'starwars_film_vehicles',
            },
        ),
        migrations.AddField(
            model_name='film',
            name='vehicles',
            field=models.ManyToManyField(blank=True, related_name='films', through='starwars.FilmVehicle', to='starwars.vehicle'),
        ),
    ]
