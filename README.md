## react-oss上传组件v0.1.0版本


### 开始
```bash
  $ git clone git@github.com:CrewS/react-oss-uploader.git
  $ cd react-oss-uploader
  $ npm install 
  $ npm run start
```

### 配置ak授权信息（需要有oss对应的ak信息）
```javascirpt
// index.js 18行
config: {
  region: '<Your region>',
  accessKeyId: '<Your AccessKeyId>',
  accessKeySecret: '<Your AccessKeySecret>',
  stsToken: '<Your stsToken>',
  bucket: 'Your bucket name',
}
```
### 上传
- 点击上传按钮
- 选择文件
- 点击开始上传
- 完成上传（可中途暂停上传，然后再点击开始，断点续传）
