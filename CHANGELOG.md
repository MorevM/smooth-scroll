

## [2.0.2](https://github.com/MorevM/smooth-scroll/compare/v2.0.1...v2.0.2) (2024-05-21)


### Bug fixes

* Types path within `package.json` ([33c74af](https://github.com/MorevM/smooth-scroll/commit/33c74affdebee863e75cdd18bb83659f76964cd3))

## [2.0.1](https://github.com/MorevM/smooth-scroll/compare/v2.0.0...v2.0.1) (2024-05-21)


### CI improvements

* Include latest changelog entry to GH release :\ ([8ae210c](https://github.com/MorevM/smooth-scroll/commit/8ae210c8fc6e89d0c5dddff7d798e0638da3d3e0))


### Bug fixes

* Expose module types ([3bc68dc](https://github.com/MorevM/smooth-scroll/commit/3bc68dc464cd55d5bbc3e97daaf4535552f63f74))

## [2.0.0](https://github.com/MorevM/smooth-scroll/compare/v1.0.0...v2.0.0) (2024-05-21)


### ⚠ BREAKING CHANGES

* **nuxt:** A new injectable property 'instanceName' (default 'scroller') has been added to allow access to the SmoothScroll instance in the Nuxt plugin. The 'scroll' method is now called 'scrollTo' and can also be configured.
* Exports has been changed. \
`/native` has been renamed to `./smooth-scroll-native`, the default export has been replaced by catch-all export, previous default export is available as `./smooth-scroll`.
* UMD version of the package is no longer exists. Consider using bundler. \
The plugin will also no longer be installed in the Vue global space.
* The package is no longer transpiled and minified. \
Now you have to set the transpiration settings yourself.

### Features

* **nuxt:** Allow access to SmoothScroll instance, allow to change the names ([47175c0](https://github.com/MorevM/smooth-scroll/commit/47175c06ee4bb5491535e4fd7d5235118129d389))

### Refactoring

* Change the export names, use `tsup` as a production version builder ([0487409](https://github.com/MorevM/smooth-scroll/commit/0487409991b13f513c5957793fea824d2e26fd3c))
* Get rid of UMD version and Vue global installation feature ([cc6d3f6](https://github.com/MorevM/smooth-scroll/commit/cc6d3f689e42b998f26407d4bb6a3cd5adba64e8))
* Rewrite the repo to Typescript ([b187c21](https://github.com/MorevM/smooth-scroll/commit/b187c21095c6dbc278c28cc833ecb6a7bbd10f17))


### Bug fixes

* **nuxt:** Ensure Nuxt version is running normally ([f739c6f](https://github.com/MorevM/smooth-scroll/commit/f739c6f4dd7d35eeefecc8a75b5c1f894e44fbc5))


### Chores

* Mark the module as side-effects free ([a5464e1](https://github.com/MorevM/smooth-scroll/commit/a5464e1599f385be827a5990c70d30a9e67e11ea))
* Remove babel and terser ([cb736bb](https://github.com/MorevM/smooth-scroll/commit/cb736bb2777fea688365267f20d4998818838ff3))
* Replace `@morev/helpers` package with updated `@morev/utils` ([b5cb06b](https://github.com/MorevM/smooth-scroll/commit/b5cb06b09f7fac0c6a149eb242cfdee252fe9698))


### CI improvements

* Extract the latest changelog entry to Github Release ([9bcc7db](https://github.com/MorevM/smooth-scroll/commit/9bcc7db536d74d4bef4b38828381a6ff7bbc980e))
* Run actions using Node 20 ([23d0ba3](https://github.com/MorevM/smooth-scroll/commit/23d0ba305c55d5736a3fd07d808e4bd19f9d481a))

## [1.0.0](https://github.com/MorevM/smooth-scroll/compare/v0.1.2...v1.0.0) (2024-01-12)


### ⚠ BREAKING CHANGES

* As updated `@morev/helpers` package includes `ohash` dependency, an additional transpile option may be required.

### Chores

* Upgrade `@morev/helpers` package to latest ([01b06ee](https://github.com/MorevM/smooth-scroll/commit/01b06ee6b2903019a7de3e784529c47244e87ac1))

### [0.1.2](https://github.com/MorevM/smooth-scroll/compare/v0.1.1...v0.1.2) (2022-11-15)


### Chores

* Set fixed version of @nuxt/kit ([0c12270](https://github.com/MorevM/smooth-scroll/commit/0c122707380b476ca69b3dfc7e1266c66f609ed7))

### [0.1.1](https://github.com/MorevM/smooth-scroll/compare/v0.1.0...v0.1.1) (2022-05-29)


### Bug fixes

* Fix `scroll-behavior` CSS property issue ([9fc5dbe](https://github.com/MorevM/smooth-scroll/commit/9fc5dbe11b9d8eeedad89aca23c45c603093ac45))


### Refactoring

* Consistent usage of arrow functions ([1acbc1e](https://github.com/MorevM/smooth-scroll/commit/1acbc1ec3926aed52975b866c14d7cf091059c68))


### Chores

* Setup dependabot ([ecd187e](https://github.com/MorevM/smooth-scroll/commit/ecd187edad95fa2a436a0e0c7fb7bfb72eefa424))
* Update dependencies ([f8226de](https://github.com/MorevM/smooth-scroll/commit/f8226de7b77a23daef4c07dffb5cb8102ddd3927))

## [0.1.0](https://github.com/MorevM/smooth-scroll/compare/v0.0.7...v0.1.0) (2022-05-16)


### Features

* Pass Nuxt module options to SmoothScroll instance ([a65f70c](https://github.com/MorevM/smooth-scroll/commit/a65f70c9574a7d2c9f2c8078096100675ab8428e))


### Chores

* Deps update ([9d567c9](https://github.com/MorevM/smooth-scroll/commit/9d567c9bda9f32cd03bc8573cc797a5f25388bae))

### [0.0.7](https://github.com/MorevM/smooth-scroll/compare/v0.0.6...v0.0.7) (2022-04-26)


### Chores

* Move @babel/runtime to dependencies ([05bf56a](https://github.com/MorevM/smooth-scroll/commit/05bf56a7ed22827b56cb1cfa5b9d97781a4a66ea))

### [0.0.6](https://github.com/MorevM/smooth-scroll/compare/v0.0.5...v0.0.6) (2022-04-26)


### CI improvements

* Explicit registry-url ([3155c0a](https://github.com/MorevM/smooth-scroll/commit/3155c0a12af9904381c1cf6c34e4ee36d505844c))

### 0.0.5 (2022-04-26)


### CI improvements

* Disable testing for a while ([9462e8b](https://github.com/MorevM/smooth-scroll/commit/9462e8bad872148625ece4ec5e570ba1f720e9af))
