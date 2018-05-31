## Start ##

download

    $ git clone <source>

fetch depedencies

    $ yarn install

start the development mode

    $ yarn run ionic:serve

## Database ##

Create a google account (if you don't have one)

### Firebase environments ###

Create two new projects on Firebase, one for development, one for running the test
against. I recommend naming them as 'civic-resourcery-{dev,test}-{postfix}', where
{postfix} is a unique string for you (e.g. initials, if not already taken by
someone else).

For both projects, go (on the UI) to 'Database' and create a 'Cloud Firestore'
database, in 'locked mode'.

Login to firebase from console:

    $ yarn run firebase login

Add the dev/test databases to your .firebaserc file

    $ yarn run firebase use --add civic-resourcery-dev-{postfix} --alias default
    $ yarn run firebase use --add civic-resourcery-test-{postfix} --alias test

As each developer would have their own projects (and as it is open source), it's
best not to add the .firebaserc file to the repository (hence it is ignored).

### Environment description files ###

For each environment to be used a file needs to be in the 'src/environments/'
folder. Make a copy of my enviornment description for both your environments,
and change the values according to what is in 'Settings (gear icon) > Project
settings > Your project' on the firebase admin page. Best keep consistent naming
for the files like 'civic-resourcery.{env}.{postfix}.ts' You may check in these
files to git, as the api-key is not a secret (it needs to be publicly known for
any application to work, anyway).

### Using the environments ###

To switch between the active projects

    $ yarn run firebase --use <alias>

To deploy to the current project

    $ yarn run firebase deploy

All firebase commands accept overriding the project via full name or alias, e.g.:

    $ yarn run firebase -P test deploy

Running the integration test automatically deploys to the test environment (at
least the database rules, for now).

### Admin keys ###

To be able to use the admin sdk from node (e.g. from the integration/end-to-end
test, or from scripting admin tasks), a key for each target database need to be
downloaded, they can be find on the firebase admin page via Settings (gears
icon) > Project settings > Service Accounts > Generate New Private Key I
recommend storing the files as e.g. 'keys/admin-key.{postfix}.dev.json'. DO NOT
ADD THIS FILE TO GIT as is - you may ignore it via .gitignore, and keep it
locally in your working directory, or store it using git-crypt (see 'Storing
secrets' in NOTES). For that you need to have gpg set up, a public/private key
pair generated for you (keep a secure copy of these also e.g. in your password
manager). Then you can add a new git-crypt store for yourself:

    $ git crypt init -k env-{postfix}

edit the keys/.gitattribute file, adding a line:

    'admin-key.*.{postfix}.json filter=git-crypt-env-{postfix} diff=git-crypt-env-{postfix}'

Now you may add the file via 'git add'. To check if the file is really encrypted
in the repository, you can check by

    $ git cat-file -p $(git ls-files -s keys/{key-file-name}.json | awk '{print $2;}')

The result should be 'GITCRYPT' followed by about a page of gibberish.

### Running the integration tests ###

These tests use the test environment, clear the database and deploy the current
rules, put some minimal data to run the tests against, etc. Hence online
connection is needed, and it may fail due to networking errors as well, not only
'valid' test errors.

    $ yarn test:integation


## Links / docs ##

 * Yarn: https://yarnpkg.com/en/docs/cli
 * Ionic: https://ionicframework.com/docs
 * Firebase:
   * Cloud Firestore: https://firebase.google.com/docs/firestore
   * Firebase CLI: https://firebase.google.com/docs/cli
   * Cloud Firestore Security rules: https://firebase.google.com/docs/firestore/security/get-started
   * IAM security:
 * secrets in git
   * git-crypt: https://www.agwa.name/projects/git-crypt
   * GnuPG: https://gnupg.org/documentation/index.html
