# pinning-app-apis

# Run it locally

1. Install the library/packages using the command line

```sh
yarn install --frozen-lockfile
```

2. Install typescript globally

```sh
npm i -g typescript
```

3. You will need a .env file in the root folder for the system to run successfully. An example for the .env file has been written in .env.example. Modify the environment variables as you need and required before starting.
4. Create a database name `mac` in mysql and run migration using the following command

```sh
node ace migration:run
```

5. Run seeders using the following command

```sh
node ace db:seed
```

6.  > Run in development mode

```sh
yarn dev
```

> Run in production mode

```sh
npm run build build
cd build
npm ci
node start.js
```

# Note

To change the STORE_IMAGES, update the path in .env and create-sym scripts in package.json file

Give permissions to STORE_IMAGES folder using the following command line:
sudo chmod a+rwx /moxey/wallet/moxey_agent/store/images
