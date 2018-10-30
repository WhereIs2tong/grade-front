const webpack = require('webpack');
const path = require('path');
const fs = require("fs");
// 引入模板插件
const HTMLWebpackPlugin = require("html-webpack-plugin");
// 清理 dist 文件夹
const CleanWebpackPlugin = require("clean-webpack-plugin");
/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件集合
let Entries = {};

const entriesPath = './src/page/entries.json';
let filenames = fs.readdirSync('./src/page');

function entry2pattern(entry) {
    if(!!entry.name){
        return filename=> entry.name === filename;
    }
    if(!!entry.pattern){
        let pattern = new RegExp(entry.pattern);
        let exclude = entry.exclude || [];
        let excludePattern  = exclude.map(entry2pattern);

        return filename=> pattern.test(filename) && ! excludePattern.some(ep=>ep(filename));
    }
    return filename=>false;
}

if (fs.existsSync(entriesPath)){
    let entriesString = fs.readFileSync(entriesPath).toString();
    console.log(entriesString);
    let entries = JSON.parse(entriesString) || [];
    let entryPattrens = entries.map(entry2pattern);

    filenames = filenames.filter(filename=>entryPattrens.some(entryPattren=>entryPattren(filename)));
}else {
    filenames = filenames.filter(filename=>/.*\\\\.html/g.test(filename));
}

// 生成多页面的集合
filenames.forEach((filename) => {
    let page = filename.split('.',2)[0];
    //配置文档见 https://github.com/jantimon/html-webpack-plugin#configuration
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: `${page}.html`,
        template: path.resolve(__dirname, `./src/page/${page}.html`),
        chunks:[page],
        // chunks: [page, 'commons'],
        //配置压缩选项 http://perfectionkills.com/experimenting-with-html-minifier/
        minify: {
            "removeAttributeQuotes": false,
            "removeComments": true,
            "removeEmptyAttributes": true,
        }
    });
    HTMLPlugins.push(htmlPlugin);
    Entries[page] = path.resolve(__dirname, `./src/js/${page}.js`);
});

module.exports = {
	module: {
		rules: [
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },{
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
			{
				test: /\.(js|jsx|mjs)$/,
				include: [path.resolve(__dirname, 'src')],
                exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [
						'env',"react"
					],
                    // @remove-on-eject-begin

					plugins: ['syntax-dynamic-import',"transform-class-properties"]
				}
			},
			{
				test: /\.css$/,

				use: [
					{
						loader: 'style-loader',

						options: {
							sourceMap: true
						}
					},
					{
						loader: 'css-loader'
					}
				]
			},
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        // 打包生成图片的名字
                        name: "res/[name].[hash].[ext]",
                    }
                }],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ["url-loader"]
            }
		]
	},

	entry:Entries,

	output: {
		filename: '[name].[hash].js',
		path: path.resolve(__dirname, 'dist')
	},
    devServer:{
        //设置服务器访问的目录
        contentBase:path.resolve(__dirname,'dist'),
        //服务器ip地址，loacalhost
        host:'localhost',
        //设置端口
        port:9090,
        //自动打开浏览器
        open:true,
        hot:true
    },
    plugins:[
        // 自动清理 dist 文件夹
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, './'),  //根目录
            verbose: true,    //开启在控制台输出信息
            dry: false　　　　  //启用删除文件
        }),
        new webpack.HotModuleReplacementPlugin(),
		...HTMLPlugins
	],

	// mode: 'development',
	optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			minChunks: 1,
			name: true,

			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				}
			}
		}
	}
};
