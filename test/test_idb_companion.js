// var assert = require('assert');

describe('idb_companion', function () {
    describe('#boot()', function () {
        it('should call _exec with correct args', function () {
        });
        it('should exit if _exec returns non-zero', function () {
        });
    });
    describe('#shutdown()', function () {
        it('should call _exec with correct args', function () {
        });
        it('should ignore _exec errors', function () {
        });
    });
    describe('#list()', function () {
        it('should call _exec with correct args', function () {
        });
        it('should always return an array', function () {
        });
    });
    describe('#_exec()', function () {
        it('should return with code 64 if idb_companion is not on PATH', function () {
        });
        it('should return with code 65 if command times out', function () {
        });
        it('should return with code 1 if command exits with unknown error', function () {
        });
    });
});
