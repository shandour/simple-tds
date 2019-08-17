import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { EditButton } from "./Buttons";
import { Row, CenteredTitle, ErrorTitle } from "./PageElements";
import { getDate, getFullLink } from "./utils";
import { axios } from "../axios";

export default ({ match: { params } }) => {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggledForLink, setToggledForLink] = useState({});

  const loadData = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await axios.get(`ip/${params.ip}`);
      if (result.data) {
        setData(result.data);
      }
    } catch (e) {
      setError(
        "Network error. Check your Internet connection and try reloading the page."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (error) return <ErrorTitle>{error}</ErrorTitle>;

  const checkToggled = link => {
    return Boolean(toggledForLink[link]);
  };

  const setToggled = link => {
    const prevToggled = checkToggled(link);
    const toggledStates = { ...toggledForLink };
    toggledStates[link] = !prevToggled;
    setToggledForLink(toggledStates);
  };

  const getButton = (link, text) => (
    <EditButton onClick={() => setToggled(link)}>{text}</EditButton>
  );

  const getAllData = (link, allTimes) => {
    if (!allTimes || !allTimes.length) return null;

    const toggled = checkToggled(link);
    if (!toggled) {
      return getButton(link, "Show all");
    }

    return (
      <>
        <ul>
          {allTimes.map(t => (
            <li key={t}>{getDate(t)}</li>
          ))}
        </ul>
        {getButton(link, "Hide all")}
      </>
    );
  };

  const dataEntries = Object.entries(data.urlInfo || {});

  return (
    <>
      <CenteredTitle>{data.ip}</CenteredTitle>
      {dataEntries && (
        <OverFlowDiv>
          <TableContainer>
            <HeaderRow key="header">
              <MidCol>Link accessed</MidCol>
              <SmallCol>Last access time</SmallCol>
              <MidCol>All access times</MidCol>
            </HeaderRow>
            {dataEntries.map(e => (
              <BorderedRow key={e[0]}>
                <MidCol>
                  <Link to={`/link/${e[0]}`}>{getFullLink(e[0])}</Link>
                </MidCol>
                <SmallCol>{getDate(e[1].lastRequestTime)}</SmallCol>
                <MidCol>{getAllData(e[0], e[1].allTimes)}</MidCol>
              </BorderedRow>
            ))}
          </TableContainer>
        </OverFlowDiv>
      )}
    </>
  );
};

const SmallCol = styled.div`
  width: 20%;
`;

const MidCol = styled.div`
  width: 40%;
`;

const TableContainer = styled.div`
  border: solid black 1px;
  min-width: 1000px;
`;

const BorderedRow = styled(Row)`
  border-top: solid black 1px;
  align-items: center;
`;

const HeaderRow = styled(Row)`
  font-weight: bold;
`;

const OverFlowDiv = styled.div`
  overflow-x: scroll;
`;
