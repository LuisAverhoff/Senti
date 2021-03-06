# Senti

[![Netlify Status](https://api.netlify.com/api/v1/badges/c437dce4-1904-4031-b8ec-4a83ef1b9782/deploy-status)](https://app.netlify.com/sites/senti/deploys) [![Codecov Coverage](https://img.shields.io/codecov/c/github/LuisAverhoff/Senti/master.svg?style=flat-square)](https://codecov.io/gh/LuisAverhoff/Senti/)
[![Build Status](https://travis-ci.com/LuisAverhoff/Senti.svg?branch=master)](https://travis-ci.com/LuisAverhoff/Senti)

This application allows users to make queries on a specific person or product and see if there is a positive or negative trend assoicated with this person or product. Main depenencies for this application are:

- **React** - For efficient rendering of the UI
- **Websockets** - to allow continuous streaming of data in real time
- **React-Charts 2.js** for data visualization.

Here is a live demo for you to try out the application. [Demo](https://senti.netlify.com) </br>
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Read Before Starting

Before running this project, make sure that you have your senti server up and running. Once you have done that, make sure that in your `.env` file you initialize `REACT_APP_WEBSOCKET_URL` with the url that your senti server is running on.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode. You can also run `yarn test:watch` to run everytime there is a change in the test and/or component file or `yarn test:coverage` to show the percentage of code that have been covered by the tests.<br>

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `yarn run analyze`

**Note: You will need to install the source map explorer package. I recommend to install it globally by running `yarn global add source-map-explorer`**

Analyzes JavaScript bundles using the source maps. This helps you understand where code bloat is coming from.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## License

The MIT License (MIT)

Copyright (c) 2019 Luis Manuel Averhoff

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
