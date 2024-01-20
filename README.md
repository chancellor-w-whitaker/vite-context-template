# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

My changes:

- Installed Bootstrap and imported into main.jsx using these instructions--<https://blog.logrocket.com/using-bootstrap-react-tutorial-examples/#importing-bootstrap-dependency>.
- Deleted the contents of index.css, copied the Poppins font css rules found here--<https://fonts.cdnfonts.com/css/poppins>--and pasted those rules into index.css.
- In index.css, changed the Bootstrap default font by changing the value of a Bootstrap root css variable. Poppins font family can be found here--<https://www.cdnfonts.com/poppins.font>--and Bootstrap default :root css variable values can be found here--<https://getbootstrap.com/docs/5.3/customize/css-variables/#default>.
- Also changed Bootstrap's default box shadow values in index.css by modifying their corresponding css variables. The new values can be found here--<https://mui.com/material-ui/react-paper/#elevation>--labelled as elevation=2, elevation=3, and elevation=4.
- Installed eslint-plugin-perfectionist using command found here--<https://eslint-plugin-perfectionist.azat.io/guide/getting-started#%F0%9F%92%BF-installation>. Configured the plugin using the example found here--<https://eslint-plugin-perfectionist.azat.io/configs/recommended-line-length#%E2%9A%99%EF%B8%8F-usage>.
- Disabled the react/prop-types ESLint rule for the entire project using the instructions found here--<https://bobbyhadz.com/blog/react-eslint-error-missing-in-props-validation#disabling-the-reactprop-types-eslint-rule>.
- Deleted the App.css file.
- Added a components folder and created an example MainContainer component. The structure for the MainContainer component was derived from here--<https://getbootstrap.com/docs/5.3/examples/offcanvas-navbar/>--after inspecting the page and finding the main element within the html body. Used this page--<https://transform.tools/html-to-jsx>--to convert the copied html into jsx.
- Emptied the App.jsx file and added the MainContainer component to the App component's jsx.
- Added a hooks folder and created a custom hook called usePageBootstrapBg which allows you to quickly add a Bootstrap bg variant to the document body. An example of a custom hook and of modifying the document body from within a component can be found here--<https://react.dev/reference/react/useEffect#custom-useintersectionobserver-hook>. Used my custom hook in the App component. Bootstrap background color variants can be found here--<https://getbootstrap.com/docs/5.3/utilities/background/#background-color>.
- Created an App Context to prevent component files from becoming cluttered. The inspiration for this setup can be found here--<https://react.dev/learn/scaling-up-with-reducer-and-context#moving-all-wiring-into-a-single-file>. The App Context and App Context Provider are both exported from the AppContext.jsx file. The Provider wraps around the App component in the main.jsx file. Instead of using a Reducer like in the example, a custom hook has been created at the bottom of the AppContext.jsx file called useProvideAppContext. It is designed to be a main method, or a convenient starting point of your application. A useConsumeAppContext custom hook has been stored in the hooks folder, and you can use this hook anywhere in your application to use the values stored in the App Context. Whatever you return from useProvideAppContext gets stored in the App Context and provided to the App component. The Consumer hook is already being used in the App component file.
- In an examples folder inside of the hooks folder, I have provided many lightweight custom react hooks found in the react documentation. Some were taken from here--<https://react.dev/learn/reusing-logic-with-custom-hooks>--and some were taken from here--<https://react.dev/reference/react/useEffect#wrapping-effects-in-custom-hooks>.
- In vite.config.js, set the output directory (build.outDir--<https://vitejs.dev/config/build-options.html#build-outdir>) to "docs" to allow for easy github pages integration (<https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#about-publishing-sources>).
- In vite.config.js, set server.open to true to enable the app opening in the browser on server start (<https://vitejs.dev/config/server-options.html#server-open>).
- In vite.config.js, set base to "./" in order to make the built index.html use relative paths when pointing to the other assets in the output directory (<https://vitejs.dev/config/shared-options.html#base>).

Future changes:

- Integrate template for remote component creation (<https://github.com/Paciolan/remote-component?tab=readme-ov-file#remote-component->).
