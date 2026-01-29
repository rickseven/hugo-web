+++
date = 2026-01-28T10:00:00Z
title = "Change Data Capture with Debezium, Kafka, and PostgreSQL"
description = "Learn how to build a real-time data streaming pipeline using CDC (Change Data Capture) with Debezium, Kafka, and PostgreSQL. A simple step-by-step tutorial."
[author]
name = "Moh Eric"

+++

Have you ever wondered how big companies keep their data in sync across different systems in real-time? The answer is often Change Data Capture, or CDC for short.

In this tutorial, I'll show you how to set up a CDC pipeline using Debezium, Kafka, and PostgreSQL. Don't worry if these names sound scary. I'll explain everything in simple terms.

## What is Change Data Capture?

Think of CDC like a security camera for your database. Every time something changes in your database (insert, update, or delete), CDC captures that change and sends it somewhere else. This is super useful when you need to:

- Keep multiple databases in sync
- Send data to analytics systems
- Trigger actions when data changes
- Build event-driven applications

## The Tools We'll Use

Before we start, let me introduce the main players:

- **PostgreSQL**: Our main database where data lives
- **Debezium**: The "camera" that watches for changes in PostgreSQL
- **Kafka**: The "highway" that carries the change events
- **Zookeeper**: Kafka's helper that keeps everything organized
- **Schema Registry**: Keeps track of data formats
- **Docker**: Makes everything easy to run

## Prerequisites

You only need one thing installed on your machine:

- [Docker](https://www.docker.com/products/docker-desktop/) (with Docker Compose)

That's it! Docker will handle everything else.

## Let's Build It

First, clone the project repository:

```bash
git clone https://github.com/rickseven/cdc-confluent-postgres.git
cd cdc-confluent-postgres
```

Now, start all services with one command:

```bash
docker compose up --build -d
```

This will take a few minutes the first time. Docker is downloading and setting up:

- 3 Kafka brokers (for reliability)
- 1 Zookeeper
- 1 PostgreSQL database
- 1 Kafka Connect (with Debezium)
- 1 Schema Registry
- 1 Python consumer app
- Monitoring tools (Grafana, Prometheus, Loki)

To check if everything is running:

```bash
docker ps
```

You should see about 12-13 containers running.

## How It Works

Let me explain what happens behind the scenes:

1. **PostgreSQL** starts with a `products` table already created
2. **Debezium** connects to PostgreSQL and watches for changes
3. When you insert, update, or delete a product, Debezium captures it
4. The change event goes to **Kafka** topic `dbserver1.public.products`
5. The **Python app** consumes these events and logs them

Here's a simple diagram:

```
PostgreSQL → Debezium → Kafka → Consumer App
   (data)    (capture)  (stream)  (process)
```

## Testing the CDC Pipeline

Let's see CDC in action! First, connect to PostgreSQL:

```bash
docker exec -it cdc-postgres psql -U postgres -d inventory
```

Now, insert a new product:

```sql
INSERT INTO products (name, description, price, is_active) 
VALUES ('Laptop', 'Gaming laptop', 1500.00, TRUE);
```

Check the consumer app logs to see the captured event:

```bash
docker logs -f cdc-app
```

You should see something like:

```json
{"id": 3, "name": "Laptop", "description": "Gaming laptop", "price": 1500.0, "is_active": true}
```

Try updating the product:

```sql
UPDATE products SET price = 1299.00 WHERE name = 'Laptop';
```

And deleting it:

```sql
DELETE FROM products WHERE name = 'Laptop';
```

Each change appears in the logs almost instantly. That's CDC in action!

## Understanding the Database Setup

The PostgreSQL database is configured with a simple `products` table:

```sql
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    is_active BOOLEAN,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The key setting that makes CDC work is `wal_level=logical` in PostgreSQL. This tells PostgreSQL to log changes in a way that Debezium can read.

## The Debezium Connector

Debezium uses a connector configuration to know what to watch. Here's the important part:

```json
{
  "name": "debezium-postgres-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "cdc-postgres",
    "database.dbname": "inventory",
    "table.include.list": "public.products",
    "topic.prefix": "dbserver1"
  }
}
```

This tells Debezium to:
- Connect to the `inventory` database
- Watch the `products` table
- Send events to topics starting with `dbserver1`

## Monitoring Your Pipeline

The project includes Grafana for monitoring. Open your browser and go to:

- **Grafana**: http://localhost:3000 (login: admin/admin)
- **Prometheus**: http://localhost:9090

You can also check the Kafka Connect status:

```bash
curl http://localhost:8083/connectors/debezium-postgres-connector/status
```

## Stopping Everything

When you're done, stop all services:

```bash
docker compose down -v
```

The `-v` flag removes the data volumes too, giving you a clean slate for next time.

## Common Issues and Fixes

**Services not starting?**
Wait a bit longer. Some services depend on others and need time to connect.

**No events appearing?**
Check if the connector is running:
```bash
curl http://localhost:8083/connectors
```

**Consumer not receiving messages?**
Make sure the Schema Registry is healthy:
```bash
curl http://localhost:8081/subjects
```

## What's Next?

Now that you understand the basics, you can:

- Add more tables to watch
- Build your own consumer application
- Connect to a real database
- Add data transformations

CDC is a powerful pattern used by companies like Netflix, Uber, and LinkedIn. Now you have the foundation to build similar systems!

## Wrapping Up

Change Data Capture might sound complex, but with tools like Debezium and Kafka, it's actually quite simple to set up. The hardest part is understanding the concepts, and now you've got that covered.

The project we used is available at [rickseven/cdc-confluent-postgres](https://github.com/rickseven/cdc-confluent-postgres). Feel free to explore the code and modify it for your needs.

Happy coding!
