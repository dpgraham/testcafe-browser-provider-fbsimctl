const idbCompanion = require("../../src/idb_companion.js");
const sinon = require("sinon");
const assert = require("assert");
const process = require("process");
const childProcess = require("child_process");

describe("idb_companion", function () {
  afterEach(function () {
    sinon.restore();
  });

  describe("#boot()", function () {
    it("should call _exec with correct args", async function () {
      const execStub = sinon
        .stub(idbCompanion, "_exec")
        .resolves({ rc: 0, stdout: "" });

      await idbCompanion.boot("device_udid");
      assert(execStub.calledWith(["--boot", "device_udid"]));
    });

    it("should exit if _exec returns non-zero", async function () {
      sinon.stub(idbCompanion, "_exec").rejects({ rc: 64, stdout: "" });
      const exitStub = sinon.stub(process, "exit");

      try {
        await idbCompanion.boot("device_udid");

        assert(false);
      } catch (e) {
        assert(exitStub.calledWith(64));
      }
    });
  });

  describe("#shutdown()", function () {
    it("should call _exec with correct args", async function () {
      const execStub = sinon
        .stub(idbCompanion, "_exec")
        .resolves({ rc: 0, stdout: "" });

      await idbCompanion.shutdown("device_udid");
      assert(execStub.calledWith(["--shutdown", "device_udid"]));
    });
  });

  describe("#list()", function () {
    it("should call _exec with correct args", async function () {
      const execStub = sinon
        .stub(idbCompanion, "_exec")
        .resolves({ rc: 0, stdout: "" });

      await idbCompanion.list();
      assert(execStub.calledWith(["--list 1"]));
    });

    it("should always return an array", async function () {
      sinon.stub(idbCompanion, "_exec").resolves({ rc: 0, stdout: "" });
      const devices = await idbCompanion.list();

      assert(Array.isArray(devices));
    });

    it("should return an empty array if _exec errors", async function () {
      sinon.stub(idbCompanion, "_exec").rejects({ rc: 65, stdout: "" });
      const devices = await idbCompanion.list();

      assert(Array.isArray(devices));
      assert(devices.length === 0);
    });
  });

  describe("#_exec()", function () {
    it("should return with code 64 if idb_companion is not on PATH", async function () {
      const resultError = new Error();

      resultError.code = 127;
      sinon.stub(childProcess, "exec").yields(resultError, "", "");

      try {
        var { rc, stdout } = await idbCompanion._exec(["--list 1"]);
      } catch (e) {
        assert(e.rc === 64);
      }
      assert(typeof rc === "undefined");
      assert(typeof stdout === "undefined");
    });

    it("should return with code 65 if command times out", async function () {
      const timeoutError = new Error();

      timeoutError.killed = true;
      timeoutError.signal = "SIGKILL";
      sinon.stub(childProcess, "exec").yields(timeoutError);

      try {
        var { rc, stdout } = await idbCompanion._exec(["--boot", "udid"]);
      } catch (e) {
        assert(e.rc === 65);
      }
      assert(typeof rc === "undefined");
      assert(typeof stdout === "undefined");
    });

    it("should return with code 1 if command exits with unknown error", async function () {
      sinon.stub(childProcess, "exec").yields(new Error());
      try {
        var { rc, stdout } = await idbCompanion._exec(["unsupported_cmd"]);
      } catch (e) {
        assert(e.rc === 1);
      }
      assert(typeof rc === "undefined");
      assert(typeof stdout === "undefined");
    });

    it("should not set timeout if options are not provided", async function () {
      const execStub = sinon.stub(childProcess, "exec").yields(null);

      await idbCompanion._exec(["some", "args"]);
      const options = execStub.firstCall.args[1];

      assert(!("timeout" in options));
    });

    it("should set timeout if provided", async function () {
      const execStub = sinon.stub(childProcess, "exec").yields(null);

      await idbCompanion._exec(["some", "args"], { timeout: 100 });
      const options = execStub.firstCall.args[1];

      assert("timeout" in options);
      assert(options.timeout === 100);
    });
  });
});
