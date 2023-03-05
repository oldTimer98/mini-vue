# 1、jest的使用

```js
yarn add --dev jest

const sum = require('./sum')
test('sum',()=>{
  expect(sum(1,1)).toBe(2)
})

注意：jest不支持esm，但是可以通过以下方法进行配合使用
```

# 2、如何在 jest 中支持 esm

### 第一种就是项目内使用打包工具来支持的 esm ，然后想配置 jest 做单元测试，结果在写测试的时候发现使用 esm 语法就直接报错了

> 使用 webpack rollup vite 打包都是一样的，都属于打包工具

```js
// sum.spec.js
import { sum } from "./sum";

describe("sum", () => {
  it("1+1=2", () => {
    expect(sum(1, 1)).toBe(2);
  });
});
```

执行测试命令

```
yarn test
```

接着你就会看到可可爱爱的报错信息啦

![图片](https://mmbiz.qpic.cn/mmbiz_png/zMgUneGw6cORDThz2xqdGSP9pA7LcPiaL6G4KKK4VWZZIp7FTGiaOE5sv4S7OSS2yyFYrUjOTZM1Yy0zvSfEXzdw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)



- 嘿嘿嘿，不知道卡到这里的同学是不是你呢？
- 其实问题出现的原理也很简单，jest 默认是跑在 nodejs 环境的，而 nodejs 环境下默认是不支持 esm 的，所以 jest 根本不认识 esm 是谁，那肯定就会报错啦
- 那我们如果把代码编译成 nodejs 环境下的代码，jest 是不是就认识啦，那是不是就可以开开心心的让 jest 干活啦？
- 对于代码编译上的问题的话，我们就需要请出 babel 老大哥了，来弄个配置让 babel 老大哥干活！！！
- 先写一个 babel.config.js

```js
// babel.config.js
module.exports = {
    presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```

这个配置翻译成人话就是让 babel 把当前的代码基于你当前的 nodejs 版本进行编译

> 编译成 nodejs 环境下的代码

接着我们把 babel 需要的一些依赖库安装一下

```
yarn add --dev babel-jest @babel/core @babel/preset-env
```

好，到这里我们就处理完了，接着赶紧去执行一下测试命令在看看

```
yarn test
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/zMgUneGw6cORDThz2xqdGSP9pA7LcPiaLckTyT5ZUfgzhRZI093SdL2IIcGlcZk7XUNDNcJMhGuRE7o11rkF42A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

完美解决

### 第二种就是nodejs 配置成支持 esm 的场景

除了上面那个常见的场景外，其实还有一个场景就是

现在 nodejs 其实是可以配置成支持 esm

我们先让 nodejs 环境支持 esm

只需要在 package.json 内配置一下 **type** 字段即可

```
{  "name": "support-esm",  "version": "1.0.0",  "description": "探索 jest 是否支持 nodejs 的 esm 规范",  "main": "index.js",  "type": "module", }
```

> 如果你想了解更多在 nodejs 中支持 esm 的话，可以看看这个视频里有详细的介绍: 如何在 nodejs 中使用 esm 模块规范[1]

现在我们已经让 nodejs 环境支持 esm 了，那这时候执行 jest 会如何呢？

![图片](https://mmbiz.qpic.cn/mmbiz_png/zMgUneGw6cORDThz2xqdGSP9pA7LcPiaLHpzT1Eyn97fczIF7A40fcpaicr5H8YmXqsssxhcIS7raqMmE7c2oQJQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

哦no，又是这个可爱的报错！！！

那我得怎么办怎么办呢？？？？

别着急，你需要设置一下环境变量，就可以让jest知道你要用 esm 的形式来运行了

```js
// package.json  
"scripts": {    
    "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest"  
},
```

现在你在执行一下测试命令看看吧

![图片](https://mmbiz.qpic.cn/mmbiz_png/zMgUneGw6cORDThz2xqdGSP9pA7LcPiaLdu8SMNNobbSHD4SG87eOqGYwR03KF9nnXpWvMzM1fSbfYg30O0UdGA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

完美解决问题