# 网上看到一个不错的年会抽奖程序改良版

## 使用和改动须知

1. 需要成员需要提前替换,可以按照`member.js`文件中的格式来填入
2. 这个抽奖小程序使用的是本地`localStorage`来存储,刷新后之前抽奖数据会保留,需要重置后数据才会清空
3. 如果需要替换下面的按钮名字和值,替换`index.html`中的`btns`变量即可,具体可以看代码

## 抽奖流程

> 滚动鼠标滚轮，可以放大或缩小球体

1. 用浏览器打开文件夹中的`index.html`文件
2. 选择当次要抽奖的人数
3. 点击『开始』按钮，进入抽奖状态（这个过程仍可修改抽奖人数）
4. 点击『停！』按钮，生成抽奖结果
5. 点击任意人数按钮，可以回到闲置状态，已中奖的用户标记为黄色，不会二次命中

## 小工具

如果你只有名字,需要生成`member.js`中的格式,可以在浏览器控制台按照以下方式生成:

```JavaScript
arr = ['张三', '李四', '王五', '赵二'];
copy(arr.map((e,i)=>{return {phone:`No.${i+1}`, name:e}}))
```
