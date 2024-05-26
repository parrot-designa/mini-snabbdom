const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');

module.exports = { 
    mode:"development",
    entry: "./src/index.js",
    devServer:{
        port:8080,
        static:'public'
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'public/index.html',//开发环境需要路径
            inject:'body'
        }),
    ]
}