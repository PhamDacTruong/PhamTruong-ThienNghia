import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import './UserManage.scss'
import { connect } from "react-redux";
import {getAllUsers , createNewUserService,deleteUserService, editUserService} from '../../services/userService'
import ModalUser from "./ModalUser";
import { emitter } from "../../utils/emitter";
import ModalEditUser from "./ModalEditUser";
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        arrUser : [],
        isOpenModalUser : false,
        isOpenModalEditlUser : false,
        userEdit : {}
    };
  }

  async componentDidMount() {
    await this.getAllUserFromReact();
  }
  getAllUserFromReact = async()=> {
    let response = await getAllUsers('ALL');
    if(response && response.errCode === 0){
        this.setState({
            arrUser: response.users
        })

    }
    
  }
  handleAddNewUser = () =>{
    this.setState({
      isOpenModalUser: true,
    })
  }

  toggleUserModal = () =>{
    this.setState({
      isOpenModalUser : !this.state.isOpenModalUser,
    })
  }
  toggleUserEditModal = () =>{
    this.setState({
      isOpenModalEditlUser : !this.state.isOpenModalEditlUser,
    })
  }
  createNewUser = async (data) => {
    try {
     let response = await createNewUserService(data);
     if(response && response.errCode !== 0){
      alert(response.errMessage)
     }else {
      await this.getAllUserFromReact();
      this.setState({
        isOpenModalUser : false
      })
      emitter.emit('EVENT_CLEAR_MODAL_DATA')
     }
    }catch(e){
      console.log(e);
    }
    
    console.log('check data', data)
  }

  handleDeleteUser = async (user) => {
      console.log('delete user', user)
    try{
      let res = await deleteUserService(user.id);
      if(res && res.errCode === 0){
        await this.getAllUserFromReact();
      }
      else{
        alert(res.errMessage)
      }

    }catch(e){
      console.log(e);
    }
  }
  handleEditUser = async (user) =>{
    console.log('delete user', user)
    this.setState({
      isOpenModalEditlUser :true,
      userEdit : user
    })
  }
  doEditUser =async (user) =>{
    try{
      let res = await editUserService(user);
      if(res && res.errCode === 0){
        this.setState({
          isOpenModalEditlUser : false
        })
        await this.getAllUserFromReact();
      }
    }catch(e){
      console.log(e);
    }
    
  }
  render() {
    let arrUsers = this.state.arrUser;
    return (
      <div className="users-container">
        <ModalUser
            isOpen = { this.state.isOpenModalUser}
            toggleFromParent = { this.toggleUserModal} 
            createNewUser = {this.createNewUser}
            
        />
        {
          this.state.isOpenModalEditlUser &&
        <ModalEditUser
         isOpen = {this.state.isOpenModalEditlUser}
         toggleFromParent = { this.toggleUserEditModal} 
         currentUser = {this.state.userEdit}
         editUser = {this.doEditUser}
        />
      }
        <div className="title text-center">Thông tin tài khoản</div>
        {/* <div className="mx-1">
          <button 
            className="btn btn-primary px-3"
            onClick={() => this.handleAddNewUser()}
            ><i class="fas fa-plus"></i>Thêm</button>
        </div> */}
        <div className="users-table mt-3 mx-1">
          <table id="customers">
            <tbody>
            <tr>
              <th>Email</th>
              <th>Họ</th>
              <th>Tên</th>
              <th>Vai trò</th>
             
            </tr>
            
                {arrUsers && arrUsers.map((item,index) => {
                   let role = '';
                   if (item.roleId === 'R1') {
                     role = 'Admin';
                   } else {
                     role = 'Bác sĩ';
                   }
                    if (item.roleId !== 'R3') {
                   return(
                  <tr key = {index}>
                        <td>{item.email}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{role}</td>
                       
                    </tr>
                   )
                    }
                })
                }
              
          </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
