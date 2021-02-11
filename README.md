# testcafe-browser-provider-ios
[![npm](https://img.shields.io/npm/v/testcafe-browser-provider-fbsimctl.svg)](https://www.npmjs.com/package/testcafe-browser-provider-ios)

This is the **iOS** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).

It allows you to automate mobile Safari tests.
It uses Facebook's [idb](TODO) (or falls back to[fbsimctl](https://github.com/facebook/FBSimulatorControl/tree/master/fbsimctl)) to with iOS Simulators and real devices.

![animated example of use](http://s3media.ents24.com.s3.amazonaws.com/image/testcafe/testcafe-example-image.gif)

## Install

```
npm install testcafe-browser-provider-ios
```

Requirements:

 * This plugin requires that you have XCode >= 8.2 installed, and the iOS simulator available.
 * [idb](TODO) or [fbsimctl](https://github.com/facebook/FBSimulatorControl/tree/master/fbsimctl) must be installed and available on your `PATH`.
   ([IDB Installation instructions]())
   ([FBSimctl Installation instructions](https://github.com/facebook/FBSimulatorControl/blob/master/fbsimctl/Documentation/Installation.md))

## Usage

When you run tests from the command line, use the alias when specifying browsers:

```
testcafe ios:device:os 'path/to/test/file.js'
```

where `device` is something like:

 * `iPhone 5`
 * `iPhone SE`

and `os` is something like:

 * `iOS 9.2`
 * `iOS 10.2`

 `os` is optional - if you exclude it then the most recent OS version will be chosen.

## Author
 Doug Fitzmaurice [https://www.ents24.com]()
