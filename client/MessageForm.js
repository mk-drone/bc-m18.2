import React, {Component} from 'react';
import styles from './MessageForm.css';
import Rx from "rxjs";

class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }


  componentDidMount(){
    console.log(this.inputField);

    const type$ = Rx.Observable
      .fromEvent(this.inputField, 'keyup')
      .map(event => {
        if(!this.props.typing){
          this.startTyping();
        }
        return event.target.value;
      })
      .debounceTime(600)
      .subscribe( x => {
        console.log('x', x);
        this.stopTyping();
      })
  }


  startTyping(){
    this.props.onMessageStartTyping();
  }

  stopTyping(){
    this.props.onMessageStopTyping();
  }


  handleSubmit(e) {
    e.preventDefault();
    const message = {
      from : this.props.name,
      text : this.state.text
    };
    this.props.onMessageSubmit(message);
    this.setState({ text: '' });
  }

  changeHandler(e) {
    this.setState({ text : e.target.value });
  }

  render() {
    return(
      <form className={styles.MessageForm} onSubmit={e => this.handleSubmit(e)}>
        <input
          className={styles.MessageInput}
          onChange={e => this.changeHandler(e)}
          value={this.state.text}
          placeholder='Message'
          ref = { c => this.inputField = c}
        />
      </form>
    );
  }
}

export default MessageForm;