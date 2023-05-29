import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageSpecialty.scss';
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { createNewSpecialty, editSpecialtyService } from '../../../services/userService';
import { toast } from "react-toastify";
import * as actions from "../../../store/actions";

import TableSpecialty from "./TableSpecialty/TableSpecialty";


const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '',
      imageBase64 : '',
      descriptionHTML :'',
      descriptionMarkdown :'',
      action : '',
      specialtyId : '',
      
    };
  }

  async componentDidMount() {

  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listSpecialty !== this.props.listSpecialty) {
      this.setState({
          action  : CRUD_ACTIONS.CREATE,
          name : '',
          imageBase64 : '',
          descriptionHTML :'',
          descriptionMarkdown :''
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
      let ObjectUrl = URL.createObjectURL(file);
      this.setState({
        imageBase64: base64,
        previewImgURL: ObjectUrl,

      });
    }
  };
  handleSaveNewSpecialty =async () => {
    let res = await createNewSpecialty(this.state);
     let { action } = this.state;
  
    if (action === CRUD_ACTIONS.CREATE) {
      if(res && res.errCode ===0 ) {
        toast.success('Add new specialty successfully')
        this.setState({
          name : '',
          imageBase64 : '',
          descriptionHTML :'',
          descriptionMarkdown :''
        })
      }else{
        toast.error('Add new specialty error ')
      }
  }
  if(action === CRUD_ACTIONS.EDIT){
    this.props.editSpecialtyRedux({
      name : this.state.name,
      imageBase64 : this.state.imageBase64,
      descriptionHTML :this.state.descriptionHTML,
      descriptionMarkdown :this.state.descriptionMarkdown,
      id : this.state.specialtyId
    })
  }
  // if(res && res.errCode ===0 && action === CRUD_ACTIONS.CREATE) {
  //   toast.success('Add new specialty successfully')
  //   this.setState({
  //     name : '',
  //     imageBase64 : '',
  //     descriptionHTML :'',
  //     descriptionMarkdown :''
  //   })
  // }else{
  //   toast.error('Add new specialty error ')
  // }
    setTimeout(() =>{
      this.props.fetchSpecialtyRedux();
    },1000)
    
  }
  handleEditSpecialtyFromParent = (specialty) => {
    console.log('check',specialty)
    let imageBase63 = '';
    if(specialty.image){
        imageBase63 = new Buffer(specialty.image, 'base64').toString('binary');
    }
    this.setState({
      name : specialty.name,
      descriptionHTML: specialty.descriptionHTML,
      descriptionMarkdown: specialty.descriptionMarkdown,
      imageBase64: '',
      previewImgURL : imageBase63,
      action : CRUD_ACTIONS.EDIT,
      specialtyId : specialty.id
    });
  }

  render() {
 
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lí chuyên khoa</div>
        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Tên chuyên khoa</label>
            <input type="text" className="form-control"  value={this.state.name}
            onChange = {(event) => this.handleChangeInput(event, 'name')} 
            />
          </div>
          <div className="col-6 form-group">
            <label>Ảnh chuyên khoa</label>
            <input type="file" className="form-control-file" 
            onChange={(event) => this.handleOneChangeImg(event)}
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
              <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn-edit":"btn-save"}
              onClick={() => this.handleSaveNewSpecialty()}
              >
                {this.state.action === CRUD_ACTIONS.EDIT ? 
                
                  <FormattedMessage id="patient.specialty.edit" />
                :
                  <FormattedMessage id="patient.specialty.save" />
                }
              </button>
          </div>
    
        </div>
        <div className="col-12 mb-5">
          <TableSpecialty 
          action = {this.state.action}
          handleEditSpecialtyFromParent = {this.handleEditSpecialtyFromParent}
          />
        </div>
     

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    listSpecialty: state.admin.specialty,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSpecialtyRedux: () => dispatch(actions.fetchSpecialtyStart()),
    editSpecialtyRedux : (data) => dispatch(actions.editSpecialty(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
