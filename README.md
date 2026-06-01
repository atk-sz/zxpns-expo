S1: INIT
npx create-expo-app@latest

S2: remove boilerplate code
npm run reset-project

S3: to start app (-c to clear cache & start fresh)
npx expo start
npx expo start -c

S4: to connect to expo go
npm install -g eas-cli
eas login
eas build:configure

S5: to build
eas build
eas build --platform android --profile development
eas build --platform ios --profile development

S6: to install expo compatible packages
npx expo install <package>

\***\*\*\*\*\***\*\*\*\***\*\*\*\*\***INFORMATIONS**\*\*\*\***\***\*\*\*\***
I1: agent skills help in creating & maintaining code using ai
