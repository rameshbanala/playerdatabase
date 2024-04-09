const express = require('express')
const app = express()

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')

let db = null

app.use(express.json())

const dbpath = path.join(__dirname, 'cricketTeam.db')

const initializeTheDbandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('started ar http://localhost:3000/')
    })
  } catch (e) {
    console.log(`error : ${e.message}`)
    process.exit(1)
  }
}

initializeTheDbandServer()

//api-1

app.get('/players/', async (request, response) => {
  let getPlayersQuery = `
    SELECT *
    FROM cricket_team
    ;
  `
  let playersDetails = await db.all(getPlayersQuery)
  response.send(playersDetails)
})

//api-2

app.post('/players/', async (request, response) => {
  let playerDetails = request.body
  let {playerName, jerseyNumber, role} = playerDetails
  let insertQuery = `
    INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES 
    (
        '${playerName}',
        ${jerseyNumber},
        '${role}'
    );
  `
  let insertResponse = await db.run(insertQuery)

  response.send(`Player Added to Team`)
})

//api-3 get player details

app.get('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  let getDetailsQuery = `
    SELECT
     *
    FROM
     cricket_team
    WHERE
     player_id = ${playerId};
  `
  let detailsRes = await db.get(getDetailsQuery)
  response.send(detailsRes)
})

//api-4 put the value

app.put('/players/:playerId', async (request, response) => {
  let {playerId} = request.params
  let playerDetails = request.body
  let {playerName, jerseyNumber, role} = playerDetails
  let updateQuery = `
    UPDATE cricket_team
    SET 
      player_name = '${playerName}',
      jersey_number = ${jerseyNumber},
      role = '${role}'
    WHERE player_id = ${playerId};
  `
  await db.run(updateQuery)
  response.send('Player Details Updated')
})

//api-5 delete the player

app.delete('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params

  let deleteQuery = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};
  `
  await db.run(deleteQuery)
  response.send('Player Removed')
})

module.exports = app
