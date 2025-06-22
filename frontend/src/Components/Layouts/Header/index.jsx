import React from 'react';
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
import { IoMdQrScanner } from "react-icons/io";

import { STORE_NAME } from '../../../constants';
import Logo from '../Logo';
import HyperLink from '../../HtmlTags/Link';
import Button from '../../HtmlTags/Button';
import HeaderInformation from '../HeaderInformation';

class Header extends React.PureComponent {
    render() {
        return (
            <>
            <HeaderInformation />
            <header>
                <div className='lg'>
                    <div className='row-1'>
                        <HyperLink to={"/"} text={STORE_NAME} icon={<Logo />} />
                    </div>

                    <div className='row-2'>
                        <HyperLink to={"/"} text={"Home"} />
                        <HyperLink to={"/events"} text={"Event"} />
                        <HyperLink to={"/organizers"} text={"Organizers"} />

                        <HyperLink to={"/blog"} text={"Blog"} />
                        <HyperLink to={"/contact"} text={"Contact Us"} />
                    </div>

                    <div className='row-3'>
                        <Button text={<HyperLink to={"/login"} text={"Login"}/>}/>
                        <Button type={"secondary"} text={<HyperLink to={"/organizer/signup"} text={"Register an event"}/>}/>
                    </div>
                </div>


                <div className='md'>
                    <div className='row-1'>
                        <CiMenuFries className='menu-icon' size={30}/>
                    </div>

                    <div className='row-2'>
                        <Logo size={30}/>
                    </div>

                    <div className='row-3'>
                        <IoMdQrScanner size={25}/>
                    </div>

                </div>
            </header>
            </>
        )
    }

}

export default Header;