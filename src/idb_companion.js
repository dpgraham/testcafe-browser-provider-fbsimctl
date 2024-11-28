const childProcess = require("child_process");
const debug = require("debug")("testcafe:browser-provider-ios");
const process = require("process");

export default {
  async boot(udid, timeout) {
    try {
      await this._exec(["--boot", udid], { timeout });
    } catch (e) {
      console.error("Failed to boot simulator");
      console.error(e.stdout.toString());
      process.exit(e.rc);
    }
  },
  async shutdown(udid, timeout) {
    try {
      await this._exec(["--shutdown", udid], { timeout });
      // eslint-disable-next-line no-empty, no-unused-vars
    } catch (e) {}
  },
  async list() {
    try {
      const response = await this._exec(["--list 1"]);

      return response.stdout.toString().trim().split("\n");
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return [];
    }
  },
  async _exec(args, opts = {}) {
    return new Promise((resolve, reject) => {
      const execOpts = { killSignal: "SIGKILL" };

      if ("timeout" in opts) execOpts["timeout"] = opts.timeout;
      childProcess.exec(
        `idb_companion ${args.join(" ")}`,
        execOpts,
        (error, stdout, stderr) => {
          if (error !== null) {
            // This is not an exact way of detecting a timeout.
            // afaict, there's no reliable way to know whether the process timed out.
            if (error.killed === true && error.signal === "SIGKILL") {
              debug("_exec errored with timeout");
              reject({ rc: 65, stdout, stderr });
              return;
            }
            if (error.code === 127) {
              debug("_exec could not find idb_companion");
              reject({ rc: 64, stdout, stderr });
              return;
            }
            debug("_exec exited with unknown error");
            reject({ rc: 1, stdout, stderr });
            return;
          }
          resolve({ rc: 0, stdout, stderr });
        },
      );
    });
  },
};
