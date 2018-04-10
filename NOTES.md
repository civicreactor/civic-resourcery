## About development, choices, etc

### Yarn

In order to be an easily reproducable environment for everyone, I recommend
using yarn instead of npm for package management and *not* installing tool
dependencies (ie. ionic, cordova, typescript, etc.) other than node and yarn
itself globally (either system-wide or user's ~/.yarn folder).

## Recorded steps

### Creating the project

needed global installation, will remove later

    $ yarn global add ionic
    
    $ yarn exec -- ionic start civic-explorer blank
    # Yes - to whether we want hybrid native apps for iOS/Android via cordova
    # No - for ionic pro (for now at least)
    
    $ yarn global remove ionic
    

