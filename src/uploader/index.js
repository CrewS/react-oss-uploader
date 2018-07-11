import React, { Component } from 'react';
import ossupload from './ossupload';
// import logo from './logo.svg';
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
    // 补充 options获取
    // accessid= '6MKOqxGiGU4AUk44';
    // accesskey= 'ufu7nS8kS59awNihtjSonMETLI0KLy';
    // host = 'http://post-test.oss-cn-hangzhou.aliyuncs.com';
    // http://post-test.oss-cn-hangzhou.aliyuncs.com/Tkjt4zpKBb.docx
    const options = {
      config: {
        region: 'oss-cn-shenzhen',
        accessKeyId: 'STS.NHs8C9Pmngk8RzED4PVUoEipo',
        accessKeySecret: '679PDfvZFR553RadVMLdMbwrqoHF5Q4H7DiPzbVw281f',
        stsToken: 'CAISgAJ1q6Ft5B2yfSjIr4vGc/mNvbJP0KnTUFz0oDQFWtpDqqzbjTz2IHpFf3JtBOkfs/42lGtR6PYelq92TJVEQUGc2XWYTjQTo22beIPkl5Gfz95t0e+IewW6Dxr8w7WhAYHQR8/cffGAck3NkjQJr5LxaTSlWS7OU/TL8+kFCO4aRQ6ldzFLKc5LLw950q8gOGDWKOymP2yB4AOSLjIx5Vol2D4vufvkm5PNukKHtjCglL9J/baWC4O/csxhMK14V9qIx+FsfsLDqnUKukMRqfov1fEeoGec54/NX0Mi6hGHIvfS9cZ0MAh6a641FqhJtvHgkudivejeh2VgLfPPwBw+GoABoYqjwITiJsW0QcvLRgvwoBvgjn72ORx9nF3HC9S5HAFs0Xop3SghxgoA27NeyJ0M3YL1E7ek0w1l8KCo1a6JlUJrABXuMK+BChXdYTn4dua41Z093S6xfqhgGHHQjTDPLGi7Myys69r1NfbN5uUuMj1xZysrfQaFaU9UIORssB8=',
        bucket: 'e-ducation',
      },
      dirname: 'dev/lms/800005127/'
      // stsToken: options.stsToken,
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
