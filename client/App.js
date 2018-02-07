import React, { Component } from 'react';
import io from 'socket.io-client';

import styles from './App.css';

import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';


const socket = io('/');


class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      messages: [],
      text: '',
      name: '',
      typing: false

    };
  }

	componentDidMount() {
  	socket.on('message', message => this.messageReceive(message));
  	socket.on('update', ({users}) => this.chatUpdate(users));

    socket.on('typingstart', _ => this.typingstart())
    socket.on('typingstop', _ => this.typingstop())
	}

  onTypingStart(){
    console.log('onTypingStart');
    socket.emit('typingstart');
  }

  onTypingStop(){
    console.log('onTypingStop');
    socket.emit('typingstop');
  }

  typingstart(){
    console.log('typing start');
    this.setState({typing: true})

  }
  typingstop(){
    console.log('tuping stop');
    this.setState({typing: false});
  }

	messageReceive(message) {
  	const messages = [message, ...this.state.messages];
  	this.setState({messages});
	}

	chatUpdate(users) {
  	this.setState({users});
	}

	handleMessageSubmit(message) {
	  const messages = [message, ...this.state.messages];
	  this.setState({messages});
	  socket.emit('message', message);
	}
	
	handleUserSubmit(name) {
	  this.setState({name});
	  socket.emit('join', name);
	}


	render() {
    return this.state.name !== '' ? (
      this.renderLayout()
    ) : this.renderUserForm() // zaimplementowane w późniejszej części
  }

	renderLayout() {
   return (
      <div className={styles.App}>
        <div className={styles.AppHeader}>
          <div className={styles.AppTitle}>
            ChatApp
          </div>
          <div className={styles.AppRoom}>
            App room
          </div>
        </div>
        <div className={styles.AppBody}>
          <UsersList
            users={this.state.users}
          />
          <div className={styles.MessageWrapper}>
            <MessageList
              messages={this.state.messages}
              typing = {this.state.typing}
            />
            <MessageForm
              onMessageSubmit={message => this.handleMessageSubmit(message)}
              name={this.state.name}
              typing={this.state.typing}
              onMessageStartTyping = { _ => this.onTypingStart()}
              onMessageStopTyping = { _ => this.onTypingStop()}

            />
          </div>
        </div>
      </div>
   );
	}

	renderUserForm() {
   return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)} />)
	}
};

export default App;