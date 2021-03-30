# Fedex technical assessment

- a display of my (full) Stack capabilities: Application Logic, pipelines, automated-testing. From A to Z.

due to time constrains, nice to haves:

- tests are written on a really basic/general level, would have loved to be able to have spent way more time on this, the power of automated testing for an Engineer, in the perspective of TDD, is highly underestimated
- directives for (confirm)password control fields
- had less focus on SASS/CSS/HTML

## Frontend Stack

- Angular11
- NGX-Rocket starter kit
- NG-Bootstrap
- NGRX State Management (Effects, FeatureSelectors)
- RxJS
- GitHub (CI/CD pipeline, automated testing/deploy)
- deploy to FTP (dev, master)
- integration testing with Cypress

## Installation

```bash
$ npm install
```

- please also install server at https://github.com/gitssan/fdx-server
- follow installation instructions as described in the readme

## Running the app

```bash
$ npm run start
```

http://localhost:4200
( listening to server on http://localhost: 3000)

## Testing: cypress

```bash
$ npm run cypress:open
```

## Online demo

- dev https://www.due-volte.nl/ssan/fdx/0.1.0-dev
- master https://www.due-volte.nl/ssan/fdx/0.1.0-master

## Servers

- dev https://fdx-server-dev.herokuapp.com/
- master https://fdx-server-master.herokuapp.com/
