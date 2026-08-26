# Reach17 API

REST API sviluppata con Node.js, Express e MySQL per la gestione dei corsi della piattaforma Reach17.

## Tecnologie

- Node.js
- Express
- MySQL
- mysql2

## Installazione

```bash
npm install
```

## Avvio

```bash
npm start
```

## Database

Creare il database eseguendo il file:

```
migrations.sql
```

## Endpoints

### Course Types

- GET /course-types
- POST /course-types
- PUT /course-types/:id
- DELETE /course-types/:id

### Courses

- GET /courses
- POST /courses
- PUT /courses/:id
- DELETE /courses/:id

Filtri disponibili:

- /courses?name=...
- /courses?type=...

### Universities

- GET /universities
- POST /universities
- PUT /universities/:id
- DELETE /universities/:id

### Associations

POST /courses/:courseId/universities/:universityId