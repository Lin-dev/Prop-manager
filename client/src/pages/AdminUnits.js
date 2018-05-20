import React from 'react';
// import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import { Select } from '../components/Bootstrap';
import { Table } from '../components/Table';
import * as api from '../api';

class AdminUnits extends Template {
    constructor(props) {
        super(props)
        this.state = {
            // unitNames: ['101', '102', '103', '104', '201', '202'],
            // selectedUnit: '103',
            units: [],
        };

        this.unitColumns = [
            { name: 'unitName', label: 'Unit' },
            { name: 'rate', label: 'Rent' },
            { name: 'users', label: 'Tenant(s)' },
        ];

        this.tableTransform = this.tableTransform.bind(this);
    }

    componentDidMount() {
        api.getUnitList()
            .then(response => {
                console.log(response);
                this.setState({ units: response.units });
            }).catch(err => {
                console.log(err);
            });
    }

    tableTransform(col, val, item) {
        if (col == 'rate') return '$' + val.toFixed(2);
        if (col == 'users') return val.map(user => user.fullname).join(', ');
        return val;
    }

    getNavItems() {
        return [
            { path: '/admin/overview', text: 'Overview' },
            { path: '/admin/units', text: 'Units' },
            { path: '/admin/maint', text: 'Maintenance' },
            { path: '/admin/payments', text: 'Payments' },
            { path: '/admin/users', text: 'Users' },
        ];
    }

    getContent() {
        var data = {
            columns: this.unitColumns,
            items: this.state.units,
        };

        return (
            <div>
                <h1>Units</h1>
                {/* <Select
                    items={this.state.unitNames}
                    value={this.state.selectedUnit}
                    onChange={() => { }}
                /> */}
                <Table data={data} transform={this.tableTransform}/>    
                
            </div>
        );
    }
}

export default AdminUnits;