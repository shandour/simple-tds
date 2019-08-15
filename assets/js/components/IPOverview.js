import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {Row, CenteredTitle, ErrorTitle} from './PageElements';
import {axios} from '../axios';


export default ({match: {params}}) => {
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await axios.get(`ip/${params.ip}`);
            if (result.data) {
                setData(result.data);
            }
        } catch(e) {
                setError('Network error. Check your Internet connection and try reloading the page.');
        }
        finally {
            setLoading(false);
        }
        };

    useEffect(() => {
        loadData();
    }, []);

    if (error) return <ErrorTitle>{error}</ErrorTitle>;

    return null;
};
