const idcardGenerator = require('./index');
const fs = require('fs');
const path = require('path');
const config = {
    name: '张三丰',
    sex: '男',
    nation: '汉',
    year: '2002',
    mon: '2',
    day: '03',
    org: '深圳市南山区公安局',
    validTerm: '2014.01.27-2019.01.27',
    addr: '深圳市南山区南山街道南园村正街69号',
    idn: '371100197308161831',
    avatar: './images/avatar.png'
}

idcardGenerator(config).then(([e1, e2]) => {
    console.log(e2, e1);
    const p1 = new Promise((resolve, reject) => {
      fs.writeFile('./output/back.png', e1, err => {
          if(err){
              console.log('idcard-generator：测试失败 ');
          } else {
              // console.log('idcard-generator：测试成功，文件已保存在：' + path.resolve(__dirname, './output.png'));
              resolve();
          }
      })
    })
    const p2 = new Promise((resolve, reject) => {
      fs.writeFile('./output/foward.png', e2, err => {
          if(err){
              console.log(err);
          } else {
              // console.log('idcard-generator：测试成功，文件已保存在：' + path.resolve(__dirname, './output.png'));
              resolve();
          }
      })
    })
    Promise.all([p1, p2]).then(() => {
      console.log('idcard-generator：测试成功，文件已保存在：' + path.resolve(__dirname, './output'));
    }).catch(err => {
        console.log('idcard-generator：测试失败\n' + err.stack);
    });
    //
    // fs.writeFile('./output.png', e1, err => {
    //     if(err){
    //         console.log('idcard-generator：测试失败 ' + e);
    //     } else {
    //         console.log('idcard-generator：测试成功，文件已保存在：' + path.resolve(__dirname, './output.png'));
    //     }
    // })
}).catch(err => {
    console.log('idcard-generator：测试失败\n' + err.stack);
});
