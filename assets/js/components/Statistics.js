import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {Row, CenteredTitle, ErrorTitle} from './PageElements';
import {axios} from '../axios';


export default ({match: {params}}) => {
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const redirectLink = `${window.location.origin}/${params.link}`;

    const loadData = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await axios.get(`links/${params.link}`);
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

    return (
        <>
            <CenteredTitle>Statistics</CenteredTitle>
            <div>Redirect Link: {redirectLink}</div>
            <div>
            {(data.landingPages && data.landingPages.length) &&
             <>
            <h4>Landing pages</h4>
            {data.landingPages.map(lp =>
                                      <Row key={lp.id}>
                                      <div>Url: {lp.url}</div>
                                      <div>Weight: {lp.weight}</div>
                                      {lp.country && <div>Country: {lp.country}</div>}
                                      </Row>
                                     )}
            </>}
        {data.linkStats ? (
                <div>
                <div>Last ip to access the link: {data.linkStats.lastIp}</div>
                <div>Number of link requests: {data.linkStats.clicks}</div>
                <div>Number of unique request countries: {data.linkStats.numCountries}</div>
                <div>Nu,ber of unique users to have requested the link: {data.linkStats.numUniqueUsers}</div>
                </div>
        ) : (
            <div>No statistics for this link is available</div>
        )}

                {data.userStats ? (
                <div>
                        {Object.entries(data.userStats).map(
                            e => <div key={e[0]}>
                                <Link to={`/ip/${e[0]}`}>
                                {e[0]}
                            </Link>
                            -- last access time: {e[1] ? new Date(e[1]).toString(): ''}
                            </div> 
                        )}
                </div>
        ) : (
                <div>No user statistics for thsi link </div>
        )}
        </div>
            </>
    );
};
