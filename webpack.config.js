const path = require('path');

module.export = {
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')],
                
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js']
    }

};