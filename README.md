Buoy
====

Simple distributed Continuous Integration server that plays well with Mocha. 

Installation
============

```
  npm install buoy
```

Running the Buoy Server
=======================

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

Running the Buoy Reporter (CLI)
===============================


