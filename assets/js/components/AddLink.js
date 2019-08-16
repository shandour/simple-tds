import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {getFullLink} from './utils';
import {Row, CenteredTitle, ErrorTitle} from './PageElements';
import LandingPagesForm from './LinkForms/LandingPagesForm';
import {axios} from '../axios';

export default () => {
    const [url, setUrl] = useState('');
    const [landingPages, setLandingPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const getUrl = async () => {
        setErrors({});
        setLoading(true);
        try {
            const result = await axios.get('links/get-url/');
            if (result.data) {
                setUrl(result.data.url || '');
            }
        } catch({response}) {
            if (response) {
                setErrors(response.data);
            } else {
                setErrors(
                    {
                        'nonFieldErrors':  'Network error. Check your Internet connection and try reloading the page.'
                    });
            }
        }
        finally {
            setLoading(false);
        }
    };

    const submit = async () => {
        // set loading
        // check: if url, if at least 1 landing page
    }

    return (
        <>
            <Row>
            <div>
            {getFullLink(url || 'YOUR SHORT URL')}
            </div>
            <button onClick={getUrl} disabled={loading}>Generate short url</button>
            </Row>
            <LandingPagesForm />
        </>
    );
};

