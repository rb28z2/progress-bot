[![Maintainability](https://api.codeclimate.com/v1/badges/5245737267d0831fbc1d/maintainability)](https://codeclimate.com/github/rb28z2/progress-bot/maintainability)
[![Run on Repl.it](https://repl.it/badge/github/rb28z2/progress-bot)](https://repl.it/github/rb28z2/progress-bot)

# progress-bot
High-tech weaponized moe progress delivery bot for IRC, Discord, and web. Uses NodeJS and socket.io to update progress from IRC/Discord messages onto a web interface. The web interface can also be embedded on another page to provide instant and live progress updates.

# Screenshots
![web interface](http://i.imgur.com/nKWdaGL.gif)

# Installation
##### Requirements
* nodejs
* npm
* build-essential
* libicu-dev

##### Instructions
Install `build-essential` and `libicu-dev` via your package manager, then run `npm install` to install the required dependencies. Then, copy `config-default.js` to `config.js` and edit as required. Finally, run the bot with `node start.js`.

##### Compatibility
In theory, this should work anywhere node (and the above dependencies) works. However I've only tested it on Linux (Ubuntu 16.04), and Windows 10.

# Usage
##### Available commands and syntax

Assuming a trigger word of `!pb`:


| Command       | Syntax             | Example                  |
| ------------- | -----------------  | ------------------------ |
| Title         | `title <string>`   | `!pb title A very cool show` |
| Episode       | `episode <string>` | `!pb episode 12/25`          |
| Encoding      | `encode <int>`     | `!pb encode 30`              |
| Timing        | `time <int>`       | `!pb time 10`                |
| Translation   | `tl <int>`         | `!pb tl 100`                 |
| Translation Check | `tlc <int>`    | `!pb tlc 20`                 |
| Typesetting   | `ts <int>`         | `!pb ts 44`                  |
| Editing       | `edit <int>`       | `!pb edit 0`                 |
| Quality Check | `qc <int>`         | `!pb qc 67`                  |

Open a browser to `<ipaddress>:80` (port 80 by default) to see the live changes.

# Demo (front end only)

See a live, in-production setup here: https://asenshi.moe:8443
