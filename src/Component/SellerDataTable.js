
import React, { useContext, useEffect, useState, } from 'react';
import { FilterMatchMode, } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { baseURL } from '../utils';

export default function SellerDataTable() {


    const { user } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const fetchData = async () => {
        if (user.jwt) {
            const { data } = await axios.get(`${baseURL}/api/sellers?populate=*`, {
                headers: {
                    'Authorization': 'Bearer ' + user.jwt
                }
            });
            setCustomers(data?.data?.map(e=> ({...e.attributes, id:e.id})) || [])
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line 
    }, [])
    const [filters1, setFilters1] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const filtersMap = {
        'filters1': { value: filters1, callback: setFilters1 },
    };

    const onGlobalFilterChange = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters['global'].value = value;

        filtersMap[filtersKey].callback(filters);
    }

    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder="Global Search" />
            </span>
        );
    }

    const header1 = renderHeader('filters1');

    return (
        <div className="card">
            <h5>Seller</h5>
            <DataTable value={customers} paginator rows={10} header={header1} filters={filters1} onFilter={(e) => setFilters1(e.filters)}
                dataKey="id" responsiveLayout="scroll"
                stateStorage="session" stateKey="dt-state-demo-session" emptyMessage="No sellers found.">
                <Column field="id" header="Id" ></Column>
                <Column field="name" header="Name" ></Column>
                <Column field="phone" header="Phone" ></Column>
                <Column field="email" header="Email" ></Column>
                <Column field="arpicode" header="Arpicode" ></Column>
            </DataTable>
        </div>
    );
}
