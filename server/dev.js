'use strict';


const tasks = {
  gulp: [//开发模式下会进行构建
    'dev',
    'autoVersion',
    'leanUp',
  ],
  module: [//开发环境和生产环境都会运行的组件

  ]
}

// 引入进度条显示工具模块
const ProgressBar = require('./utils/progress_bar');

// 初始化一个进度条长度为 50 的 ProgressBar 实例
const pb = new ProgressBar({
  description: 'Server',
  length: 25,
  theme_color: `keyword('orange')`,
  // total: sum(tasks),
  total: (_ => {
    var count = 0;
    for (var i in tasks) {
      count += tasks[i].length
    }
    return count
  })(),
  fps: 30,
  delay: 0
});




const child_process = require('child_process');
const spawn = child_process.spawn;
const exec = child_process.exec;
var i = 0;
for (var j in tasks.gulp) {
  const ls = spawn('gulp', [tasks.gulp[j]], { stdio: "pipe" });//如果使用stdio:"inherit",就能显示彩色的console结果;如果是用pipe的话就可以进行下面的 ls.stdout.on
  ls.stdout.on('data', (data) => {
    // console.log(data.toString());
    var sign = '-fs';
    if (data.toString().match(sign)) {
      console.log('\n' + (data.toString().replace(sign, '')));
    }

  });
  ls.stderr.on('data', (data) => {

    console.log(`\n stderr: ${data} \n`);

  });
  ls.on('close', (code) => {
    // console.log(`child process exited with code ${code}`);
    pb.stepRender();
    i++;
    if (i == tasks.gulp.length) {
      runCore();
    }
  });
}



function runCore() {
  require('./core')
}