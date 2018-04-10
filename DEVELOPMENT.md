## Start ##

download

    $ git clone <source>

fetch depedencies

    $ yarn install

start the development mode

    $ yarn run ionic:serve

## Database ##

Create a google account (if you don't have one)

Create two new projects on Firebase, one for development, one for running the test
against. I recommend naming them as 'civic-explorer-{dev,test}-{postfix}', where
{postfix} is a unique string for you (e.g. initials, if not already taken by
someone else).

For both projects, go (on the UI) to 'Database' and create a 'Cloud Firestore'
database, in 'locked mode'.

Login to firebase from console:

    $ yarn run firebase login

Add the dev/test databases to your .firebaserc file

    $ yarn run firebase use --add civic-explorer-dev-{postfix} --alias default
    $ yarn run firebase use --add civic-explorer-test-{postfix} --alias test

As each developer would have their own projects (and as it is open source), it's
best not to add the .firebaserc file to the repository (hence it is ignored).

To switch between the active projects

    $ yarn run firebase --use <alias>

To deploy the current project

    $ yarn run firebase deploy


## Links / docs ##

 * Yarn: https://yarnpkg.com/en/docs/cli
 * Ionic: https://ionicframework.com/docs
 * Firebase:
   * Cloud Firestore: https://firebase.google.com/docs/firestore
   * Firebase CLI: https://firebase.google.com/docs/cli
   * Cloud Firestore Security rules: https://firebase.google.com/docs/firestore/security/get-started
   * IAM security:
