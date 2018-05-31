<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
**Table of Contents**

- [-](#-)
    - [Yarn](#yarn)
    - [Recorded steps](#recorded-steps)
        - [Creating the project](#creating-the-project)
        - [Creating database rules](#creating-database-rules)

<!-- markdown-toc end -->
## About development, choices, etc ##

### Yarn ###

In order to be an easily reproducable environment for everyone, I recommend
using yarn instead of npm for package management and *not* installing tool
dependencies (ie. ionic, cordova, typescript, etc.) other than node and yarn
itself globally (either system-wide or user's ~/.yarn folder).

### Storing secrets in git (git-crypt, GPG) ###

In general, one should not add secrets (api tokens, passwords, etc) into a
repository, especially for public repos, yet we need to have them accessible
during development. One crude, but typical way of solving this is that we expect
the files to be in the project directory, but put them into .gitignore, and
leave it to the individual developers to copy those secret files (from other,
protected sources) to their own working copy. Other than the invonvenience,
another quite basic problem with this approach is that if the secrets will not
be version controlled (will need to redistrubte them when they change; if
checking out different branches, the devs need to make sure to use the correct
version, etc.)

Git-crypt, an extension to git, provides a better way, by keeping encrypted
shared keys in the repository, and using these to automatically encrypt/decrypt
the stored secrets between the repository and the file system, and then the
developers need only to exchange a single secret -the encryption key for this
shared symmetric key- between them; or by using GPG, even the need for this
exchange can be eliminated. It also allows, by using multiple of such shared
keys, to have a simple role-based access to the secrets.

## RECORDED steps ##

### Creating the project ###

needed global installation, will remove later

    $ yarn global add ionic

    $ yarn exec -- ionic start civic-explorer blank
    # Yes - to whether we want hybrid native apps for iOS/Android via cordova
    # No - for ionic pro (for now at least)

    $ yarn global remove ionic

### Creating database rules ###

You needed to be logged in (yern run firebase login) first.

To initialize the project for firebase:

    $ yarn run firebase init

For this project "Hosting" and "Firestore" were enabled, see 'firebase.json' for
the rest of the configuration specified.

## Adding the crypt stores ##

To create the production, staging and the personal stores:

    $ git crypt init -k env-<environment-name>

Add a given user's public key for a named store (the store needs to be unlocked,
and at least the public key of the user has to be in the gpg store, see GPG):

    $ git crypt add-gpg-user -k env-<environment-name> -n <user-id-or-email>

## Separate environments (dev & test) for each + staging & production ##

Unfortunately Ionic doesn't support it (promised for v4), see discussion at
issue [ionic-cli#1205](https://github.com/ionic-team/ionic-cli/issues/1205). I
ended up following the steps described
[here](https://github.com/ionic-team/ionic-app-scripts/issues/762#issuecomment-367862651).
