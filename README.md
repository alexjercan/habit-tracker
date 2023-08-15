# Habit Tracker

Web application that allows you to track your daily habits.

### Quickstart

This project requires you to setup a firebase backend service and use firestore
database.

```console
npm install
npm run dev
```

### Firebase

You can find some details in the `.firebaserc` related files

- The application uses the `Authentication` service: Google and Anonymous
  providers
- The application uses the `Firestore Database` service

Probably you will want to run

```console
firebase init
```

here choose only `firestore` and setup your own project. Also don't forget to
change the config from `./src/lib/firebase.ts` to match your own public keys.
