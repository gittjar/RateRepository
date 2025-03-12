# RateRepository App

RateRepository is a React Native application that allows users to login with an authenticated token, add and remove repositories from their home screen, and view repositories in different timezones. This app is built using [Expo](https://expo.dev/), which makes it easy to get started with React Native.

## Features

- **Token-based Login**: Securely login with an authenticated token.
- **Manage Repositories**: Add and remove repositories from your home screen.
- **Timezone Support**: View repositories in different timezones.
- **Built with React Native**: Leverage the power of React Native for cross-platform mobile development.
- **Expo**: Simplifies the development process with a set of tools and services built around React Native.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/gittjar/raterepository.git
    cd raterepository
    ```

2. Install dependencies for the frontend:

    ```sh
    cd frontend
    npm install
    ```

3. Install dependencies for the backend:

    ```sh
    cd ../backend
    npm install
    ```

### Running the App

1. Start the backend server:

    ```sh
    cd backend
    node server.js
    ```

2. Start the Expo project:

    ```sh
    cd ../frontend
    npx expo start
    ```

## Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)

## License

This project is licensed under the 0BSD License.