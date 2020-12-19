# DeclareThatColor

A web app version of [Sublime Text 3's DeclareThatColor plugin](https://packagecontrol.io/packages/DeclareThatColor); check the site on [declarethatcolor.herokuapp.com](https://declarethatcolor.herokuapp.com/).

<p align="center">
  <img src="https://github.com/bertdida/declare-that-color-web/blob/main/img/usage.gif" alt="usage"/>
</p>

## Built With

- Flask
- React
- react-ace as a code editor component
- NPM for managing frontend dependencies
- Pipenv for managing backend dependencies
- Heroku as a hosting provider

## Local Environment

Clone this repo and install the dependencies by running:

```bash
$ git clone https://github.com/bertdida/declare-that-color-web.git
$ cd declare-that-color-web
$ pipenv install
$ npm install
```

Rename [server/.env.example](https://github.com/bertdida/declare-that-color-web/blob/main/.env.example) to remove .example.

Start the flask server.

```bash
$ py run.py
```

On a new terminal, start the react app.

```bash
$ cd client
$ npm run start
```

## Contributing

Any contributions are always welcome! If you have any problem, idea, or suggestion for the project, feel free to create issues or pull requests.

## Author

Herbert Verdida / [@bertdida](https://twitter.com/bertdida)
