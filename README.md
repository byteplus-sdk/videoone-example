## Step 1: Install Dependencies
In the project root directory, run `pnpm install --registry=https://registry.npmmirror.com` to install dependencies (recommend using [pnpm](https://pnpm.io/installation)).

## Step 2: Start the Project
1. Run `pnpm run dev` to start the project, default port is 8000.
2. Open `localhost:8000/videoone/dramaGround` in your browser to experience the short drama effect.

## Step 3: Build and Deploy
Run `pnpm run build` to get the build output. During deployment, pay special attention to the base and build configurations in `vite.config.ts`. There are two main points to note:
1. The build output directory is `output`. If adjustment is needed, you can modify `outDir` under `build`
2. Public prefix configuration for build resources: If the built resources are directly hosted by the server, it can remain consistent with the development environment. If static resources are uploaded to CDN hosting, you need to obtain the corresponding acceleration domain name and replace it at *.
```js
export default defineConfig({
  base: isProd ? '*' : '/',
  server: {
    port: 8000,
  },
  build: {
    outDir: 'output',
  },
});
```