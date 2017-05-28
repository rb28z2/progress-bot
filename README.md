# progress-bot
High-tech weaponized moe progress delivery bot for IRC and web

# Installation
##### Requirements
* nodejs
* npm

##### Instructions
`npm install` to install the dependencies. Then, `mv config-default.js config.js`. Edit the config.js file to suit your needs and run the bot with `node irc.js`.

##### Compatibility
In theory, this should work anywhere node works. However I've only tested it on Linux (Ubuntu 16.04).

# Usage
##### Available commands and syntax


| Command       | Syntax             | Example                  |
| ------------- | -----------------  | ------------------------ |
| Title         | `title <string>`   | `title A very cool show` |
| Episode       | `episode <string>` | `episode 12/25`          |
| Encoding      | `encode <int>`     | `encode 30`              |
| Timing        | `time <int>`       | `time 10`                |
| Translation   | `tl <int>`         | `tl 100`                 |
| Typesetting   | `ts <int>`         | `ts 44`                  |
| Editing       | `edit <int>`       | `edit 0`                 |
| Quality Check | `qc <int>`         | `qc 67`                  |