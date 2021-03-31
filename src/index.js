import parseCapabilities from 'desired-capabilities';
import childProcess from 'child_process';
import idbCompanion from './idb_companion.js';

export default {
    // Multiple browsers support
    isMultiBrowser: true,

    currentBrowsers: {},

    async openBrowser (id, pageUrl, browserName) {
        var browserDetails = this._getBrowserDetails(browserName);
        var device = this._getDeviceFromDetails(browserDetails);

        if (device === null)
            throw new Error('Could not find a valid iOS device to test on');

        this.currentBrowsers[id] = device;

        // If the device is not Shutdown we don't know what state it's in - shut it down and reboot it
        if (device.state !== 'Shutdown') // {
            idbCompanion.shutdown(device.udid);

        idbCompanion.boot(device.udid, 60 * 1000);

        childProcess.execSync(`xcrun simctl openurl ${device.udid} ${pageUrl}`, { stdio: 'ignore' });
    },

    async closeBrowser (id) {
        idbCompanion.shutdown(this.currentBrowsers[id].udid);
    },

    // Optional - implement methods you need, remove other methods
    async init () {
        this.availableDevices = this._getAvailableDevices();
    },

    async getBrowserList () {
        return this.availableDevices.map(device => `${device.name}:${device.os} ${device.version}`);
    },

    async isValidBrowserName (browserName) {
        var browserDetails = this._getBrowserDetails(browserName);

        return this._getDeviceFromDetails(browserDetails) !== null;
    },

    async resizeWindow (/* id, width, height, currentWidth, currentHeight */) {
        this.reportWarning('The window resize functionality is not supported by the "ios" browser provider.');
    },

    async takeScreenshot (id, screenshotPath) {
        var command = `xcrun simctl io ${this.currentBrowsers[id].udid} screenshot '${screenshotPath}'`;

        childProcess.execSync(command, { stdio: 'ignore' });
    },

    // Extra methods
    _getBrowserDetails (browserName) {
        return parseCapabilities(browserName)[0];
    },

    _getAvailableDevices () {
        var rawDevices = idbCompanion.list();
        var availableDevices = [];

        for (var entry of rawDevices) {
            var device;

            try {
                var { udid, os_version:osVersion, state, name } = JSON.parse(entry);
            }
            catch (e) {
                // If JSON exception encountered, skip it.
                continue;
            }
            var [ os, version ] = osVersion.split(' ');

            device = { name, os, version, udid, state };

            // We can't run tests on tvOS or watchOS, so only include iOS devices
            if (device.os && device.os.startsWith('iOS'))
                availableDevices.push(device);
        }

        availableDevices.sort((a, b) => {
            return parseFloat(b.version) - parseFloat(a.version);
        });

        return availableDevices;
    },

    _getDeviceFromDetails ({ platform, browserName }) {
        // Do a lowercase match on the device they have asked for so we can be nice about iphone vs iPhone
        platform = platform.toLowerCase();
        browserName = browserName.toLowerCase();

        var device = this.availableDevices.find((d) => {
            return (platform === 'any' || platform === `${d.os} ${d.version}`) &&
                browserName === d.name.toLowerCase();
        });


        if (typeof device === 'undefined')
            return null;
        return device;
    }
};
