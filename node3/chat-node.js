require("dotenv").config();
let lotion = require('lotion');
let genesis = require.resolve('./genesis.json');
let lotionPort = 3000;
console.log(process.env);

async function main() {

    let opts = {
        
        lotionPort: lotionPort,
        p2pPort: 46656,
        tendermintPort: 46657,
        initialState: {messages: []},
        keys: 'priv_validator.json',
        peers: ['142.93.247.156:46656','104.248.63.55:46656'],
        genesis: genesis,
        createEmptyBlocks: false,
        logTendermint: true
    };

    let app = lotion(opts);

    let msgHandler = (state, tx) => {
        if (
            typeof tx.sender === 'string' &&
            typeof tx.message === 'string' &&
            tx.message.length <= 50
        ) {
            if (tx.message !== '') {
                state.messages.push({
                    sender: tx.sender,
                    message: tx.message
                });
            }
        }
    }

    app.use(msgHandler);


    app.listen(lotionPort).then(genesis => {
        console.log('connected');
        console.log(genesis);
    }, err => {
        console.log(err);
    })
}

process.on('unhandledRejection', function(reason, p){
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
    console.trace();
});

main()