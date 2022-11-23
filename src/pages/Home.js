import React, { useContext, useEffect, useState } from 'react';
import OrderDataTable from '../Component/OrderDataTable';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import SellerDataTable from '../Component/SellerDataTable';
import UserDataTable from '../Component/UserDataTable';

export default function Home() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, Setloading] = useState(false)
    useEffect(() => {
        if (!user.jwt) {
            navigate("/login");
        }
    }, [user])

    return (
        <>
            {!loading && (
                <>
                    <div className="layout-topbar">
                        <span>Dashboard</span>
                        <ul className={"layout-topbar-menu lg:flex origin-top layout-topbar-menu-mobile-active"}>
                            <li>
                                <button onClick={() => logout()} className="p-link layout-topbar-button" >
                                    <i className="pi pi-user-minus" />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="layout-main-container">
                        <div className="layout-main">
                            <div className="grid">
                                <div className="col-12">
                                    <OrderDataTable />
                                </div>
                                <div className="col-12">
                                    <SellerDataTable />
                                </div>
                                <div className="col-12">
                                    <UserDataTable />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}