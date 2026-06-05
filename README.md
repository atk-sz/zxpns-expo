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
eas build --platform android --local
eas build --platform android --profile development
eas build --platform ios --profile development

S6: to install expo compatible packages
npx expo install <package>

S7: to check if any native changes are done manually, like instead of updating the app.json for title, directly updating the app name inside native code which will be overwritten once predbuild for the app is done
git -C E:\native-apps\zxpense\expo-app diff --stat HEAD -- android/

S8: prebuild(required to see meta changes in native code)
npx expo prebuild --platform android

S9: to release a build locally(generate apk)
cd android
.\gradlew assembleRelease

\***\*\*\*\*\***\*\*\*\***\*\*\*\*\***INFORMATIONS**\*\*\*\***\***\*\*\*\***
I1: agent skills help in creating & maintaining code using ai
