# NC News API

>## Hosted Version:

# https://nc-news-laika.herokuapp.com/


Your clone must include the .env files containing PGDATABASE=(nc_news/ nc_news_test)

These are .gitignored

## Scripts and dependencies:

```
$npm i
$npm i express
$npm i jest -d
$npm i jest supertest
$npm i pg
$npm i dotenv -d
$npm audit fix
```

>## More Info:

`This is an api used to interact with news articles from the nc_news api.
Users can create, upload and download data including comments, topics and articles
from the database.`

This app requires `.env files`, one for test and one for development including: 

PGDATABASE=database_name_here(_test)

These will be used to create and seed the database contents.

    - Node: v16.16.0
    - NPM: v8.11.0



