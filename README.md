# testcafe-browser-provider-ios
[![npm](https://img.shields.io/npm/v/testcafe-browser-provider-ios.svg)](https://www.npmjs.com/package/testcafe-browser-provider-ios)

This is the **iOS** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).
It allows you to run mobile Safari tests on iOS Simulators.
It uses Facebook's [idb](https://fbidb.io) to automate iOS Simulators and real devices.

## Getting Started

### Install

```
npm install testcafe-browser-provider-ios
```

### Prerequisites

* This plugin requires that you have XCode.app installed.
* [idb](https://fbidb.io) is used to control the simulators and must be installed and available on your `PATH`.
  ([IDB Installation instructions](https://fbidb.io/docs/installation))

### Usage

When you run tests from the command line, use the `ios` alias when specifying browsers:

```
testcafe ios:device:os 'path/to/test/file.js'
```

where `device` is the name of the simulator to test against. e.g.:
* `iPhone 11`
* `iPad Pro (9.7-inch)`

and `os` is the iOS version something like:
* `iOS 14.3`
* `iOS 13.2`

`os` is optional - if you exclude it then the most recent OS version will be chosen.

#### List available browsers

```
$ testcafe --list-browsers ios
"ios:iPhone 11:iOS 13.3"
"ios:iPad Pro (9.7-inch):iOS 13.3"
"ios:iPhone X - 13.2:iOS 13.2"
"ios:iPhone 11:iOS 13.0"
"ios:iPhone 5s:iOS 12.2"
```

#### Debugging

Run with `DEBUG="testcafe:browser-provider-ios"` to see debug output.

## Running unit tests

```
npm test
```

## Built With

* [Babel](https://babeljs.io)
* [gulp.js](https://gulpjs.com)
* [Mocha](https://mochajs.org)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our process for submitting pull requests to us, and please ensure you follow the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/saucelabs/testcafe-browser-provider-ios/tags).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Thanks to Doug Fitzmaurice [https://www.ents24.com](https://www.ents24.com) for the original work on [testcafe-browser-provider-fbsimctl](https://github.com/Ents24/testcafe-browser-provider-fbsimctl)
