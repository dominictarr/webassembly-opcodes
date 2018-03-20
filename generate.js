var types = require('./types')
var opcodes = require('./index')

function toWat (name, args) {
  var args = args.slice()
  var result = args.pop()
  var _name = name.replace('.', '__').replace('/', '___')
  return '  (func $'+
    _name + ' ' +
    args.map(function (type, i) {
      return '(param $arg_'+i + ' ' + types.names[type]+')'
    }).join(' ') + ' ' +
    (result === types.none ? '' : '(result '+ types.names[result]+')\n' ) +
    '    ('+name + ' ' + args.map(function (_, i) {
      return '(get_local $arg_'+i+')'
    }).join(' ') + ')\n' +
    '  )\n' +
    '  (export "'+_name+'" (func $'+_name+'))\n'
}

console.log('(module')

for(var k in opcodes) {
  if(!~opcodes[k].indexOf(types.type) && !~opcodes[k].indexOf(types.number))
    console.log(toWat(k, opcodes[k]))
}
console.log(')')

