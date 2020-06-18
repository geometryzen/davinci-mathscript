/* */ 
(function(process) {
  var Stream = require('stream');
  if (process.env.READABLE_STREAM === 'disable' && Stream) {
    module.exports = Stream.Readable;
    Object.assign(module.exports, Stream);
    module.exports.Stream = Stream;
  } else {
    exports = module.exports = require('./lib/_stream_readable');
    exports.Stream = Stream || exports;
    exports.Readable = exports;
    exports.Writable = require('./lib/_stream_writable');
    exports.Duplex = require('./lib/_stream_duplex');
    exports.Transform = require('./lib/_stream_transform');
    exports.PassThrough = require('./lib/_stream_passthrough');
    exports.finished = require('./lib/internal/streams/end-of-stream');
    exports.pipeline = require('./lib/internal/streams/pipeline');
  }
})(require('process'));
