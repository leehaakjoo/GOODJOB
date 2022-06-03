import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanyListPresenter from './CompanyListPresenter';
import { companyApi, userApi } from '../../api/api';
import { useRecoilValue } from 'recoil';
import * as recoilItem from '../../util/recoilItem';

const CompanyListContainer = ({ ...props }) => {
    const navigate = useNavigate();
    
    const [userData, setUserData] = useState(null);
    const token = useRecoilValue(recoilItem.access_token);
    const state = useRecoilValue(recoilItem.state_token);
    const updated = useRecoilValue(recoilItem.user_update_count);
    const [companyList, setCompanyList] = useState([]);
    const [workGroup, setWorkGroup] = useState('');

    const [totalPage, setTotalPage] = useState(1);
    const param = useParams();
    const [page, setPage] = useState(param.page? parseInt(param.page) : 1);
    const fetchData = async () => {
        if (!token || !state) {
            localStorage.clear();
            return;
        } else {
            const formData = {
                code: token,
                state: state,
            };
            let res = null;

            try {
                res = await userApi.getUser(formData);
            } catch (e) {
                alert('세션이 만료되어 로그아웃 되었습니다!');
                navigate('/');
            } finally {
                if (res) {
                    setUserData(res.data);
                    setWorkGroup(res.data.job_group);
                } else{
                    navigate('/');
                }
            }
        }
    };

    const companyFetchData = async () => {
        if(userData == null) return;
        const formData = {
            job_group: userData.job_group,
            page: page,
            commute: Math.pow(2, Math.abs(userData.prefer.commute - 4)),
            pay: Math.pow(2, Math.abs(userData.prefer.pay - 4)),
            welfare: Math.pow(2, Math.abs(userData.prefer.welfare - 4)),
            culture: Math.pow(2, Math.abs(userData.prefer.culture - 4)),
            task: Math.pow(2, Math.abs(userData.prefer.task - 4)),

            ncommute: Math.pow(2, Math.abs(userData.prefer.commute)),
            npay: Math.pow(2, Math.abs(userData.prefer.pay)) ,
            nwelfare: Math.pow(2, Math.abs(userData.prefer.welfare)) ,
            nculture: Math.pow(2, Math.abs(userData.prefer.culture)) ,
            ntask: Math.pow(2, Math.abs(userData.prefer.task)) ,
        };

        let res = null;

        try {
            res = await companyApi.list(formData);
        } catch (e) {
        } finally {

            setCompanyList(res.data.companyDtoList);
            setTotalPage(res.data.lastPage);
        }
    };



    useEffect(() => {
        fetchData();
        
    }, [page, updated]);
    useEffect(() => {
        companyFetchData();
    }, [userData, page, updated]);
    return (<CompanyListPresenter
        workGroup = {workGroup}
        companyList = {companyList}
        page = {page}
        setPage = {setPage}
        totalPage = {totalPage}
    />);
};

export default CompanyListContainer;
