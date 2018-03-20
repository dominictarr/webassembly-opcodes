//taken from http://webassembly.org/docs/semantics/
var types = require('./types')

var i32 = types.i32
var i64 = types.i64
var f32 = types.f32
var f64 = types.f64
var label = types.label
var number = types.number
var type = types.type
var none = types.none

var int = {
    'add': 2, //sign-agnostic addition
    'sub': 2, //sign-agnostic subtraction
    'mul': 2, //sign-agnostic multiplication (lower 32-bits)
    'div_s': 2, //signed division (result is truncated toward zero)
    'div_u': 2, //unsigned division (result is floored)
    'rem_s': 2, //signed remainder (result has the sign of the dividend)
    'rem_u': 2, //unsigned remainder
    'and': 2, //sign-agnostic bitwise and
    'or': 2, //sign-agnostic bitwise inclusive or
    'xor': 2, //sign-agnostic bitwise exclusive or
    'shl': 2, //sign-agnostic shift left
    'shr_u': 2, //zero-replicating (logical) shift right
    'shr_s': 2, //sign-replicating (arithmetic) shift right
    'rotl': 2, //sign-agnostic rotate left
    'rotr': 2, //sign-agnostic rotate right
    'clz': 1, //sign-agnostic count leading zero bits (All zero bits are considered leading if the value is zero)
    'ctz': 1, //sign-agnostic count trailing zero bits (All zero bits are considered trailing if the value is zero)
    'popcnt': 1, //sign-agnostic count number of one bits
}

var int_bool = {
    'eq': 2, //sign-agnostic compare equal
    'ne': 2, //sign-agnostic compare unequal
    'lt_s': 2, //signed less than
    'le_s': 2, //signed less than or equal
    'lt_u': 2, //unsigned less than
    'le_u': 2, //unsigned less than or equal
    'gt_s': 2, //signed greater than
    'ge_s': 2, //signed greater than or equal
    'gt_u': 2, //unsigned greater than
    'ge_u': 2, //unsigned greater than or equal
//    'eqz': 1, //compare equal to zero (return 1 if operand is zero, 0 otherwise)
}

var float = {
    add: 2, //addition
    sub: 2, //subtraction
    mul: 2, //multiplication
    div: 2, //division
    abs: 1, //absolute value
    neg: 1, //negation
    copysign: 2, //copysign
    ceil: 1, //ceiling operator
    floor: 1, //floor operator
    trunc: 1, //round to nearest integer towards zero
    nearest: 1, //round to nearest integer, ties to even
    sqrt: 1, //square root
    min: 2, //minimum (binary operator); if either operand is NaN, returns NaN
    max: 2, //maximum (binary operator); if either operand is NaN, returns NaN
}

var float_bool = {
    eq: 2, //compare ordered and equal
    ne: 2, //compare unordered or unequal
    lt: 2, //compare ordered and less than
    le: 2, //compare ordered and less than or equal
    gt: 2, //compare ordered and greater than
    ge: 2, //compare ordered and greater than or equal

}


module.exports = {
/*
    'i32.load8_s': [i32, i32], //load 1 byte and sign-extend i8 to i32
    'i32.load8_u': [i32, i32], //load 1 byte and zero-extend i8 to i32
    'i32.load16_s': [i32, i32], //load 2 bytes and sign-extend i16 to i32
    'i32.load16_u': [i32, i32], //load 2 bytes and zero-extend i16 to i32
    'i32.load': [i32, i32], //load 4 bytes as i32
    'i64.load8_s': [i32, i64], //load 1 byte and sign-extend i8 to i64
    'i64.load8_u': [i32, i64], //oad 1 byte and zero-extend i8 to i64
    'i64.load16_s': [i32, i64], //load 2 bytes and sign-extend i16 to i64
    'i64.load16_u': [i32, i64], //load 2 bytes and zero-extend i16 to i64
    'i64.load32_s': [i32, i64], //load 4 bytes and sign-extend i32 to i64
    'i64.load32_u': [i32, i64], //load 4 bytes and zero-extend i32 to i64
    'i64.load': [i32, i64], //load 8 bytes as i64
    'f32.load': [i32, f32], //load 4 bytes as f32
    'f64.load': [i32, f64], //load 8 bytes as f64

    'i32.const': [number, i32],
    'i64.const': [number, i64],
    'f32.const': [number, f32],
    'f64.const': [number, f64],

    'i32.store8': [i32, i32, none], //wrap i32 to i8 and store 1 byte
    'i32.store16': [i32, i32, none], //wrap i32 to i16 and store 2 bytes
    'i32.store': [i32, i32, none], //(no conversion) store 4 bytes
    'i64.store8': [i32, i32, none], //wrap i64 to i8 and store 1 byte
    'i64.store16': [i32, i32, none], //wrap i64 to i16 and store 2 bytes
    'i64.store32': [i32, i32, none], //wrap i64 to i32 and store 4 bytes
    'i64.store': [i32, i64, none], //(no conversion) store 8 bytes
    'f32.store': [i32, f32, none], //(no conversion) store 4 bytes
    'f64.store': [i32, f64, none], //(no conversion) store 8 bytes
*/
//    'grow_memory': [i32, i32],
//    'current_memory': [i32],
    //these ones are weird...
    /*
    nop: [], //no operation, no effect
    block: [],//the beginning of a block construct, a sequence of instructions with a label at the end
    loop: [],//a block with a label at the beginning which may be used to form loops
    if: [],//the beginning of an if construct with an implicit then block
    else: [],//marks the else block of an if
    br: [],//branch to a given label in an enclosing construct
    br_if: [],//conditionally branch to a given label in an enclosing construct
    br_table: [],//a jump table which jumps to a label in an enclosing construct
    return: [],//return zero or more values from this function
    end: [],//an instruction that marks the end of a block, loop, if, or function
    */

    'i32.wrap/i64': [i64, i32], //wrap a 64-bit integer to a 32-bit integer
    'i32.trunc_s/f32': [f32, i32], //truncate a 32-bit float to a signed 32-bit integer
    'i32.trunc_s/f64': [f64, i32], //truncate a 64-bit float to a signed 32-bit integer
    'i32.trunc_u/f32': [f32, i32], //truncate a 32-bit float to an unsigned 32-bit integer
    'i32.trunc_u/f64': [f64, i32], //truncate a 64-bit float to an unsigned 32-bit integer
    'i32.reinterpret/f32': [f32, i32], //reinterpret the bits of a 32-bit float as a 32-bit integer
    'i64.extend_s/i32': [i32, i64], //extend a signed 32-bit integer to a 64-bit integer
    'i64.extend_u/i32': [i32, i64], //extend an unsigned 32-bit integer to a 64-bit integer
    'i64.trunc_s/f32': [f32, i64], //truncate a 32-bit float to a signed 64-bit integer
    'i64.trunc_s/f64': [f64, i64], //truncate a 64-bit float to a signed 64-bit integer
    'i64.trunc_u/f32': [f32, i64], //truncate a 32-bit float to an unsigned 64-bit integer
    'i64.trunc_u/f64': [f64, i64], //truncate a 64-bit float to an unsigned 64-bit integer
    'i64.reinterpret/f64': [f64, i64], //reinterpret the bits of a 64-bit float as a 64-bit integer
    'f32.demote/f64': [f64, f32], //demote a 64-bit float to a 32-bit float
    'f32.convert_s/i32': [i32, f32], //convert a signed 32-bit integer to a 32-bit float
    'f32.convert_s/i64': [i64, f32], //convert a signed 64-bit integer to a 32-bit float
    'f32.convert_u/i32': [i32, f32], //convert an unsigned 32-bit integer to a 32-bit float
    'f32.convert_u/i64': [i64, f32], //convert an unsigned 64-bit integer to a 32-bit float
    'f32.reinterpret/i32': [i32, f32], //reinterpret the bits of a 32-bit integer as a 32-bit float
    'f64.promote/f32': [f32, f64], //promote a 32-bit float to a 64-bit float
    'f64.convert_s/i32': [i32, f64], //convert a signed 32-bit integer to a 64-bit float
    'f64.convert_s/i64': [i64, f64], //convert a signed 64-bit integer to a 64-bit float
    'f64.convert_u/i32': [i32, f64], //convert an unsigned 32-bit integer to a 64-bit float
    'f64.convert_u/i64': [i64, f64], //convert an unsigned 64-bit integer to a 64-bit float
    'f64.reinterpret/i64': [i64, f64], //reinterpret the bits of a 64-bit integer as a 64-bit float
    'drop': [type, none],
    'select': [i32, type, type, type],
}

for(var k in int)
  module.exports['i32.'+k] = int[k] == 2 ? [i32, i32, i32] : [i32, i32]
for(var k in int_bool)
  module.exports['i32.'+k] = [i32, i32, i32]
module.exports['i32.eqz'] = [i32, i32]

for(var k in int)
  module.exports['i64.'+k] = int[k] == 2 ? [i64, i64, i64] : [i64, i64]
for(var k in int_bool)
  module.exports['i64.'+k] = [i64, i64, i32]
module.exports['i64.eqz'] = [i64, i32]


for(var k in float)
  module.exports['f32.'+k] = float[k] == 2 ? [f32, f32, f32] : [f32, f32]
for(var k in float_bool)
  module.exports['f32.'+k] = [f32, f32, i32]
//module.exports['f32.eqz'] = [f32, i32]

for(var k in float)
  module.exports['f64.'+k] = float[k] == 2 ? [f64, f64, f64] : [f64, f64]
for(var k in float_bool)
  module.exports['f64.'+k] = [f64, f64, i32]
//module.exports['f64.eqz'] = [f64, i32]

if(!module.parent)
  console.log(module.exports)

