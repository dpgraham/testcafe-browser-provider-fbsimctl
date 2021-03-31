var childProcess = require('child_process');
var process = require('process');

export default {
    boot (udid, timeout) {
        var { rc, stdout } = this._exec(['--boot', udid], { timeout });

        if (rc !== 0) {
            console.error('Failed to boot simulator');
            console.error(stdout.toString());
            process.exit(rc);
        }
    },
    shutdown (udid, timeout) {
        this._exec(['--shutdown', udid], { timeout });
    },
    list () {
        var { rc, stdout } = this._exec(['--list 1']);

        if (rc === 0)
            return stdout.toString().trim().split('\n');
        return [];
    },
    _exec (args, opts = {}) {
        try {
            var execOpts = { stdio: ['pipe', 'pipe', 'ignore' ] };

            if ('timeout' in opts)
                execOpts['timeout'] = opts.timeout;
            var stdout = childProcess.execSync(`idb_companion ${args.join(' ')}`, execOpts);

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
