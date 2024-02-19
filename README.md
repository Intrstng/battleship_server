## Websocket battleship server

Implementation **battleship game** backend using websocket

[**Task**](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/battleship/assignment.md)
> Static http server and base task packages. 
> By default WebSocket client tries to connect to the 3000 port.

### Installation
1. Clone/download repo
2. `npm install`

### Usage
**Development**

`npm run start:dev`

* App served @ `http://localhost:8181` with nodemon

**Production**

`npm run start`

* App served @ `http://localhost:8181` without nodemon

---

**All commands**

Command | Description
--- | ---
`npm run start:dev` | App served @ `http://localhost:8181` with nodemon
`npm run start` | App served @ `http://localhost:8181` without nodemon


**Open link `http://localhost:8181` in browser**

### You can also play this game in **multiplayer mode** - just open link `http://localhost:8181` in different PC browsers in one localhost

The program is started by npm script start in following way:
- All requests and responses must be sent as JSON string
- After starting the program displays websocket parameters
- After program work finished the program should end websocket work correctly
- After each received command program should display the command and result

## The backend has 3 types of response:
1. **personal response**
    - **reg** - player registration/login
2. **response for the game room**
    - **create_game** - game id and player id (unique id for user in this game)
    - **start_game** - information about game and player's ships positions
    - **turn** - who is shooting now
    - **attack** - coordinates of shot and status
    - **finish** - id of the winner
3. **response for all**
    - **update_room** - list of rooms and players in rooms
    - **update_winners** - send score table to players

## Game description
1. Server has in memory DB with player data (login and password) storage
2. Player can create game room or connect to the game room after login
3. Player room data (players, game board, ships positions) storages in the server
4. Game starts after 2 players are connected to the room and sent ships positions to the server
5. Server sends move order
6. Players should shoot in theirs turn
7. Server send back shot result
8. If player hits or kills the ship, player should make one more shoot
9. Player wins if he has killed all enemies ships