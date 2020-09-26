const sharp = require('sharp');
const TextToSVG = require('text-to-svg');
const path = require('path');

function getFontImg(_path, text, fontSize, letterSpacing) {
    return Buffer.from(
        TextToSVG.loadSync(path.resolve(__dirname, _path)).getSVG(text, {
            fontSize: fontSize,
            anchor: 'left top',
            letterSpacing: letterSpacing ? letterSpacing : 0
        })
    );
}

function getAddrText(text) {
    let brnum = 0;
    let textArr = [];
    text.split('').forEach(t => {
        brnum += isNaN(parseInt(t)) ? 1 : 0.5;
    });
    let n = Math.ceil(brnum / 11);
    for (let i = 0; i < n; i++) {
        textArr[i] = text.slice(i * 11, 11 * (i + 1));
    }
    return textArr.map((t, i) => {
        return {
            input: getFontImg('./fonts/hei.ttf', t, 33),
            left: 335,
            top: 350 + 48 * i
        };
    });
}

function validateConfig(config){
    return [
        'name',
        'sex',
        'nation',
        'year',
        'mon',
        'day',
        'org',
        'validTerm',
        'addr',
        'idn',
        'avatar'
    ].find(e => {
        return !config[e];
    })
}

async function getAvatar(img) {
    return await sharp(path.resolve(process.cwd(), img))
        .resize({
            width: 270,
            height: 330
        })
        .png()
        .toBuffer();
}

function composite(config) {
    const p1 = sharp(path.resolve(__dirname, './images/back.png'))
        .composite(
            [
              {
                  // 签发机关
                  input: getFontImg(
                      './fonts/hei.ttf',
                      config.org,
                      33
                  ),
                  left: 525,
                  top: 470
              },
              {
                  // 有效期限
                  input: getFontImg(
                      './fonts/fzzdxjw-gb1-0.ttf',
                      config.validTerm,
                      33
                  ),
                  left: 525,
                  top: 550
              }
            ]
          ).png()
            .toBuffer()
      const p2 = new Promise(async (resolve, reject) => {
        return sharp(path.resolve(__dirname, './images/forward.png'))
          .composite(
              [
                {
                    // 身份证号码
                    input: getFontImg(
                        './fonts/ocrb10bt.ttf',
                        config.idn,
                        44,
                        0.025
                    ),
                    left: 475,
                    top: 535
                },
                {
                    // 姓名
                    input: getFontImg(
                        './fonts/hei.ttf',
                        config.name,
                        36
                    ),
                    left: 340,
                    top: 140
                },
                {
                    // 性别
                    input: getFontImg(
                        './fonts/hei.ttf',
                        config.sex,
                        33
                    ),
                    left: 340,
                    top: 210
                },
                {
                    // 民族
                    input: getFontImg(
                        './fonts/hei.ttf',
                        config.nation,
                        33
                    ),
                    left: 523,
                    top: 210
                },
                {
                    // 年
                    input: getFontImg(
                        './fonts/fzzdxjw-gb1-0.ttf',
                        config.year,
                        33
                    ),
                    left: 340,
                    top: 288
                },
                {
                    // 月
                    input: getFontImg(
                        './fonts/fzzdxjw-gb1-0.ttf',
                        config.mon,
                        33
                    ),
                    left: config.mon.length === 2 ? 475 : 485,
                    top: 288
                },
                {
                    // 日
                    input: getFontImg(
                        './fonts/fzzdxjw-gb1-0.ttf',
                        config.day,
                        33
                    ),
                    left: config.mon.length === 2 ? 580 : 585,
                    top: 288
                },
                {
                    // 头像
                    input: await getAvatar(config.avatar),
                    left: 750,
                    top: 150
                }
              ].concat(getAddrText(config.addr))).png()
              .toBuffer()
              .then(resolve)
          })
      return Promise.all([p1, p2])
}

module.exports = composite;
