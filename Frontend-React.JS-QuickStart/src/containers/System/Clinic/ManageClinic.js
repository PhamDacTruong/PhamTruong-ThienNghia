import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageClinic.scss';
import { LANGUAGES, CommonUtils } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { createNewClinic } from '../../../services/userService';
import { toast } from "react-toastify";
import TableClinic from "./TableClinic/TableClinic";
import * as actions from "../../../store/actions";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '',
      address : '',
      imageBase64 : '',
      descriptionHTML :'',
      descriptionMarkdown :''
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listClinic !== this.props.listClinic) {
      this.setState({
          name : '',
          descriptionHTML :'',
          descriptionMarkdown :'',
          address : ''
      });
    }
   
  }
  handleChangeInput = (event, id) => {
    let stateCopy = {...this.state}
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy
    })
  }
  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    })
  }
  handleOneChangeImg = async(event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,

      });
    }
  };
  handleSaveNewClinic =async () => {
    let res = await createNewClinic(this.state);
    if(res && res.errCode ===0 ) {
      toast.success('Add new clinic successfully')
      this.setState({
        name : '',
        imageBase64 : '',
        address : '',
        descriptionHTML :'',
        descriptionMarkdown :''
      })
    }else{
      toast.error('Add new clinic error ')
      console.log('check',res)
    }
    setTimeout(() =>{
      this.props.fetchClinicRedux();
    },1000)
    
  }

  render() {
 
    return (
      <div className="manage-clinic-container">
        <div className="ms-title">Quản lí phòng khám</div>
        <div className="add-new-clinic row">
          <div className="col-6 form-group">
            <label>Tên phòng khám</label>
            <input type="text" className="form-control"  value={this.state.name}
            onChange = {(event) => this.handleChangeInput(event, 'name')} 
            />
          </div>
          <div className="col-6 form-group">
            <label>Ảnh phòng khám</label>
            <input type="file" className="form-control-file" 
            onChange={(event) => this.handleOneChangeImg(event)}
            />
          </div>
          <div className="col-6 form-group">
            <label>Địa chỉ phòng khám</label>
            <input type="text" className="form-control"  value={this.state.address}
            onChange = {(event) => this.handleChangeInput(event, 'address')} 
            />
          </div>
          <div className="col-12">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.descriptionMarkdown}
          />
          </div>
          <div className="col-12">
              <button className="btn-save"
              onClick={() => this.handleSaveNewClinic()}
              >Save</button>
          </div>
    
        </div>
        <div className="col-12 mb-5">
          <TableClinic 

          />
        </div>
    
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    listClinic : state.admin.clinic
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchClinicRedux : () => dispatch(actions.fetchClinicStart()),
  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
