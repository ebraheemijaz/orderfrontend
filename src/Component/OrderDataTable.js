
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
import { Dialog } from 'primereact/dialog';

const OrderTable = function OrderDataTable() {
    const { user } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [sellersTotal, setSellersTotal] = useState(null);
    const [detail, setDetail] = useState(null);
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
        setSellersTotal(null)
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
            setSellersTotal(data.sellers_amount)
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
    const handleDetail = (row) => {
        setDetail(row.attributes?.productlist ?? [])
    }
    const header1 = renderHeader('filters1');

    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <h5>Order</h5>
                <DataTable value={customers.data}
                    loading={loaidng}
                    paginator rows={10} header={header1} filters={filters1} onFilter={(e) => setFilters1(e.filters)}
                    dataKey="id" responsiveLayout="scroll"
                    stateStorage="session" stateKey="dt-state-demo-session" emptyMessage="No orders found.">
                    <Column field="id" header="Id" ></Column>
                    <Column header="Buyer" body={(row) => (<p>{row.attributes.buyer}</p>)} ></Column>
                    <Column header="BuyersPhone" body={(row) => (<p>{row.attributes.buyerphone}</p>)} ></Column>
                    <Column header="BuyerEmail" body={(row) => (<p>{row.attributes.buyeremail}</p>)} ></Column>
                    <Column header="Amount" body={(row) => (<p>{row.attributes.amount}</p>)} ></Column>
                    <Column header="Recepit" body={(row) => (<p>{row.attributes.receipt}</p>)} ></Column>
                    <Column header="DeliveryTo" body={(row) => (<p>{row.attributes.deliveryto}</p>)} ></Column>
                    <Column header="Seller" body={(row) => (<p>{row.attributes.seller?.data?.attributes?.name}</p>)} ></Column>
                    <Column header="Details" body={(row) => (
                        // eslint-disable-next-line
                        <a href="#" onClick={() => handleDetail(row)}>View Detail</a>
                    )}></Column>
                </DataTable>
                <br />
                <hr />
                {sellersTotal && (
                    <>
                        <h5>Seller Total Amount</h5>
                        <DataTable value={sellersTotal}
                            loading={loaidng}
                            paginator rows={10} filters={filters1} onFilter={(e) => setFilters1(e.filters)}
                            dataKey="id" responsiveLayout="scroll"
                            stateStorage="session" stateKey="dt-state-demo-session" emptyMessage="No orders found.">
                            <Column field="seller_id" header="Id" ></Column>
                            <Column field="name" header="Name" ></Column>
                            <Column field="sum(amount)" header="Total" ></Column>
                        </DataTable>
                    </>
                )}
            </div>

            <Dialog visible={detail !== null} onHide={() => setDetail(null)} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }}>
                <DataTable value={detail}
                    paginator rows={10} filters={filters1} onFilter={(e) => setFilters1(e.filters)}
                    dataKey="id" responsiveLayout="scroll"
                    stateStorage="session" stateKey="dt-state-demo-session" emptyMessage="No product found.">
                    <Column field="amount" header="Amount" ></Column>
                    <Column field="productname" header="Productname" ></Column>
                    <Column field="productocode" header="Productocode" ></Column>
                    <Column field="unit" header="Unit" ></Column>
                </DataTable>
            </Dialog>
        </>
    );
}

export default React.memo(OrderTable);


