const EventEmitter = require('events');

// uuid model created when adding node to this project (ex: npm init)
  // uuid creates a random universal unique identifier
const uuid = require('uuid');

// uuid has different versions, but it generates a unique identifier 
console.log(uuid.v4());

class Logger extends EventEmitter {
  // this log method will take a message 
  // when it's called, it'll call/raise an event
  log(msg) {
    this.emit('message', { id: uuid.v4(), msg });   
  }
}

// only need this if we're using this in a separate file/class
// module.exports = Logger;

const logger = new Logger();

logger.on('message', (data) => console.log('Called Listener', data));

logger.log('Hello World');
logger.log('Hi');
logger.log('Hello');