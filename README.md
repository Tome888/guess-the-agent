# guess-the-agent
This is a multiplayer game where you join a room and you play 1v1 against a friend by guessing their agent with with q&amp;a, yes/no. 

fe(
    socket.io.client
    toast.noty
)

be(
    socket.io
    express
    sqlite3 
    sqlite
    cors
    zod
    rate-limit
    jwt
)


CREATE-> clicks create button, room is created in db-> gets roomid in url and in token-> token saved in LS-> state on page to validate token-> valid token=stay on page if not rederect to home.
Join-> input roomId or use url to join room-> check if roomId exists in db -> update state with token and userId

