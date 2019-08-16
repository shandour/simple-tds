import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import {getDate, getFullLink} from './utils';
import {Row, CenteredTitle, ErrorTitle, RoundedColDiv, Badge} from './PageElements';
import {EditButton} from './Buttons';
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
            <div>
            <FloatRightEditButton onClick={() => history.push(editLink)}>Edit Link</FloatRightEditButton>
            </div>
            <CenteredTitle>Statistics For Redirect Link {redirectLink}</CenteredTitle>
            <div>
            {(data.landingPages && data.landingPages.length) &&
             <RoundedColDivWithMargin>
             <BottomBorderdDiv>Landing pages</BottomBorderdDiv>
             <LandingPagesContainer>
             {data.landingPages.map((lp, idx) =>
                                   <LandingPageDiv key={lp.id}>
                                    <Badge text={idx + 1} />
                                   <InfoDiv>Url: <a href={lp.url}>{lp.url}</a></InfoDiv>
                                   <InfoDiv>Weight: {lp.weight}</InfoDiv>
                                   {lp.country && <InfoDiv>Country: {lp.country.name}</InfoDiv>}
                                   </LandingPageDiv>
                                  )}
             </LandingPagesContainer>
             </RoundedColDivWithMargin>}
                                                  <RoundedColDivWithMargin>
            <BottomBorderdDiv>General stats</BottomBorderdDiv>
             {!showChart &&
              <FixedFloatingButton onClick={() => setShowChart(true)}
                        >Show Clicks data for the last 24 hours
              </FixedFloatingButton>
             }
            <StatsDiv>
            {data.linkStats ? (
                <>
                    <InfoDiv>Last IP to access the link:{' '}
                <Link to={`/ip/${data.linkStats.lastIp}`}>
                {data.linkStats.lastIp}
            </Link>
                </InfoDiv>
                <InfoDiv>Number of link requests: {data.linkStats.clicks}</InfoDiv>
                <InfoDiv>Number of unique request countries: {data.linkStats.numCountries}</InfoDiv>
                    <InfoDiv>Number of unique users to have requested the link: {data.linkStats.numUniqueUsers}</InfoDiv>
                    </>
        ) : (
            <div>No statistics for this link is available</div>
        )}

                {data.userStats ? (
                        <div>
                        <h4>Unique IPs that accessed the link:</h4>
                        {Object.entries(data.userStats).map(
                            e => <InfoDiv key={e[0]}>
                                <Link to={`/ip/${e[0]}`}>
                                {e[0]}
                            </Link>
                                -- last access time: {getDate(e[1])}
                            </InfoDiv> 
                        )}
                   
                    {showChart &&
                     <ClicksChart link={params.link} />
                    }
                    
                </div>
        ) : (
                <div>No user statistics for this link </div>
        )}
        </StatsDiv>
        </RoundedColDivWithMargin>
        </div>
            </>
    );
};

const BottomBorderdDiv = styled.div`
  border-bottom: 1px black solid;
  font-weight: bold;
  padding: 15px;
  text-align: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: aliceblue;
  height: max-content;
`;

const RoundedColDivWithMargin = styled(RoundedColDiv)`
  margin: 15px;
`;

const LandingPageDiv = styled.div`
  border: 0.5px gray solid;
  box-shadow: 1px 1px;
  padding: 10px;
  min-height: 100px;
  min-width: 200px;
  margin: 5px;
  border-radius: 10px;
`;

const InfoDiv = styled.div`
  margin: 4px;
`;

const StatsDiv = styled.div`
  margin: 5px 10px;
`;

const FixedFloatingButton = styled(EditButton)`
  position: fixed;
  right: 5%;
  margin-top: 50px;
  background-color: steelblue;
  word-break: break-word;
  max-width: 180px;
  height: auto;
  padding: 15px;
`;

const FloatRightEditButton = styled(EditButton)`
  float: right;
  margin-top: 10px;
  margin-right: 10px;
`;

const LandingPagesContainer = styled(Row)`
  flex-wrap: wrap;
`;
