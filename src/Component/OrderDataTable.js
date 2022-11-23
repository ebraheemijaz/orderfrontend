
import React, { useContext, useEffect, useRef, useState, } from 'react';
import { FilterMatchMode, } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { baseURL } from '../utils';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const OrderTable = function OrderDataTable() {
    const { user } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [loaidng, setLoaing] = useState(false);
    const [query, setQuery] = useState({
        startingRange: 0,
        endingRange: 0
    });
    const toast = useRef()

    const fetchData = async () => {
        if (user.jwt) {
            const { data } = await axios.get(`${baseURL}/api/orders?populate=*`, {
                headers: {
                    'Authorization': 'Bearer ' + user.jwt
                }
            });
            setCustomers(data ?? { data: [], meta: {} })
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line 
    }, [])
    const [filters1, setFilters1] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const handleQuerySearch = async () => {
        if (query.startingRange >= query.endingRange) {
            toast.current.show({ severity: 'error', summary: 'Invalid Range', detail: 'Ending range should be greater than starting range' });
            return
        }
        setLoaing(true)
        if (user.jwt) {
            const { data } = await axios.get(`${baseURL}/api/orders/?populate=*&&filters[id][$gte][0]=${query.startingRange}&filters[id][$lte][1]=${query.endingRange}`, {
                headers: {
                    'Authorization': 'Bearer ' + user.jwt
                }
            });
            setCustomers(data ?? { data: [], meta: {} })
        }
        setLoaing(false)
    }

    const renderHeader = () => {
        return (
            <span>
                <InputText type="number" value={query.startingRange} onChange={(e) => setQuery({ ...query, startingRange: e.target.value })} placeholder="Starting Range" style={{ marginLeft: 5 }} />
                <InputText type="number" value={query.endingRange} onChange={(e) => setQuery({ ...query, endingRange: e.target.value })} placeholder="Ending Range" style={{ marginLeft: 5 }} />
                <Button label="Search" onClick={handleQuerySearch} style={{ marginLeft: 5 }} />
            </span>
        );
    }

    const header1 = renderHeader('filters1');

    return (
        <div className="card">
            <Toast ref={toast} />
            <h5>Order</h5>
            <DataTable value={customers.data}
                loading={loaidng}
                paginator rows={10} header={header1} filters={filters1} onFilter={(e) => setFilters1(e.filters)}
                dataKey="id" responsiveLayout="scroll"
                stateStorage="session" stateKey="dt-state-demo-session" emptyMessage="No customers found.">
                <Column field="id" header="Id" ></Column>
                <Column header="Buyer" body={(row) => (<p>{row.attributes.buyer}</p>)} ></Column>
                <Column header="BuyersPhone" body={(row) => (<p>{row.attributes.buyerphone}</p>)} ></Column>
                <Column header="BuyerEmail" body={(row) => (<p>{row.attributes.buyeremail}</p>)} ></Column>
                <Column header="Amount" body={(row) => (<p>{row.attributes.amount}</p>)} ></Column>
                <Column header="Recepit" body={(row) => (<p>{row.attributes.receipt}</p>)} ></Column>
                <Column header="DeliveryTo" body={(row) => (<p>{row.attributes.deliveryto}</p>)} ></Column>
                <Column header="Seller" body={(row) => (<p>{row.attributes.seller?.data.attributes?.name}</p>)} ></Column>
            </DataTable>
        </div>
    );
}

export default React.memo(OrderTable);


