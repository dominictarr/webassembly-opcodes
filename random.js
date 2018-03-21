

var fs = require('fs'), path = require('path')
var wasm = fs.readFileSync(path.join(__dirname, './raw.wasm'))
var cartesian = require('cartesian')

//var memory = new WebAssembly.Memory({initial:1, maximum:1})

//console.log(memory.buffer)
var crypto = require('crypto')

var numbers = {
  i32: [0, 1,  17, 37, 42, 1 << 16, ~(1<<32)],
  f64: [0, -1, 1, Number.MAX_SAFE_INTEGER, 0.5, 0.00001, 0.3/0.2,  Math.PI, Math.LN2, Number.MIN_SAFE_INTEGER, Number.MAX_VALUE, Number.MIN_VALUE, NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
}

var random = {
  i32: function (e) {
    return crypto.randomBytes(4).readInt32BE(0)
  },
  f64: function (e) {
    return (Math.random()-0.5)*2000
//    try {
//      return crypto.randomBytes(8).readFloatBE(0)
//    } catch (_) {
//      return random.f64()
//    }
  }
}

var opcodes = require('./')
var types = require('./types')
var javascript = require('./javascript')

var wrapped = {}

function wrap (name) {
  return function () {
    return javascript[name]
      .apply(null,
        [].map.call(arguments, function (v, i) {
          return {type: opcodes[name][i], value: v}
        })
      )
  }
}
for(var name in javascript) {
  var _name = name.replace('.', '__').replace('/','___')
  wrapped[_name] = wrap(name)
}

console.log(wrapped, javascript)

function test (wasm, name) {
  if(!opcodes[name].every(function (type) {
    return random[types.names[type]]
  })) return

  var _name = name.replace('.', '__').replace('/','___')
  var fn = wasm[_name]

  var inputs = cartesian(opcodes[name].slice(0, -1).map(function (type) {
    return numbers[types.names[type]]
  })).map(function (args) {
    try {
      var r = fn.apply(null, args)
//      console.log('('+name+' '+args.join(' ')+') === ', r)
    } catch (err) {
  //    console.log('('+name+' '+args.join(' ')+') throws ', '"'+err.message+'"')
    //  console.log(err.message)
      var t = err
    }
    if(wrapped[_name]) {
      try {
        var _r = wrapped[_name].apply(null, args)
      } catch (err) {
        var _t = err
      }
      if(t || _t) {
      if(!_t) {
        console.log('JAVASCRIPT:', name, args, _t ? '"'+_t.message+'"' : _r, t ? '"'+t.message+'"' : r)
        throw new Error('expected javascript implementation to throw:' + t.message)
      }
      else if(!t) {
        console.log('JAVASCRIPT:', name, args, _t ? '"'+_t.message+'"' : _r, t ? '"'+t.message+'"' : r)
        throw new Error('javascript threw:'+_t.message+' when wasm returned:'+r)
      }
      else if(_t.message != t.message) {
          throw new Error('javascript implementation of:'+name+' incorrect, expected:"'+t.message+'", got:"'+_t.message+'"')
        }
      }
      else {
        if(_r.value !== r) {
          console.log('JAVASCRIPT:', name, args, _t ? '"'+_t.message+'"' : _r, t ? '"'+t.message+'"' : r)
          console.error('javascript implementation of:'+name+' incorrect, expected:'+r+', got:'+_r.value)
        }
      }
    }
  })
  

}

var p = WebAssembly.instantiate(wasm)
.catch(function (err) { throw err })
.then(function (obj) {
//  console.log(obj.instance.exports)
  setImmediate(function () {
    for(var k in opcodes) {
      test(obj.instance.exports, k)
    }
  })
})
