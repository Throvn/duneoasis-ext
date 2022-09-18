# Dune Oasis - No Code Dune

![build](https://github.com/chibat/chrome-extension-typescript-starter/workflows/build/badge.svg)

Ready to unleash the full power of dune analytics without a single line of code?

We take the complexity of SQL away to enable Researchers, Economists and everyone who is interested in analyzing crypto to make their own charts. Therefore creating an entirely new customer target group which is not yet targeted by dune.

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Log in on `https://dune.com` and 
## Project Structure

* src/blockly: the blockly library, extended to our custom needs to support SQL statements
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```
npm install
```

## Build

```
npm run build
```

## Build in watch mode

### terminal

```
npm run watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory

## Known issues.

Since the Dune API is so limited that we couldn't use it. We had to come up with a hack. Chrome extensions can bypass all kinds of website security. Thats why we ended up injecting our code into the website `https://dune.com/queries`. Unfortunately it is really messy to implement basic interaction with the gui, and because of different browser specifications it could be the case that the sql statement goes not get run by dune. However, if you open up the console you can still see the genereated SQL statement from the code blocks.