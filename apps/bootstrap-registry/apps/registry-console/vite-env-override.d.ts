declare module '*.svg' {
  const url: string
  export default url
}

declare module '*.glsl?raw' {
  const source: string
  export default source
}

declare module '*.wasm?init' {
  const init: (imports?: WebAssembly.Imports) => Promise<WebAssembly.Instance>
  export default init
}
