import React, {useEffect, useState} from 'react';

import {Link} from 'react-router-dom';

import {getFullLink, landingPagesWithCountryValues, validateLandingPages, prepareCountriesForReactSelect} from './utils';
import {Row, CenteredTitle } from './PageElements';
import LandingPagesForm from './LinkForms/LandingPagesForm';
import {axios} from '../axios';

export default ({history, match: {params}}) => {
    const [url, setUrl] = useState('');
    const [landingPages, setLandingPages] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const getData = async () => {
        setErrors({});
        setLoading(true);
        try {
            const resp = await axios.get(`links/${params.link}/`);
            if (resp.data) {
                setUrl(resp.data.url || '');
                setLandingPages(
                    prepareCountriesForReactSelect(resp.data.landingPages)
                );
            }
        } catch({response}) {
            if (response) {
                setErrors(response.data);
            } else {
                setErrors(
                    {
                        'nonFieldErrors': ['Network error. Check your Internet connection and try reloading the page.'],
                    });
            }
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            validateLandingPages(landingPages);

            const data = {
                url,
                landingPages: landingPagesWithCountryValues(landingPages),
            }
            const resp = await axios.put(`links/${params.link}/`, data);
            history.push(`/link/${params.link}`);
        } catch ({response}) {
            if (response) {
                setErrors(response.data);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <CenteredTitle>Edit page for link  {getFullLink(params.link)}</CenteredTitle>
            {landingPages &&
            <LandingPagesForm
        submit={submit}
        loading={loading}
        landingPages={landingPages}
        setLandingPages={setLandingPages}
        errors={errors}
        setErrors={setErrors}
             />
            }
        </>
    );
};


