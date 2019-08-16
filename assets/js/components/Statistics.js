import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {getDate, getFullLink} from './utils';
import {Row, CenteredTitle, ErrorTitle} from './PageElements';
import ClicksChart from './ClicksChart';
import {axios} from '../axios';


export default ({history, match: {params}}) => {
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const redirectLink = getFullLink(params.link);
    const editLink = `/link/${params.link}/edit`;

    const loadData = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await axios.get(`links/${params.link}/`);
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
            <button onClick={() => history.push(editLink)}>Edit Link</button>
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
                                      {lp.country && <div>Country: {lp.country.name}</div>}
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
                                -- last access time: {getDate(e[1])}
                            </div> 
                        )}
                    {!showChart ?
                        <button onClick={() => setShowChart(true)}
                        >Show Clicks data for the last 24 hours
                     </button>
                     :
                     <ClicksChart link={params.link} />
                    }
                    
                </div>
        ) : (
                <div>No user statistics for this link </div>
        )}
        </div>
            </>
    );
};
