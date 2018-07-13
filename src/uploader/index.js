import React, { Component } from 'react';
import ossupload from './ossupload';
import './index.css';

class Uploader extends Component {
  state = {
    options: {},
    upload: {},
    status: '',
    progress: 0,
    filename: '',
  }
  componentDidMount(){
    this.getSettings();
  }
  getSettings = () => {
    const options = {
      config: {
        region: '<Your region>',
        accessKeyId: '<Your AccessKeyId>',
        accessKeySecret: '<Your AccessKeySecret>',
        stsToken: '<Your stsToken>',
        bucket: 'Your bucket name',
      },
      dirname: ''
    }
    this.setState({
      options,
    })
  }
  onchangeFile = (e) => {
    const { options } = this.state;
    const { files } = e.target;
    // fixbug
    if (e.target.value === '') return;
    const file = files[0];
    const upload = new ossupload({
      ...options,
      file,
      progress: (percent) => {
        this.setState({
          progress: parseInt(percent * 100),
        });
      }
    });
    this.setState({
      upload,
      filename: file.name,
      status: 'wait',
    })
  }
  start = () => {
    const { upload } = this.state;
    this.setState({
      status: 'starting'
    })
    upload.start(((res) => {
      console.log(res)
      if(res.res.status === 200){
        this.setState({
          status: 'compelete',
        })
      }
    }));
  }
  stop = () => {
    const { upload } = this.state;
    this.setState({
      status: 'stop'
    })
    upload.stop();
  }
  render() {
    console.log()
    const { status } = this.state;
    return (
      <div className="Uploader">
        <input id="ossfile" onChange={this.onchangeFile} style={{display:'none'}}  type="file" multiple="multiple" />
        {
          status === '' &&
          // 存在兼容性问题,待fixbug
          <div onClick={() => {document.getElementById("ossfile").click()}} className="btn">
            选择文件
          </div>
        }
        {
          (status === 'wait' || status === 'stop') &&
            <span style={{marginRight: '20px'}} onClick={this.start} className="btn">开始</span>
        }
        {
          status === 'starting' &&
            <span className="btn" onClick={this.stop}>暂停</span>
        }
        {
          status === 'compelete' &&
            <span className="btn">上传完成</span>
        }
        {
          status != '' &&
          <div className="file-container">
            <div className="filename">
              {this.state.filename}
            </div>
            <div className="progress">
              <div className="progress-bar" style={{width: `${this.state.progress}%`}}>

              </div>
            </div>
          </div>
        }

      </div>
    );
  }
}

export default Uploader;
