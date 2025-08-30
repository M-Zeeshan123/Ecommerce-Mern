import React from 'react'
import "./userList.css";
import { DataGrid} from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { deleteUser, getUsers } from '../../redux/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

export default function UserList() {

    const dispatch = useDispatch();
    const users = useSelector(state=>state.user.users);
     useEffect(()=>{
        getUsers(dispatch);
    },[]);
    
    console.log(users);
    
    const [message, setMessage] = useState(null);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const result = await deleteUser(id, dispatch);
                setMessage({ type: "success", text: result.message });
                setTimeout(() => setMessage(null), 3000);
            } catch (err) {
                setMessage({ type: "error", text: err.response?.data?.message || "Error deleting user" });
                setTimeout(() => setMessage(null), 3000);
            }
        }
    };
    
    
    const columns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'username', headerName: 'Username', width: 150,renderCell:(params)=>{
            return (
                <div className="userListUser">
                    <img src={params.row.avatar} alt="" className='userListImg' />
                    {params.row.username}
                </div>
            )
        } },
        { field: 'email', headerName: 'Email', width: 180 },
        {
          field: 'isAdmin',
          headerName: 'is Admin',
          width: 70,
        },
        {
          field: 'createdAt',
          headerName: 'Created At',
          width: 220,
        },
        {
            field:"action",
            headerName:"Action",width:150,
            renderCell: (params)=> {
                return(<>
                <Link to={"/user/"+params.row.id}>
                    <button className="userListEdit">Edit</button>
                </Link>
                    <DeleteOutline 
                        className="userListDelete"
                        onClick={() => handleDelete(params.row._id)}
                    />
                </>
                );
            }
        },
      ];
 
  return (
    <div className="userList">
        {message && (
            <div
                style={{
                    margin: "10px",
                    padding: "10px",
                    backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                    color: message.type === "success" ? "#155724" : "#721c24",
                    borderRadius: "4px",
                    textAlign: "center"
                }}
            >
                {message.text}
            </div>
        )}
        <DataGrid
        rows={users} disableRowSelectionOnClick
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row)=>row._id}
        checkboxSelection
      />
    </div>
  )
}
