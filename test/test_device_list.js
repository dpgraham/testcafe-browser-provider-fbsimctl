const assert = require("assert");
const deviceList = require("../lib/device_list.js");
const sortedList = [
    {
        name: "iPhone X",
        os: "iOS",
        version: "14.3",
    },
    {
        name: "iPad Pro (9.7-inch)",
        os: "iOS",
        version: "14.3",
    },
    {
        name: "iPhone 12",
        os: "iOS",
        version: "14.4",
    },
    {
        name: "iPhone X",
        os: "iOS",
        version: "12.0",
    },
];
const rawIdbList =
    `{"model":"iPhone 5s","os_version":"iOS 12.2","udid":"F610650B-2B6F-45D7-9662-FB104B6F711F","architecture":"x86_64","type":"simulator","name":"iPhone 5s","state":"Shutdown"}
{"model":"iPhone 11","os_version":"iOS 13.0","udid":"300B61F9-83D6-47E3-BCBF-1E084596AB82","architecture":"x86_64","type":"simulator","name":"iPhone 11","state":"Shutdown"}
{"model":"iPhone X","os_version":"iOS 13.2","udid":"599BCD4D-9064-4493-96B9-1C687CE244D6","architecture":"x86_64","type":"simulator","name":"iPhone X - 13.2","state":"Shutdown"}
{"model":"Apple TV 4K","os_version":"tvOS 13.3","udid":"E6F65367-C3A4-45A8-A939-A7637488E1F3","architecture":"x86_64","type":"simulator","name":"iPhone 11","state":"Shutdown"}
{"model":"iPhone 11","os_version":"iOS 13.3","udid":"E6F65367-C3A4-45A8-A939-A7637488E1F3","architecture":"x86_64","type":"simulator","name":"iPhone 11","state":"Shutdown"}
{"model":"iPad Pro (9.7-inch)","os_version":"iOS 13.3","udid":"AE4B7B8A-CA48-48C9-8325-B957D95BEBD5","architecture":"x86_64","type":"simulator","name":"iPad Pro (9.7-inch)","state":"Shutdown"}`.split(
        "\n",
    );

describe("device_list", function () {
    describe("#find", function () {
        before(function () {});

        it("should find the latest when any version is provided", function () {
            const device = deviceList.find(sortedList, {
                platform: "any",
                name: "iPhone X",
            });

            assert(device !== null);
            assert(device.version === "14.3");
        });

        it("should find an exact match", function () {
            const device = deviceList.find(sortedList, {
                platform: "iOS 14.3",
                name: "iPad Pro (9.7-inch)",
            });

            assert(device !== null);
            assert(device.name === "iPad Pro (9.7-inch)");
            assert(device.version === "14.3");
        });

        it("should return null if no match found", function () {
            const device = deviceList.find(sortedList, {
                platform: "tvOS 14.3",
                name: "Apple TV 4K",
            });

            assert(device === null);
        });
    });

    describe("#parse", function () {
        it("should return a list of devices sorted by descending versions", function () {
            const parsedList = deviceList.parse(rawIdbList);
            const isSorted = parsedList.every((device, index) => {
                if (index === parsedList.length - 1) return true;
                return (
                    parseFloat(device.version) >=
                    parseFloat(parsedList[index + 1].version)
                );
            });

            assert(parsedList !== null);
            assert(parsedList.length > 0);
            assert(isSorted);
        });

        it("should only include iOS devices", function () {
            const parsedList = deviceList.parse(rawIdbList);
            const onlyIOS = parsedList.every((device) => {
                return device.os === "iOS";
            });

            assert(onlyIOS);
        });

        it("should always return a list", function () {
            const parsedList = deviceList.parse(["not json"]);

            assert(Array.isArray(parsedList));
        });
    });
});
