import React, { useState, useEffect } from 'react';
import { RouterDivision, WidthDiv } from './RouterDivision';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import { useRecoilValue } from 'recoil';
import { userApi } from './api/api';
import Login from './views/login/Login';
import Main from './views/main/Main';
import * as recoilItem from './util/recoilItem';
import Footer from './footer/Footer';
import Company from './views/company/Company';
import CompanyList from './views/companylist/CompanyList';
import Search from './views/search/Search';

export default ({ match, location }) => {
    const [NavVisible, setNavVisible] = useState(true);
    const updated = useRecoilValue(recoilItem.state_token);
    const onClickMenu = () => {
        setNavVisible(!NavVisible);
    };

    return (
        <BrowserRouter>
            <RouterDivision>
                <Sidebar NavVisible={NavVisible} setNavVisible={setNavVisible} onClickMenu={onClickMenu} />
                <WidthDiv>
                    <Header NavVisible={NavVisible} onClickMenu={onClickMenu} />

                    <Routes>
                        <Route path="/main" element={<Main />}></Route>
                        <Route path="/" element={<Login />}></Route>
                        <Route path="/callback" element={<Login />}></Route>
                        <Route path="/company" element={<Company />}></Route>
                        <Route path="/search" element={<Search />}></Route>
                        <Route path="/list/:page" element={<CompanyList />}></Route>
                    </Routes>
                </WidthDiv>
            </RouterDivision>
            <Footer />
        </BrowserRouter>
    );
};
