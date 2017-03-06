var libraryName = 'dovehaircasting';
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var argv = require('yargs').argv;
var mode = argv.mode;
var env = argv.env;
var plugins = [], outputFile;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var SPSaveWebpackPlugin = require('spsave-webpack-plugin');

plugins.push(new ExtractTextPlugin('../css/screen.css', {
    allChunks: true
}));

if (mode === 'build') {
    plugins.push(new webpack.DefinePlugin({
      "process.env": { 
         NODE_ENV: JSON.stringify("production") 
       }
    }));

    plugins.push(new UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));

    outputFile = libraryName + '.min.js';
} else if(env && env.upload) {
    plugins.push(new SPSaveWebpackPlugin({
        "coreOptions": {
            "checkin": true,
            "checkinType": 1,
            "notification": true,
            "siteUrl": "https://unileverdev.sharepoint.com/sites/Dev_DoveHairCasting"
        },
        "credentialOptions": {
            username: "dmitry.dyachenko@unileverpp.com",
            password: "Password@16"
        },
        "fileOptions": {
            "folder": "Style Library/DoveHairCasting/js"
        }
    }));
    
    outputFile = libraryName + '.js';
}
else {
    outputFile = libraryName + '.js';
}

var config = {
    entry: __dirname + '/assets/js/src/index.jsx',
    devtool: 'source-map',
    output: {
        path: __dirname + '/public/js',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    stats: {
        children: false  
    },
    module: {
        preLoaders: [
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
        ],
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css?url=false&modules&importLoaders=1&localIdentName=[name]_[local]!sass!sass-resources!postcss')
            }
        ]
    },
    sassResources: [
        __dirname + '/assets/css/utils/_variables.scss', 
        __dirname + '/assets/css/utils/mixins/_breakpoints.scss',
        __dirname + '/assets/css/utils/mixins/_curves.scss',
        __dirname + '/assets/css/utils/mixins/_center.scss'
    ],
    postcss: [
        autoprefixer({ browsers: ['last 3 versions'] })
    ],
    resolve: {
        modulesDirectories: ['node_modules', 'assets'],
        extensions: ['', '.js', '.jsx']
    },
    plugins: plugins
};

module.exports = config;
