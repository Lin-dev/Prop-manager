import React from 'react';
import { Form, Input, Select, Container, Row, Col } from '../../../components/Bootstrap';
import './NewUser.css';
import Button from '../../../components/Bootstrap/Button';
import Spinner from '../Spinner';
import * as api from '../../../api';

const phoneRegex = /^[1-9]\d{2}-\d{3}-\d{4}/;
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;

const validStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
    "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
    "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

class NewUser extends React.Component {
    constructor(props) {
        super(props);

        var initialData = props.initialData || {};
        this.state = {
            fullname: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            unit: 1, // selected UnitId
            unitList: null,
            // [ // value is the UnitId, text is the unit's name
            //     { value: 0, text: '101' },
            //     { value: 1, text: '102' },
            //     { value: 2, text: '103' },
            // ],
            errors: {

            },
            ...initialData,
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getError = this.getError.bind(this);
        this.onReset = this.onReset.bind(this);
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    componentDidMount() {
        api.getUnitList().then(result => {
            // console.log(result);
            // console.log({
            //     unitList: result.units.map(unit => ({
            //         value: unit.id,
            //         text: unit.unitName,
            //     }))
            // });
            this.setState({
                unitList: result.units.map(unit => ({
                    value: unit.id,
                    text: unit.unitName,
                }))
            });

        }).catch(err => {
            alert('There was an error accessing the server.');
            console.log(err);
            // TODO: something better than an alert (we don't have access to showModal right here)
        });
    }

    onSubmit(e) {
        e.preventDefault();

        var errors = {};

        var notBlank = ['fullname', 'address', 'city'];
        notBlank.forEach(field => {
            if (this.state[field].trim().length == 0) errors[field] = 'Required';
        });
        if (!phoneRegex.test(this.state.phone)) {
            errors.phone = "Format should be xxx-xxx-xxxx";
        }
        if (!emailRegex.test(this.state.email)) {
            errors.email = "Email does not appear to be valid";
        }
        if (!validStates.includes(this.normalizeState(this.state.state))) {
            errors.state = "Not a valid US state."
        }
        if (!zipRegex.test(this.state.zip)) {
            errors.zip = "Not a valid ZIP code"
        }

        this.setState({ errors: errors });

        var hasErrors = Object.getOwnPropertyNames(errors).length > 0;

        if (!hasErrors) {
            var submitEvent = this.props.onSubmit;
            if (submitEvent) submitEvent({
                fullname: this.state.fullname,
                phone: this.state.phone,
                email: this.state.email,
                address: this.state.address,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zip,
                unit: this.state.unit,
            });
        }
    }

    onReset(e) {
        e.preventDefault();

        this.setState({
            errors: {},
            fullname: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zip: '',
        });
    }

    normalizeState(str) {
        return str.trim().toUpperCase();
    }

    getError(name) {
        return this.state.errors[name] || null;
    }

    render() {
        return (
            <div className='new-user-modal'>
                {this.state.unitList ? (
                    <Container>
                        <Form>
                            <Row>
                                <Select className='col-12' label="Unit" name='unit' items={this.state.unitList} value={this.state.unit} onChange={this.onInputChange} />
                                <Input className='col-12' label='Full name' name='fullname' value={this.state.fullname} placeholder='' onChange={this.onInputChange} errorText={this.getError('fullname')} />
                            </Row>
                            <Row>
                                <Input className='col-md-6 col-12' label='Phone' name='phone' value={this.state.phone} placeholder=' xxx-xxx-xxxx' onChange={this.onInputChange} errorText={this.getError('phone')} />
                                <Input className='col-md-6 col-12' label='Email' name='email' value={this.state.email} placeholder='' onChange={this.onInputChange} errorText={this.getError('email')} />
                            </Row>
                            <Row>
                                <Input className='col-12' label='Address' name='address' value={this.state.address} placeholder='' onChange={this.onInputChange} errorText={this.getError('address')} />
                            </Row>
                            <Row>
                                <Input className='col-md-6 col-12' label='City' name='city' value={this.state.city} placeholder='' onChange={this.onInputChange} errorText={this.getError('city')} />
                                <Input className='col-md-2 col-4' label='State' name='state' value={this.state.state} placeholder='' onChange={this.onInputChange} errorText={this.getError('state')} />
                                <Input className='col-md-4 col-8' label='Zip' name='zip' value={this.state.zip} placeholder='' onChange={this.onInputChange} errorText={this.getError('zip')} />
                            </Row>
                            <Button onClick={this.onSubmit}>Create User</Button>
                            &emsp;
                            <Button onClick={this.onReset}>Reset Form</Button>
                        </Form>
                    </Container>    
                ) : (
                    <Spinner />
                )}

            </div>
        );
    }
}

export default NewUser;