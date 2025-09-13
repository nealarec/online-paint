# Collaborative Whiteboard

A real-time collaborative whiteboard application built with React Native (web) and Node.js with Socket.IO.

## 🎥 Demo Video

[![Watch the demo](https://i9.ytimg.com/vi_webp/VRHWtugIFzk/mq3.webp?sqp=CKzCl8YG-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGE8gUyhlMA8=&rs=AOn4CLAVRNYkqsiCfX0leEMbFySUwy0nNA)](https://youtu.be/VRHWtugIFzk)

## Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or yarn
- Git

## Project Structure

```
paint/
├── api/              # Backend server (Node.js + Socket.IO)
├── shared/           # Shared types and utilities
└── ui/               # Frontend application (React Native Web)
```

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:nealarec/online-paint.git
cd online-paint
```

### 2. Set up the shared package

Since the shared module is linked, you'll need to build it first:

```bash
cd shared
npm install
npm run build
```

### 3. Set up the API server

1. Navigate to the API directory:

   ```bash
   cd ../api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The API server will start on `http://localhost:3000` (default port)

### 4. Set up the UI

1. Open a new terminal and navigate to the UI directory:

   ```bash
   cd ../ui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The UI will be available at `http://localhost:8081` (default port)

## Available Scripts

### API

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm test` - Run tests

### UI

- `npm start` - Start the development server
- `npm run web` - Run the web version
- `npm run build` - Build for production
- `npm test` - Run tests

## Environment Variables

### API

Create a `.env` file in the `api` directory with the following variables:

```env
PORT=3000
NODE_ENV=development
```

### UI

Create a `.env` file in the `ui` directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:3000
```

## Development Workflow

1. Start the API server first:

   ```bash
   cd api
   npm run dev
   ```

2. Then start the UI in a separate terminal:

   ```bash
   cd ui
   npm start
   ```

3. Open your browser to `http://localhost:19006` to access the application.

## Testing on Multiple Devices (LAN)

To test the collaborative features on multiple devices connected to the same local network:

1. Find your computer's local IP address:

   - **Mac/Linux**: Run `ifconfig | grep "inet " | grep -v 127.0.0.1` in the terminal
   - **Windows**: Run `ipconfig` in Command Prompt and look for "IPv4 Address"

2. Update the UI environment variables:

   - Edit the `.env` file in the `ui` directory
   - Set `REACT_APP_API_URL` to use your computer's local IP:
     ```env
     REACT_APP_API_URL=http://YOUR_LOCAL_IP:3001
     ```
     Replace `YOUR_LOCAL_IP` with your actual local IP address (e.g., `192.168.1.100`)

3. Restart the UI server:

   ```bash
   cd ui
   npm start
   ```

4. On other devices connected to the same network:
   - Open a web browser
   - Navigate to: `http://YOUR_LOCAL_IP:8081`
   - Multiple users can now join the same room and collaborate in real-time

### Important Notes:

- Ensure your computer's firewall allows incoming connections on ports 3000 (API) and 8081 (UI)
- All devices must be connected to the same local network
- For best performance, use a stable Wi-Fi connection
- Some corporate or public networks may block direct device-to-device connections

## Troubleshooting

- If you encounter any dependency issues, try deleting `node_modules` and `package-lock.json` and then run `npm install` again.
- Make sure the API server is running before starting the UI.
- Check the browser's developer console for any client-side errors.
- Check the terminal where the API server is running for any server-side errors.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
