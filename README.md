## The Beatles API Documentation

### About

The Beatles API is a database containing all of the original Beatles albums and the anniversary albums (39 in total). The database currently holds 50 of the Beatles songs, but will increase coverage over time. A user can search by albumId or songId and get some simple facts from each album and song. Currently, users can also post and delete songs to the database as well, if they would like.

### Built by:

[Vanessa Randall](https://github.com/vrandall66)

### Installation and Setup

From the command line:

1. `git clone https://github.com/vrandall66/the-beatles-api <PROJECT_NAME>`
1. Run `npm install`
1. Run `nodemon server.js`

In your browser:
Open localhost://3000/

### Documentation:

[Can be found here](https://github.com/vrandall66/the-beatles-api/blob/master/README.md)

### Tech Stack

- JavaScript / Node.js
- Express.js
- PostgreSQL
- Knex.js

### Endpoints

| URL                                                       | Type   | Options                                                                                                                                                                      | Expected response                                                                                                  |
| --------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `https://the-beatles-api.herokuapp.com/api/v1/albums`     | GET    | None                                                                                                                                                                         | ARRAY of all Beatles albums currently in the database                                                              |
| `https://the-beatles-api.herokuapp.com/api/v1/songs`      | GET    | None                                                                                                                                                                         | ARRAY of all Beatles songs currently in the database                                                               |
| `https://the-beatles-api.herokuapp.com/api/v1/albums/:id` | GET    | None                                                                                                                                                                         | OBJECT of album requested by albumId                                                                               |
| `https://the-beatles-api.herokuapp.com/api/v1/songs/:id`  | GET    | None                                                                                                                                                                         | OBJECT of song requested by trackId                                                                                |
| `https://the-beatles-api.herokuapp.com/api/v1/albums/`    | POST   | `{"albumId": <INTEGER>, "albumName": <STRING>, "genre": <STRING>, "releaseDate": <STRING>, "trackCount": <INTEGER> }`                                                        | Add a new album to the database, an example of a successful response can be found below                            |
| `https://the-beatles-api.herokuapp.com/api/v1/songs/`     | POST   | `{"albumName": <STRING>, "discNumber": <INTEGER>, "trackId": <INTEGER>, "trackName": <STRING>, "trackNumber": <INTEGER>, "trackTimeMillis": <INTEGER>, "album": <INTEGER> }` | Add a new song to a pre-existing album within the database, an example of a successful response can be found below |
| `https://the-beatles-api.herokuapp.com/api/v1/albums/:id` | DELETE | `{"albumId": <INTEGER>}`                                                                                                                                                     | `"Album 1234567 sucessfully deleted."`                                                                             |
| `https://the-beatles-api.herokuapp.com/api/v1/songs/:id`  | DELETE | `{"trackId": <INTEGER>}`                                                                                                                                                     | `"Song 1234567 sucessfully deleted."`                                                                              |

#### Example of a POST response to /api/v1/albums

```json
{
  "albumId": 123456789,
  "albumName": "Will This Work?",
  "genre": "Classic Rock",
  "releaseDate": "2000-11-13T08:00:00Z",
  "trackCount": 16
}
```

#### Example of a POST response to /api/v1/songs

```json
{
  "trackId": 1234567,
  "albumName": "Will This Work?",
  "discNumber": 1,
  "trackName": "A NEW SONG!",
  "trackNumber": 12,
  "trackTimeMillis": 123456789,
  "album": 123456789
}
```
