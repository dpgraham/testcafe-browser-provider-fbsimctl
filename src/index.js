import childProcess from 'child_process';
const debug = require('debug')('ios-provider');

import deviceList from './device_list.js';
import idbCompanion from './idb_companion.js';

export default {
    // Multiple browsers support
    isMultiBrowser: true,

    currentBrowsers: {},

    availableDevices: [],

    _browserNameToDevice (browserName) {
        let [ device, version = '' ] = browserName.split(':'); // eslint-disable-line prefer-const

        if (version === '')
            version = 'any';
        return deviceList.find(this.availableDevices, { name: device, platform: version });
    },

    async openBrowser (id, pageUrl, browserName) {
        debug(`Opening ${browserName}`);
        var device = this._browserNameToDevice(browserName);

        if (device === null)
            throw new Error('Could not find a valid iOS device to test on');

        this.currentBrowsers[id] = device;

        // If the device is not Shutdown we don't know what state it's in - shut it down and reboot it
        if (device.state !== 'Shutdown') {
            debug('Forcing shutdown of device before test');
            idbCompanion.shutdown(device.udid);
        }

        debug(`Booting device (${device.name} ${device.os} ${device.version})`);
        idbCompanion.boot(device.udid, 60 * 1000);

        debug(`Opening url: ${pageUrl}`);
        childProcess.execSync(`xcrun simctl openurl ${device.udid} ${pageUrl}`, { stdio: 'ignore' });
    },

    async closeBrowser (id) {
        idbCompanion.shutdown(this.currentBrowsers[id].udid);
    },

    // Optional - implement methods you need, remove other methods
    async init () {
        debug('Initializing plugin');
        var rawDevices = idbCompanion.list();

        this.availableDevices = deviceList.parse(rawDevices);
        debug(`Found ${this.availableDevices.length} devices`);
    },

    async getBrowserList () {
        return this.availableDevices.map(device => `${device.name}:${device.os} ${device.version}`);
    },

    async isValidBrowserName (browserName) {
        return this._browserNameToDevice(browserName) !== null;
    },

    async resizeWindow (/* id, width, height, currentWidth, currentHeight */) {
        this.reportWarning('The window resize functionality is not supported by the "ios" browser provider.');
    },

    async takeScreenshot (id, screenshotPath) {
        var command = `xcrun simctl io ${this.currentBrowsers[id].udid} screenshot '${screenshotPath}'`;

        childProcess.execSync(command, { stdio: 'ignore' });
    }
};
