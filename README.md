# Brawlback Launcher

The Brawlback Launcher is a desktop application for Brawlback built on the Electron framework with a React frontend in Typescript. It is being built to handle updating Brawlback's Dolphin Build, playing Brawlback Online with major Brawl mods through [Lylat](https://lylat.gg/), launching and analyzing replays, and more. This repository is part of the Brawlback ecosystem handled by the Brawlback Team. To see all of the Brawlback projects repos, visit https://github.com/Brawlback-Team.

This launcher is built on a fork of the Slippi Launcher from the Project Slippi team from commit [15db4bd](https://github.com/project-slippi/slippi-launcher/commit/15db4bd2a041d2e78132983cca199eb681c3ac6c)

# This fork is under construction. Much of it still refers to Slippi-specific data. All the hidden files (the ones with "." preceding a name, such as ".hidden.txt") refer to Slippi-specific infrastructure that does not carry over to Brawlback. These need to be either edited to refer to real Brawlback-related infrastructure or removed. #


## Build Instructions

### Prerequisites

These are the applications you will need to install in order to build this project:

- [Git](https://git-scm.com/downloads)
- [Node v16+](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/getting-started/install)

### Build Steps

- Clone the repo via: `git clone https://github.com/Brawlback-Team/brawlback-launcher.git`
- Navigate into the directory and run: `yarn install` to install all dependencies
- Use `yarn run start` to run the app in develop mode
- Use `yarn run package` to build a release

#### Recommended IDE

For development, we recommend using [VSCode](https://code.visualstudio.com/) with the following plugins:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

These extensions will provide automatic formatting and warnings about code quality issues before you commit/push.

## Project Structure

### The `src` folder is split into the following:

- `common`
  - Code shared between both `main` and `renderer` processes. Thus the code written should be agnostic to which thread its being imported from.
- `main`
  - Code for the main process. e.g. electron config, menubars etc.
- `renderer`
  - Code for the React frontend
- `<module>`
  - Modules for the main process that handles specfic tasks should be kept in their own folder with a clear name e.g. settings, dolphin etc.

### The `renderer` folder is organised as follows:

- `components`
  - "Dumb" components reusable throughout the app. These should not directly access or modify state but should accept handlers and state info via props.
- `containers`
  - Components that piece multiple dumb components together into a single "container". These can modify state and bind logic to the components but make sure most complex logic is in `lib`.
- `lib`
  - Reusable logic, such as hooks, goes here to keep the components mainly representative and visual.
- `styles`
  - Code for app styles and theming.
- `views`
  - The root pages of the app. Give a starting point for finding components.

### The `<modules>` folders and IPC:

While not required most `<modules>` will use Electron's IPC to facilitate communication between the main and renderer processes of the application. In order to ensure proper type safety these folders are structured in a specific way as well. To add onto an existing IPC api endpoint or create a new one, follow this structure:

- `types.ts`
  - Interfaces and Types used throughout the `<module>`.
- `api.ts`
  - Functions that are exposed to the renderer process as api endpoints or events via `window.electron.<module>.<function>`. Events are subscribed to in the `useAppListeners.ts` file at `renderer/lib/hooks`. Each api is exposed to the renderer process in `main/preload.ts`
- `ipc.ts`
  - Event and Handler signatures for main and renderer processes using the design pattern described in `utils/ipc`. Writing the signature using the `makeEndpoint` function from `utils/ipc` allows us to ensure proper type safety in both the main and renderer processes while also using Electron's `contextBridge` and `ipcRenderer`. 
- `setup.ts`
  - Implements all handlers from the `api` and `ipc` files for the main process in one exported function that is called in `main/installModules.ts`.

Modules will have other files that are more specific to how they are organized, but this is the general structure for using Electron's IPC in a type safe manner.

## Contributing

Contributions are welcome! Check the [Discord](http://discord.gg/dzYRN32k4D) under the `webdev-general` channel for what's currently being worked on. To ensure dev channels don't get crowded we ask everyone to get verification first from the `dev-role-verification` channel before being allowed to write in them. When making a PR, ensure you are not PRing your `main` branch and always describe the feature and what testing you've done so far.

## Acknowledgements

This application uses [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) as a base and includes most changes up to commit [10c22e5](https://github.com/electron-react-boilerplate/electron-react-boilerplate/commit/10c22e5).

## License

Brawlback Launcher is released as open source software under the [GPL v3](https://opensource.org/licenses/gpl-3.0.html) license. See the [LICENSE](./LICENSE) file in the project root for the full license text.
