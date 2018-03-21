var types = require('./types')

function _is (type, i) {
  if(i.type !== type)
    throw new Error('expected '+types.names[type]+' but got:'+types.names[i.type])
  return i.value
}

function each (obj, iter) {
  for(var k in obj)
    iter(obj[k], k)
}

function to_u(n) {
  return n < 0 ? Math.abs(n) + Math.pow(2, 31) : n
}

var b4 = new Buffer(4)
var opcodes = require('./index')
var i32_ops = {
  add: function (a, b) {
    return a + b
  },
  sub: function (a, b) {
    return a - b
  },
  mul: function (a, b) {
    return (a * b)|0
  },
  div_s: function (a, b) {
    if(b === 0) throw new Error('divide by zero')
    var r = a / b
    return Math.floor(Math.abs(r))*Math.sign(r)
  },
  div_u: function (a, b) {
    if(b === 0) throw new Error('divide by zero')
    return Math.floor(to_u(a) / to_u(b))|0
  },
  rem_s: function (a, b) {
    if(b === 0) throw new Error('remainder by zero')
    return a % b
  },
  rem_s: function (a, b) {
    if(b === 0) throw new Error('remainder by zero')
    return to_u(a) % to_u(b)
  },

  and: function (a, b) {
    return a & b
  },
  or: function (a, b) {
    return a | b
  },
  xor: function (a, b) {
    return a ^ b
  },
  shl: function (a, b) {
    return a << (b&31)
  },
  shr_u: function (a, b) {
    return to_u(a) >>> (b&31) ///Math.pow(2, to_u(b))
  },
  shr_s: function (a, b) {
    return a >> (b&31)
  },
  eq: function (a, b) {
    return +(a === b)
  },
  ne: function (a, b) {
    return +(a !== b)
  },
  lt_u: function (a, b) {
    return +(to_u(a) < to_u(b))
  },
  lt_s: function (a, b) {
    return +(a < b)
  },
  le_u: function (a, b) {
    return +(to_u(a) <= to_u(b))
  },
  le_s: function (a, b) {
    return +(a <= b)
  },

  gt_u: function (a, b) {
    return +(to_u(a) > to_u(b))
  },
  gt_s: function (a, b) {
    return +(a > b)
  },
  ge_u: function (a, b) {
    return +(to_u(a) >= to_u(b))
  },
  ge_s: function (a, b) {
    return +(a >= b)
  },
  eqz: function (a) {
    return +(a===0)
  }
}

function assert_types(name, fn) {
  var arg_types = opcodes[name].slice(0, -1)
  var result = opcodes[name][opcodes[name].length - 1]
  return function () {
    var args = [].slice.call(arguments)
    if(args.length !== arg_types.length)
      throw new Error('expected:'+arg_types.length+' args, but got:'+args.length)
    return {
      value: fn.apply(null, arg_types.map(function (type, i) {
        return _is(type, args[i])
      })),
      type: result
    }
  }
}

each(i32_ops, function (fn, key) {
  var name = 'i32.'+key
  exports[name] = assert_types(name, fn)
})

exports['i32.trunc_u/f64'] = assert_types('i32.trunc_s/f64', function (a) {
  a = Math.floor(a)
  if(isNaN(a) || a < 0 || !Number.isInteger(a))
    throw new Error('integer result unrepresentable')
  var fa = new Float64Array([a]).buffer
  var ia = new Int32Array(fa)
  if(ia[0])
    throw new Error('integer result unrepresentable')

  return ia[1]
  return a | 0
})

exports['i32.trunc_s/f64'] = assert_types('i32.trunc_s/f64', function (a) {
  a = Math.floor(a)
  if(isNaN(a) || !Number.isInteger(a))
    throw new Error('integer result unrepresentable')
  var fa = new Float64Array([a]).buffer
  var ia = new Int32Array(fa)
  if(ia[0])
    throw new Error('integer result unrepresentable')

  return ia[1]
  return a | 0
})

