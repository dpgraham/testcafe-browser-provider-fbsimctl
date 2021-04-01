export default {
    find (list, { platform, name }) {
        // Do a lowercase match on the device they have asked for so we can be nice about iphone vs iPhone
        platform = platform.toLowerCase();
        name = name.toLowerCase();

        const device = list.find((d) => {
            return (platform === 'any' || platform === `${d.os} ${d.version}`) &&
                name === d.name.toLowerCase();
        });

        if (typeof device === 'undefined')
            return null;
        return device;
    },

    get (rawList) {
        const parsedList = [];

        for (const entry of rawList) {
            try {
                var { udid, os_version:osVersion, state, name } = JSON.parse(entry);
            }
            catch (e) {
                continue;
            }
            const [ os, version ] = osVersion.split(' ');
            const device = { name, os, version, udid, state };

            // We can't run tests on tvOS or watchOS, so only include iOS devices
            if (device.os && device.os.startsWith('iOS'))
                parsedList.push(device);
        }

        return parsedList.sort((a, b) => {
            return parseFloat(b.version) - parseFloat(a.version);
        });
    }
};
