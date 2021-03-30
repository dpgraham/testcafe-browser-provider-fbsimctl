var idbCompanion = require('../lib/idb_companion.js');
var sinon = require('sinon');
var assert = require('assert');
var process = require('process');
var childProcess = require('child_process');


afterEach(() => {
    sinon.restore();
});

describe('idb_companion', function () {
    describe('#boot()', function () {
        it('should call _exec with correct args', function () {
            var execStub = sinon.stub(idbCompanion, '_exec');

            idbCompanion.boot('device_udid');
            assert(execStub.calledWith('idb_companion --boot device_udid'));
        });
        it('should exit if _exec returns non-zero', function () {
            sinon.stub(idbCompanion, '_exec').returns(64);
            var exitStub = sinon.stub(process, 'exit');

            idbCompanion.boot('device_udid');
            assert(exitStub.calledWith(64));
        });
    });
    describe('#shutdown()', function () {
        it('should call _exec with correct args', function () {
            var execStub = sinon.stub(idbCompanion, '_exec');

            idbCompanion.shutdown('device_udid');
            assert(execStub.calledWith('idb_companion --shutdown device_udid'));
        });
        it('should ignore _exec errors', function () {
            sinon.stub(idbCompanion, '_exec').returns(64);
            var exitStub = sinon.stub(process, 'exit');

            idbCompanion.shutdown('device_udid');
            assert(!exitStub.called());
        });
    });
    describe('#list()', function () {
        it('should call _exec with correct args', function () {
            var execStub = sinon.stub(idbCompanion, '_exec');

            idbCompanion.list();
            assert(execStub.calledWith('idb_companion --list 1'));
        });
        it('should always return an array', function () {
            var execStub = sinon.stub(idbCompanion, '_exec');
            var devices = idbCompanion.list();

            assert(execStub.calledWith('idb_companion --list 1'));
            assert(Array.isArray(devices));

            execStub = sinon.stub(idbCompanion, '_exec').returns(65);
            devices = idbCompanion.list();

            assert(execStub.calledWith('idb_companion --list 1'));
            assert(Array.isArray(devices));
            assert(devices.length === 0);
        });
    });
    describe('#_exec()', function () {
        it('should return with code 64 if idb_companion is not on PATH', function () {
            var resultError = new Error();

            resultError.status = 127;
            sinon.stub(childProcess, 'execSync').throws(resultError);

            var rc = idbCompanion._exec('idb_companion --list 1');

            assert(rc === 64);
        });
        it('should return with code 65 if command times out', function () {
            var timeoutError = new Error();

            timeoutError.errno = 'ETIMEDOUT';
            timeoutError.code = 'ETIMEDOUT';
            sinon.stub(childProcess, 'execSync').throws(timeoutError);

            var rc = idbCompanion._exec('idb_companion --boot udid');

            assert(rc === 65);
        });
        it('should return with code 1 if command exits with unknown error', function () {
            sinon.stub(childProcess, 'execSync').throws(new Error());
            var rc = idbCompanion._exec('idb_companion unsupported_cmd');

            assert(rc === 1);
        });
    });
});
