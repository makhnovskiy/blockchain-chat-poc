import web3 from './web3';

const address = '0x83Dc5439bCD5435632C6a16FCB72BC37485ff193';

const ABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "newMessage",
                "type": "string"
            }
        ],
        "name": "addMessage",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "messages",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

export default new web3.eth.Contract(ABI, address);