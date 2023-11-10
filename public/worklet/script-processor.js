// ref - https://gist.github.com/louisgv/f210a1139d955baf511ff35f58fc8db1#file-recorder-worklet-js
/**
  An in-place replacement for ScriptProcessorNode using AudioWorklet
*/
class ScriptProcessor extends AudioWorkletProcessor {
  // 0. Determine the buffer size (this is the same as the 1st argument of ScriptProcessor)
  bufferSize = 2048;
  // 1. Track the current buffer fill level
  _bytesWritten = 0;

  // 2. Create a buffer of fixed size
  _buffer = new Float32Array(this.bufferSize);

  constructor() {
    super();
    this.initBuffer();
  }

  initBuffer() {
    this._bytesWritten = 0;
  }

  isBufferEmpty() {
    return this._bytesWritten === 0;
  }

  isBufferFull() {
    return this._bytesWritten === this.bufferSize;
  }

  /**
   * @param {Float32Array[][]} inputs
   * @returns {boolean}
   */
  process(inputs, outputs, parameters) {
    // Grabbing the 1st channel similar to ScriptProcessorNode
    this.append(inputs[0][0]);

    return true;
  }

  /**
   *
   * @param {Float32Array} channelData
   */
  append(channelData) {
    if (this.isBufferFull()) {
      this.flush();
    }

    if (!channelData) return;

    for (let i = 0; i < channelData.length; i++) {
      this._buffer[this._bytesWritten++] = channelData[i];
    }
  }

  flush() {
    // trim the buffer if ended prematurely
    this.port.postMessage(
      this._bytesWritten < this.bufferSize
        ? this._buffer.slice(0, this._bytesWritten)
        : this._buffer
    );
    this.initBuffer();
  }
}

registerProcessor("script-processor", ScriptProcessor);