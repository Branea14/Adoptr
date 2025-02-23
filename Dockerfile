FROM python:3.9.18-alpine3.18

RUN apk add build-base

RUN apk add postgresql-dev gcc python3-dev musl-dev

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

COPY requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY . .

# RUN flask db upgrade 2>&1 | tee migration_log.txt || (cat migration_log.txt && exit 1)
# RUN flask seed all
# CMD gunicorn app:app

# Apply database migrations and stop deployment if they fail
RUN flask db upgrade || (echo "❌ Migration Failed! Check logs." && exit 1)

# Apply seed data only if migrations succeed
RUN flask seed all || echo "⚠️ Seeding failed or skipped."

# Start the Flask application
CMD gunicorn app:app
