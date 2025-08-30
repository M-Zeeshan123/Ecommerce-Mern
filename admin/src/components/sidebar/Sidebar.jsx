import React from 'react'
import "./sidebar.css";
import { LineStyle, ListAltOutlined, PeopleAltOutlined, PlayCircleOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';


export default function Sidebar() {
  const isAdmin = JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.user || "{}")?.currentUser?.isAdmin;

  return (
    <div className='sidebar'>
        <div className="sidebarWrapper">
            <div className="sidebarMenu">
                <h3 className="sidebarTitle">Menu</h3>
                <ul className="sidebarList">
                    <Link to="/" className='link'>
                        <li className="sidebarListItem">
                            <LineStyle className='sidebarIcon'/>
                            Dashboard
                        </li>
                    </Link>
                    {isAdmin && (
                        <>
                            <Link to="/users" className='link'>
                                <li className="sidebarListItem">
                                    <PeopleAltOutlined className='sidebarIcon'/>
                                    Users
                                </li>
                            </Link>
                            <Link to="/products" className='link'>
                                <li className="sidebarListItem">
                                    <PlayCircleOutline className='sidebarIcon'/>
                                    Products
                                </li>
                            </Link>
                            <Link to="/newproduct" className='link'>
                                <li className="sidebarListItem">
                                    <ListAltOutlined className='sidebarIcon'/>
                                    Add Product
                                    </li>
                                </Link>
                            </>
                        )}
                    </ul>
            </div>
        </div>
    </div>
  )
}
