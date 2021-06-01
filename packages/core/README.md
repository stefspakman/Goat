![npm version](https://badgen.net/npm/v/@the-goat/goat?icon=npm)
![npm downloads](https://badgen.net/npm/dt/@the-goat/goat?icon=npm)
![npm weekly downloads](https://badgen.net/npm/dw/@the-goat/goat?icon=npm)
![npm licence](https://badgen.net/npm/license/@the-goat/goat)
![last commit](https://badgen.net//github/last-commit/stefspakman/Goat?icon=github)
![github issues](https://badgen.net//github/issues/stefspakman/Goat?icon=github)
![github stars](https://badgen.net//github/stars/stefspakman/Goat?icon=github)
![David dependencies](https://badgen.net//david/dep/stefspakman/Goat/packages/goat?icon=libraries)
![David devdependencies](https://badgen.net//david/dev/stefspakman/Goat/packages/goat?icon=libraries)

# Goat
Goat is a simple to use taskrunner for frontend development. 

## Why Goat
Instead of defining and maintaining separate setups for compiling, linting and building your code, goat aims to have a predefined, flexible setup that's easy to initialize and to keep up to date. 

## Available Modules
Goat uses module which define tasks. Per project you can choose which tasks you want to use. 

Also goat includes an integrated watch command which combines all watch enabled tasks in one command.

The following modules are already included:
#### Styles
A complete workflow to compile your SASS/SCSS. It Integrates an autoprefixer, compass support and a minifier.
#### Babel
Automatically compile your ES6 to ES5 compatible code. Files suffixed with `.es6.js` will be detected and converted to work according to the defined browser support settings.
#### Eslint
Lint files suffixed with `.es6.js` according to the AirBnB standard
#### Modernizr
Generate custom modernizr.js files by analizing your css and js files.
#### Fractal
Initialize a styleguide using Fractal.

### Using Third party modules
Goat modules are installable directly from Goat itself. By running `goat module add MODULE_NAME`, goat will install the module (npm package) globaly on your system and add it to the configuration. After this, the module can be used on your system. 

## Usage
#### Initialize
To start using goat in your project, just run `goat init`.
#### Check available Tasks
Run `goat` to display the help which lists all the available tasks.
#### Watch project
Run all watch enabled tasks simultaneously typing `goat watch` in your terminal.


## Building a module
Each goat module must include two things.
1. A `goat` property inside the package.json 
  "goat": {
    "name": "Module name",
    "description": "Brief description of the functionality"
  }
2. a entry file which exports a function, this function receives the Goat class, which can be used to build your module.
  ```
    module.exports = function my_module(Goat) {
      return new Goat({
        name: 'My Module',
        command: 'my-module',
        description: 'a example module',
        schema: require('./src/schema'), // localtion of a schema describing the module config
        method: (config) => {
          // method to be executed
        },
        watch: (config) => {
          // Optional method which is executed when the -w flag is added or by running goat watch
          // config includes a event watch property
          const { events } = config;
          events.watch({
            name: 'Watch event',
            pattern: '**/*.s+(a|c)ss',
            events: /file:/,
            method: () => {
              //method to be executed
            },
          });
        },
        init: {
          configuration: require('./init/configuration.json'), // default configuration for your module
        },
      });
    };
  ```

## License

All code released under [MIT]

[mit]: https://github.com/stefspakman/Goat/blob/master/LICENSE
