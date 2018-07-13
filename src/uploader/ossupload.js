
import OSS from './aliyun-oss-sdk';
// import OSS from 'ali-oss';
class ossupload {
  constructor(option) {
    this.file = option.file;
    this.dirname = option.dirname || '';
    this.config = option.config;
    this.progress = option.progress;
    this.client = null;
    this.state = 'wait'; // {wait,stop,start,compelete,delete}
    this.objectKey = '';
    this.percent = 0;
    this.filetype = '';
    this.init();
  }
  init() {
    // 生成一个objectkey oss关键字
    this.createObjectName();
    // 构造一个oss client
    this.createClient()
  }
  randomString(len) {
  　　len = len || 32;
  　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  　　var maxPos = chars.length;
  　　var pwd = '';
  　　for (var i = 0; i < len; i++) {
      　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
  }
  getSuffix(filename) {
    var pos = filename.lastIndexOf('.')
    var suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    this.filetype = suffix;
    return suffix;
  }
  createObjectName(){
    var filename = this.file.name;
    var suffix = this.getSuffix(filename);
    var dirname = this.dirname;
    this.objectKey = dirname + this.randomString(10) + suffix
  }
  createClient() {
    const config = this.config;
    const client = new OSS.Wrapper({
      ...config
    });
    this.client = client;
  }
  start(callback){
    var co = OSS.co;
    var objectKey = this.objectKey
    var file = this.file;
    var that = this;
    var progress = this.progress;
    if (this.state === 'wait'){
      var client = this.client;
      co(function* () {
        try {
          var result = yield client.multipartUpload(objectKey, file, {
            progress: function* (p, checkpoint) {
              that.percent = p;
              progress(p)
              console.log(p)
              that.tempCheckpoint = checkpoint;
            },
          })
          // success callback
          if (result.res.status == 200){
            callback && callback(result)
          }
        } catch (error) {
          console.log(error)
          if (client.isCancel()) {
            //do something
          }
        }
      })
    } else {
      // 重新上传需要重新创建client
      this.createClient();
      var client = this.client;
      co(function* () {
        try {
          var result = yield client.multipartUpload(objectKey, file, {
            progress: function* (p, checkpoint) {
              // tempCheckpoint = checkpoint;
              that.percent = p;
              progress(p)
              that.tempCheckpoint = checkpoint;
            },
            checkpoint: that.tempCheckpoint,
          })
          // success callback
          if (result.res.status == 200){
            callback && callback(result)
          }
        } catch (error) {
          if (client.isCancel()) {
            //do something
          }
        }

      })
    }
  }
  stop(){
    var client = this.client;
    client.cancel();
    this.state = 'stop'
  }
}
export default ossupload;
