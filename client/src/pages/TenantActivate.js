import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, Form, Input } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import GoogleSvg from '../components/svg/GoogleSvg';
import Button from '../components/Bootstrap/Button';
import Spinner from './modals/Spinner';
import * as api from '../api';

class TenantActivate extends Template {
    constructor(props, match) {
        super(props, match);
        this.activationCode = props.match.params.code;

        this.state = {
            activationCodeStatus: 'checking', // 'checking', 'error', 'verified'
        };

        this.createSubStates();
    }

    createSubStates() {
        this.subStates = {
            verified:
                <div>
                    <h2>Activate your account</h2>
                    <hr />
                    <p>
                        Activate your account with
                            </p>
                    <a className='login-link' href='/auth/google'>
                        <button className='btn btn-dark'><GoogleSvg className="googlogo" /></button>
                    </a>

                    <hr />
                    <p>Create a local account</p>
                    <Form className="container-400">
                        <Input
                            password
                            name='pass'
                            value='steven'
                            label='Password'
                        />
                        <Button>Create Account</Button>
                    </Form>
                </div>,
            checking:
                <div>
                    <p>Accessing your account</p>
                    <Spinner />
                </div>,
            error:
                <div>
                    <p>Could not access the account.</p>
                </div>
        }
    }
    componentDidMount() {
        // this.showModal(
        //     <Spinner />, 'Finding your account'
        // );

        api
            .activateUser({ activationCode: this.activationCode })
            .then(result => {
                if (result.status == 'success') {
                    // this.hideModal();
                    this.setState({ activationCodeStatus: 'verified' });
                } else {
                    var err = result.error || 'unknown error';
                    this.setState({ activationCodeStatus: 'error' });
                    this.showModal(<p>There was an error finding your account: {err}</p>, "Error");
                }
            });
    }

    getNavItems() {
        return [
            { path: '/tenant', text: 'Home' },
            { path: '/tenant', text: 'Pay Rent' },
            { path: '/tenant', text: 'Request Maintenance' },
        ];
    }

    getContent() {
        return this.subStates[this.state.activationCodeStatus];
    }
}

export default TenantActivate;