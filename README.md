# Buoy

Simple distributed Continuous Integration server that plays well with Mocha. 

## Installation

```
npm install buoy
```

## Running the Buoy Server

Running the `buoyd` command will automatically run a HTTP interface on port 8888. Reporters can retrieve build information and report test results on this port too. By default, buoyd will look for Git changes on the master branch of your current Git checkout:


```
$ buoyd
Generating build events when new commits are detected on the master branch
Buoy Server running on port 8888
```

Configuration:

```
Usage: buoyd [options]

Options:

  -h, --help                            output usage information
  -V, --version                         output the version number
  -p, --port <PORT>                     Port to bind HTTP server to (Default: 8888)
  -g, --git-path <PATH>                 Specify path to Git checkout to monitor for changes
  -b, --git-branch <PATH>               What branch to monitor for changes? (Default: master)
  -ghu, --github-url <URL>              URL of your Github repository (for linking)
  -cs, --campfire-subdomain <USERNAME>  Subdomain/account for Campfire Notifier
  -ct, --campfire-token <TOKEN>         Token for Campfire Notifier
  -cr, --campfire-room <ROOM>           Room ID for Campfire Notifier
  -i, --interval <SECONDS>              Run tests periodically

```

## Running the Buoy Reporter (CLI)

You can use the `buoy` command to continuously run a list of Mocha tests. The Buoy Reporter will connect to the Buoy Server and wait for commands (new commits, manual rebuilds, etc.), once a new build command is received, the tests will run and results will be submitted back to the server.

Example:

```
$ buoy --ci-server http://localhost:8888 examples/my-project/test/*.js
[365922256fa5962a5c12e838f603b12b0067d01e] Ran 3 tests (1 failures). Submitting results to http://localhost:8888
```

Configuration:

```
Usage: buoy [options] [files]

Options:

  -h, --help             output usage information
  -V, --version          output the version number
  -c, --ci-server <URL>  Buoy CI Server URL

```

## Running the Buoy Reporter (Browser)

Coming Soon!

## License

(The MIT License)

Copyright © 2013 Dominiek ter Heide <hello@dominiek.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.





