# webassembly-opcodes

learning web assembly the hard way: by implementing it.

or at least, implementing a subset of it.

this is a work in progress. The plan is to create a handwritten
javascript implementation of all the wasm opcodes,
so that we can run a wat interpreter (useful for debugging)
and also to create a lispy macro language. Then the annoyances
and verbosity of wat can be resolved at compile time,
while staying very close to the underlying model.

## License

MIT
