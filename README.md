# GitHub Webhook VPS Push-to-Sync

Requires `pm2`

## Installation

Clone the repository to your local machine:

```
git clone https://github.com/c99rahul/ts-node-express.git
```

Navigate to the project directory:

```
cd ts-node-express/
```

Install the project dependencies including TypeScript and Nodemon:

```
npm i
```

## Usage

For development purposes, you can run the application using Nodemon to automatically restart the server when changes are detected. Execute the following command:

```
npm run dev
```

This will start the server at `http://localhost:3000` by default. You can change the port in the `src/index.ts` file or create an `.env` file to manage the environt-specific variables separately.

For production, you can build the TypeScript files and then start the server. Run the following commands:

```
npm run build
npm start
```

## Project Structure

The project structure is organized as follows:

- `src`: Contains TypeScript source files
    - `index.ts`: Configures and starts the Express application
- `dist`: Output directory created during build for compiled TypeScript files
- `package.json`: Project configuration and dependencies
- `tsconfig.json`: TypeScript configuration

You can customize the project configuration i nthe `tsconfig.json` file and adjust the server settings in the `src/index.ts` file.

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
