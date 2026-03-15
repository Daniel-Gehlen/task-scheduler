class Logger {
  static info(message, data = {}) {
    this._log('INFO', message, data);
  }

  static warn(message, data = {}) {
    this._log('WARN', message, data);
  }

  static error(message, data = {}) {
    this._log('ERROR', message, data);
  }

  static _log(level, message, data) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    if (Object.keys(data).length > 0) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }
}

export default Logger;
