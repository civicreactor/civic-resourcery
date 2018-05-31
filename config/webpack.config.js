var chalk = require("chalk");
var defaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
var ionic_env = process.env.IONIC_ENV;
var fs = require('fs');
var path = require('path');
var env = require('minimist')(process.argv.slice(2)).env || ionic_env || 'dev';
var webpack = require('webpack');

defaultConfig.dev.resolve.alias = {
  "@env/environment": path.resolve(environmentPath('dev'))
};

defaultConfig.prod.resolve.alias = {
  "@env/environment": path.resolve(environmentPath('production'))
};

console.log(chalk.yellow.bgBlack('\nUsing ' + env + ' environment variables.\n'));

if (!!env) {
  var pathToCustomEnvFile = path.resolve(environmentPath(env));

  defaultConfig[env] = defaultConfig[ionic_env];
  defaultConfig[env].resolve.alias = {
    "@env/environment": pathToCustomEnvFile
  };

  var customEnvPlugin = new webpack.NormalModuleReplacementPlugin(
      /src\/environments\/environment\.ts/, pathToCustomEnvFile
  );

  defaultConfig.prod.plugins.push(customEnvPlugin);
  defaultConfig.dev.plugins.push(customEnvPlugin);
}

module.exports = function() {
  return defaultConfig;
};

function environmentPath(env) {
  var filePath = './src/environments/environment' + (env === '' ? '' : '.' + env) + '.ts';
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  console.log(chalk.red.bgWhite('\n' + filePath + ' does not exist!\n'));
  process.exit();
  return '';
}
