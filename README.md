# Setting up Postgres

- `npm i sequelize`
- Create sequelize instance - `new Sequelize`
- Install Postgres w/ Homebrew or (better) install Postgres [here](https://postgresapp.com/)
- Use `psql` command to perform different commands in Postgres
- Create a database w/ the name 'slack':

```
conradknapp=# create database slack;
CREATE DATABASE
```

- Then we can use `\q` to get out of it
- Then we configure Sequelize settings:

```
const Sequelize = require('sequelize');
const sequelize = new Sequelize('slack', 'postgres', 'postgres', {
  dialect: 'postgres'
});
```

- Then create our models folder w/ the desired models:
- We create a file for every single database table and import it into our models object in models/index.js

```
const models = {
  user: sequelize.import('./users'),
  channel: sequelize.import('./channel'),
  member: sequelize.import('./member'),
  message: sequelize.import('./message'),
  team: sequelize.import('./team')
};
```

- We create associations between these tables like so. If there's an associate method or function for each of these models, we call associate:

```
Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});
```

- Then we can export our models from the bottom of the file and then bring them into the index.js file (where our server is running):

```
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
```

- When we're done creating our models, we want to sync it with the database (in index.js)

```
const models = require("./models");

const PORT = 3000;

models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
```

- If you run it and are getting the error `Error: Please install 'pg' module manually`, install the package 'pg' locally w/ `npm i pg`
- If there are any errors in writing our models, we will get an error
- If everything worked successfully, we should get this output:

```
Executing (default): CREATE TABLE IF NOT EXISTS "users" ("id"   SERIAL ,"username" VARCHAR(255) UNIQUE, "email" VARCHAR(255) UNIQUE, "password" VARCHAR(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
...
Listening on PORT 3000
```

- Can enter psql again, use `\c slack;` to connect to our database (w/ whatever name you applied)
- Now we can look at all of our tables with the command `\d`:

```
               List of relations
 Schema |      Name       |   Type   |  Owner
--------+-----------------+----------+----------
 public | channels        | table    | postgres
 public | channels_id_seq | sequence | postgres
 public | member          | table    | postgres
 public | messages        | table    | postgres
 public | messages_id_seq | sequence | postgres
 public | teams           | table    | postgres
 public | teams_id_seq    | sequence | postgres
 public | users           | table    | postgres
 public | users_id_seq    | sequence | postgres
(9 rows)
```

- We can describe individual tables by using `\d <table>`:

```
slack=# \d channels
                                      Table "public.channels"
  Column   |           Type           | Collation | Nullable |    Default
-----------+--------------------------+-----------+----------+--------------------------------------
 id        | integer                  |           | not null | nextval('channels_id_seq'::regclass)
 name      | character varying(255)   |           |          |
 public    | boolean                  |           |          |
 createdAt | timestamp with time zone |           | not null |
 updatedAt | timestamp with time zone |           | not null |
 teamId    | integer                  |           |          |
Indexes:
    "channels_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "channels_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES teams(id) ON UPDATE CASCADE ON DELETE SET NULL
Referenced by:
hannelId") REFERENCES channels(id) ON UPDATE CASCADE ON DELETE SET NULL
```

- If we switch over to our Postgres App, we can see our 'slack' db and click on it to see information about it
- If it's necessary to drop your models, you can use the force option with sync:

```
models.sequelize.sync({ force: start }).then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
```
