# Django DB Populator

This is a database populator, meant to populate a Postgres database with the [SWAPI](https://github.com/Juriy/swapi) dataset.

This project is not affiliatied with or endorsed by the [SWAPI](https://github.com/Juriy/swapi) project or its contributors.

## Installing dependencies

To install the required dependencies run:

```sh
pip install -r requirements.in
```

## Running the program

Spin up the postgres database located in the docker folder

```sh
cd ./docker
docker-compose up -d
```

## Generating schemas in Postgres

Run the following two commands to prepare the migration and schema.

```sh
python3 manage.py makemigrations starwars
python3 manage.py migrate starwars
```

Finally populate the database with

```sh
python3 manage.py load_starwars_data
```

## PgAdmin connection

In case you want to check things:

Open pgAdmin.
Go to File → Add New Server.
Under the **"General"** tab:

Name: `postgres_db` (or anything you like)

Under the **"Connection"** tab:

Host name/address: `localhost`
Port: `5432`
Maintenance database: `sw_db`
Username: `postgres`
Password: `example`

Click **"Save"**.

## Redis (for EX2)

Run redis using 
`docker run --name redis -p 6379:6379 -d redis`

## Run using docker compose

change to ts-server directory
run `docker-compose up -d`