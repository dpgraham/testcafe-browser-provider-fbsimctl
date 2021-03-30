var childProcess = require('child_process');
var process = require('process');

export default {
    boot (udid) {
        var { rc, stdout } = this._exec(['--boot', udid]);

        if (rc !== 0) {
            console.error('Failed to boot simulator');
            console.error(stdout.toString());
            process.exit(rc);
        }
    },
    shutdown (udid) {
        this._exec(['--shutdown', udid]);
    },
    list () {
        var { rc, stdout } = this._exec(['--list 1']);

        if (rc === 0)
            return stdout.toString().trim().split('\n');
        return [];
    },
    _exec (args) {
        try {
            var stdout = childProcess.execSync(`idb_companion ${args.join(' ')}`, { stdio: ['pipe', 'pipe', 'ignore'] });

            return { rc: 0, stdout: stdout };
        }
        catch (e) {
            if (e.errno === 'ETIMEDOUT')
                return { rc: 65, stdout: '' };
            if (e.status === 127)
                return { rc: 64, stdout: e.stdout };
            return { rc: 1, stdout: e.stdout };
        }
    },
};
