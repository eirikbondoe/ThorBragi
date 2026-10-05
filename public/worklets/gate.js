class GateProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.env = 0;
    this.threshold = 0;
    this.port.onmessage = (event) => {
      const t = event.data && event.data.threshold;
      if (typeof t === "number") this.threshold = t;
    };
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || !input[0] || !output || !output[0]) return true;
    const src = input[0];
    const dst = output[0];
    const threshold = this.threshold;
    let env = this.env;
    for (let i = 0; i < src.length; i++) {
      const x = src[i];
      env = Math.max(Math.abs(x), env * 0.992);
      const open = threshold <= 0.0001 || env >= threshold;
      dst[i] = open ? x : x * 0.06;
    }
    this.env = env;
    if (output[1] && input[1]) {
      output[1].set(input[1]);
    }
    return true;
  }
}

registerProcessor("lydvenn-gate", GateProcessor);
