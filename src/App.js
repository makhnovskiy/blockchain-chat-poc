import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    InputGroup,
    Button,
    Input,
    InputGroupAddon
} from 'reactstrap';

import web3 from './web3';
import deployedMessage from './message';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            initialMessage: null,
            isLoading: false
        };
        this._onMessageSubmit = this._onMessageSubmit.bind(this);

    }

    async componentDidMount() {
        let message = await deployedMessage.methods.messages().call();

        this.setState({
            initialMessage: message
        })

    }

    contractSubmit = async myMessage => {
        //event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        console.log('myMessage', myMessage);

        await deployedMessage.methods.addMessage(myMessage).send({
            from: accounts[0],
            gas: 300000
        });

        const message = await deployedMessage.methods.messages().call();

        console.log('message', message);

        return message;
    }

    async _onMessageSubmit(e) {

        e.stopPropagation();
        e.preventDefault();

        this.setState({
            isLoading: true
        });

        let inputMessage = 'no message entered';
        if (e && e.target && e.target.message && e.target.message.value) {
            inputMessage = e.target.message.value;
        }
        //console.log('e', e.target.message.value);
        let {messages} = this.state;

        document.getElementById("messageForm").reset();

        let contractMessage = await this.contractSubmit(inputMessage);

        this.setState({
            isLoading: false
        });

        let returnedMessage = null;
        if (contractMessage) {
            returnedMessage = contractMessage;
        } else {
            returnedMessage = 'you have been compromised';
        }

        console.log('returnedMessage', returnedMessage);

        let newMessage = {
            name: 'paul',
            message: returnedMessage,
            time: new Date()
        };

        let messageArray = messages;
        messageArray.push(newMessage);

        console.log('messageArray', messageArray);


        this.setState({
            messages: messageArray
        })
    }

    render() {
        let {messages, initialMessage, isLoading} = this.state;
        let {_onMessageSubmit} = this;

        let messageComponent = null;

        if (messages.length > 0) {

            messageComponent = messages.map((message, id) => {
                return (
                    <div className={'chatMessageGroup'} key={id}>
                        <hr/>
                        <p>
                            <span className={'chatName'}>{message.name}</span><br/>
                            <span
                                className={'chatTime'}>{message.time.getMonth() + 1}/{message.time.getDate()} {message.time.getHours()}:{message.time.getMinutes()}:{message.time.getSeconds()}}</span><br/>
                            <span className={'chatMessage'}>{message.message}</span>
                        </p>
                    </div>
                )
            });

        }

        let isLoadingComponent = null;

        if (isLoading === true) {
            isLoadingComponent = (
                <div className={'verifyTransaction'}>Verifying Transaction... Please Wait! </div>
            )
        }

        return (
            <div className="App">
                <header className="App-header">
                    <p>Blockchain Chatting System</p>
                </header>
                {isLoadingComponent}
                <div className={'chatContent'}>
                    {messageComponent}
                </div>
                <footer className="footer">
                    <div className="container">
                        <span className="text-muted">
                            <form onSubmit={_onMessageSubmit} id={'messageForm'}>
                                <InputGroup>
                                    <Input placeholder="" required name={'message'}/>
                                    <InputGroupAddon addonType="append">
                                        <Button type={'submit'} color="secondary">Send!</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </form>
                        </span>
                    </div>
                </footer>
            </div>
        );
    }
}

export default App;

//contract 0xf80389B38e01AEEBb55e707E75E2DAd3373c26FC