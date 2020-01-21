const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'html', 'css'];
var path = require('path');

function leanUp() {
	/*       var exec = require('child_process').exec;
        var leanUpProcess = exec('lean up');
  
        leanUpProcess.stdout.on('data', function (data) {
          console.log(data);
        }); */

	var spawn = require('child_process').spawn,
		ls = spawn('lean', ['up'], { stdio: 'inherit' });

	ls.stdout.on('data', function(data) {
		console.log('stdout: ' + data.toString());
	});

	ls.stderr.on('data', function(data) {
		console.log('stderr: ' + data.toString());
	});

	ls.on('exit', function(code) {
		console.log('child process exited with code ' + code.toString());
	});
}

// console.log(process.env);

const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/';

module.exports = {
	lintOnSave: false,
	publicPath: publicPath,
	assetsDir: 'assets',
	lintOnSave: undefined,
	productionSourceMap: false,
	outputDir: undefined,
	runtimeCompiler: true,
	parallel: undefined,

	css: {
		loaderOptions: {
			less: {
				modifyVars: {
					'primary-color': '#1DA57A',
					'link-color': '#1DA57A',
					'border-radius-base': '6px',
				},
				javascriptEnabled: true,
			},
		},
	},

	devServer: {
		/*       contentBase: path.join(__dirname, 'devDist'),
          compress: true,
          port: 9000 */
		before: function(app, server) {
			// leanUp()
		},
		clientLogLevel: 'none', //string: 'none' | 'info' | 'error' | 'warning'
	},

	/*   configureWebpack: config => {
      if (process.env.NODE_ENV === 'production') {
        return {
          plugins: [
            new CompressionPlugin({
              test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
              threshold: 10240,//对超过10k的数据压缩
              deleteOriginalAssets: false //不删除源文件
            })
          ]
        }
      }
 
    }, */

	pluginOptions: {
		i18n: {
			locale: 'zh-CN',
			fallbackLocale: 'zh-CN',
			localeDir: 'locales',
			enableInSFC: true,
		},
	},
};
