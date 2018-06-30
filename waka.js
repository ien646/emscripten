
// Environment setup

function out(x) {
  console.log(x);
}

function err(x) {
  console.warn(x);
}

// Set up memory and table

var memory, table;

function setup(info) {
  memory = new WebAssembly.Memory({ initial: info.memorySize, maximum: info.memorySize });
  table = new WebAssembly.Table({ initial: info.tableSize, maximum: info.tableSize, element: 'anyfunc' });
  var sbrkStart = 2048;
  var sbrkPtr = 16;
  (new Int32Array(memory.buffer))[sbrkPtr >> 2] = sbrkStart;
  return {
    memory: memory,
    table: table,
    stackStart: 1024,
    stackMax: 2048,
    sbrkStart: sbrkStart,
    sbrkPtr: sbrkPtr,
  };
}

// Compile and run

Module['asm'] = function(global, env, buffer) { // XXX rename "startup()"? but various parsing codes...
  console.log('asm1');
  env.memory = memory;
  env.table = table;
  env.memoryBase = 0;
  env.tableBase = 0;
  var info = {
    'env': env,
    'global': { // XXX
      'NaN': NaN,
      'Infinity': Infinity
    }
  };
  fetch('b.wasm', { credentials: 'same-origin' })
    .then(function(response) {
      console.log('asm2');
      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {
      console.log('asm3');
      return new Uint8Array(arrayBuffer);
    })
    .then(function(binary) {
      console.log('asm4');
      console.log(info);
      return WebAssembly.instantiate(binary, info);
    })
    .then(function(pair) {
      console.log('asm5');
      var instance = pair.instance;
      var exports = instance.exports;
      console.log(exports);
      console.log(exports._main());
    });
}

// XXX fix these

var __ATINIT__ = [];

