class VoiceShieldAudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0]?.[0];
    const output = outputs[0]?.[0];

    if (input) {
      this.port.postMessage(new Float32Array(input));
      if (output) output.set(input);
    }

    return true;
  }
}

registerProcessor("voiceshield-audio-processor", VoiceShieldAudioProcessor);
