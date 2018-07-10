# Tweeter Project

Tweeter is a simple, single-page Twitter clone.

## Features

Users may
- create an account, log in and out
- compose tweets (max. 140 characters) when logged in
- like and un-like other users' tweets

## Final Product
!['Screenshot of tweet compose box'](https://github.com/byeong0430/tweeter/blob/master/server/docs/tweet%20compose%20box.png)
!['Screenshot of tweets'](https://github.com/byeong0430/tweeter/blob/master/server/docs/tweets.png)

## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Create `.env` file in the root directory and add 'MONGODB_URI=mongodb://127.0.0.1:27017/tweeter'
4. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
5. Go to <http://localhost:8080/> in your browser.

## Dependencies

- Express
- Node 5.10.x or above
- bcrypt
- body-parser
- chance
- md5
- mongodb
- node-sass
- node-sass-middleware

## Known Issues
### 1. `bcrypt` on Vagrant
You may receive an error message (see below) on Vagrant when installing dependencies using the `npm install` command.
In this case, please install `bcrypt` in the cloned directory on your **local** computer then on **Vagrant** (you may need to run `npm audit fix`)
```shell
npm ERR! enoent ENOENT: no such file or directory, open '<your cloned dir>/node_modules/bcrypt/node_modules/minipass/node_modules/yallist/package.json.3760322727'
npm ERR! enoent This is related to npm not being able to find a file.
```

### 2. `node-sass-middleware` on Vagrant
You may receive an error message (see below) on Vagrant when starting the web server using the `npm run local` command.
In this case, please install `node-sass` once again in the cloned directory on **Vagrant** (you may need to run `npm audit fix`)

```shell
  return binding.readdir(pathModule._makeLong(path), options.encoding);
                 ^
Error: ENOENT: no such file or directory, scandir '<your cloned dir>/node_modules/node-sass/vendor'
    at Object.fs.readdirSync (fs.js:904:18)
    at Object.getInstalledBinaries (<your cloned dir>/node_modules/node-sass/lib/extensions.js:129:13)
    at foundBinariesList (<your cloned dir>/node_modules/node-sass/lib/errors.js:20:15)
    at foundBinaries (<your cloned dir>/node_modules/node-sass/lib/errors.js:15:5)
    at Object.module.exports.missingBinary (<your cloned dir>/node_modules/node-sass/lib/errors.js:45:5)
    at module.exports (<your cloned dir>/node_modules/node-sass/lib/binding.js:15:30)
    at Object.<anonymous> (<your cloned dir>/node_modules/node-sass/lib/index.js:14:35)
    at Module._compile (module.js:643:30)
    at Object.Module._extensions..js (module.js:654:10)
    at Module.load (module.js:556:32)
```