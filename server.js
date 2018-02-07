const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const UsersService = require('./user.service');

const userService = new UsersService();

app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  //miejsce dla funkcji, które zostaną wykonane po podłączeniu klienta

  socket.on('join', function(name){
    console.log('hello user', name)
  // użytkownika, który pojawił się w aplikacji zapisujemy do serwisu trzymającego listę osób w czacie
	  userService.addUser({
	    id: socket.id,
	    name
	  });
	  // aplikacja emituje zdarzenie update, które aktualizuje informację na temat listy użytkowników każdemu nasłuchującemu na wydarzenie 'update'
	  io.emit('update', {
	    users: userService.getAllUsers()
	  });
	});



	socket.on('disconnect', () => {
    userService.removeUser(socket.id);
    socket.broadcast.emit('update', {
      users: userService.getAllUsers()
    });
  });


  socket.on('message', function(message){
    console.log('message!!', message)
    const {name} = userService.getUserById(socket.id);
    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });

  socket.on('typingstart', function(message){
    const {name} = userService.getUserById(socket.id);
    socket.broadcast.emit('typingstart', {
      from: name
    });
  });

  socket.on('typingend', function(message){
    const {name} = userService.getUserById(socket.id);
    socket.broadcast.emit('typingend', {
      from: name
    });
  });



});

server.listen(3000, function(){
  console.log('listening on *:3000');
});
