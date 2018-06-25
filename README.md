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
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
4. Go to <http://localhost:8080/> in your browser.

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
### `bcrypt` on Vagrant
You may receive an error message on Vagrant when installing dependencies using the `npm install` command.

```shell
npm ERR! enoent ENOENT: no such file or directory, open '<your cloned dir>/node_modules/bcrypt/node_modules/minipass/node_modules/yallist/package.json.3760322727'
npm ERR! enoent This is related to npm not being able to find a file.
```

In this case, please install `bcrypt` in the cloned directory on your **local** computer then on **Vagrant**