S1: INIT
npx create-expo-app@latest

S2: remove boilerplate code
npm run reset-project

S3: to start app
npx expo start

S4: to connect to expo go
npm install -g eas-cli
eas login
eas build:configure

S5: to build
eas build
eas build --platform android --profile development
eas build --platform ios --profile development
