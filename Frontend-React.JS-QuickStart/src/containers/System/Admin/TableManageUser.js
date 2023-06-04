import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import './TableManageUser.scss'
import { connect } from "react-redux";
import * as actions from "../../../store/actions"

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}


class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux : [],
      
      
    };
  }

  componentDidMount(){
    this.props.fetchUserRedux();
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.listUsers !== this.props.listUsers){
      this.setState({
        usersRedux : this.props.listUsers
      })
    }
  }
  handleDeleteUser = (user) =>  {
    
    this.props.deleteNewUserRedux(user.id);
    
  }
  handleEditUser = (user) => {
    this.props.handleEditUserFormParentKey(user)
  }
  render() {
   

    let arrUsers = this.state.usersRedux;
    arrUsers.sort((a, b) => {
      if (a.roleId === 'R0' && b.roleId !== 'R0') {
        return 1; // Đẩy dòng có roleId 'R0' xuống cuối
      }
      if (a.roleId !== 'R0' && b.roleId === 'R0') {
        return -1; // Đẩy dòng có roleId 'R0' xuống cuối
      }
      return 0;
    });
    return (
      <React.Fragment>
          <table id = "TableManageUser">
            <tbody>
            <tr>
              <th>Email</th>
              <th>Họ</th>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>    
            {arrUsers && arrUsers.length > 0 &&
                arrUsers.map((item,index) =>  {
                  console.log(item)
                  const rowStyle = item.roleId === 'R0' ? { backgroundColor: '#888' } : {};
                  if (item.roleId !== 'R3') {
                    
                  return (
                    <tr key={index} style={rowStyle}>
                    <td>{item.email}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.address}</td>
                    <td>
                        <button className="btn-edit" onClick = {() => this.handleEditUser(item)}><i className="fas fa-edit"></i></button>
                        <button className="btn-delete" onClick={() => this.handleDeleteUser(item)}><i className="fas fa-trash-alt"></i></button>
                    </td>
                </tr>     
                  )
                  }
                })
              }
                           
          </tbody>
          </table>
    
      {/* <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} /> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers : state.admin.users

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteNewUserRedux: (id) => dispatch(actions.deleteNewUser(id)),

   
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
