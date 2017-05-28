# progress-bot
High-tech weaponized moe progress delivery bot for IRC and web. Uses NodeJS and socket.io to update progress from IRC messages onto a web interface. The web interface can also be embedded on another page to provide instant and live progress updates.

# Screenshots
![web interface](http://i.imgur.com/nKWdaGL.gif)

# Installation
##### Requirements
* nodejs
* npm
* build-essential
* libicu-dev

##### Instructions
Install `build-essential` and `libicu-dev` via your package manager, then run `npm install` to install the required dependencies. Then, copy `config-default.js` to `config.js` and edit as required. Finally, run the bot with `node irc.js`.

##### Compatibility
In theory, this should work anywhere node (and the above dependencies) works. However I've only tested it on Linux (Ubuntu 16.04).

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

Open a browser to `<ipaddress>:80` (port 80 by default) to see the live changes.