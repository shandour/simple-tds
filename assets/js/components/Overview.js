import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {getFullLink} from './utils';
import {Row, CenteredTitle, ErrorTitle} from './PageElements';
import { axios } from '../axios';

export default () => {
    const [links, setLinks] = useState([]);
    const [error, setError] = useState('');

    const loadLinks = async () => {
                setError('');
        try {
            const result = await axios.get('links/');
            if (result.data) {
                setLinks(result.data);
            }
        } catch(e) {
                setError('Network error. Check your Internet connection and try reloading the page.');
            }
        };

    useEffect(() => {
        loadLinks();
    }, []);

    if (error) return <ErrorTitle>{error}</ErrorTitle>;

    return (
            <>
            <CenteredTitle> Your links </CenteredTitle>
        {links.map(link =>
                   <Row key={link.url}>
                   <Link to={`link/${link.url}`}> {getFullLink(link.url)}</Link>
                   </Row>)
        }
        </>);
};
