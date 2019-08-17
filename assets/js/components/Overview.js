import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { getFullLink } from "./utils";
import { Row, CenteredTitle, ErrorTitle, ColDiv } from "./PageElements";
import { axios } from "../axios";

export default () => {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");

  const loadLinks = async () => {
    setError("");
    try {
      const result = await axios.get("links/");
      if (result.data) {
        setLinks(result.data);
      }
    } catch (e) {
      setError(
        "Network error. Check your Internet connection and try reloading the page."
      );
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  if (error) return <ErrorTitle>{error}</ErrorTitle>;

  return (
    <>
      <CenteredTitle> Your links </CenteredTitle>
      <CenteringColDiv>
        {links.map(link => (
          <ResponsiveRow key={link.url}>
            <Link to={`link/${link.url}`}> {getFullLink(link.url)}</Link>
          </ResponsiveRow>
        ))}
      </CenteringColDiv>
    </>
  );
};

const CenteringColDiv = styled(ColDiv)`
  align-items: center;
`;

const ResponsiveRow = styled(Row)`
  justify-content: center;
  word-break-break-all;
  width: 100%;
  max-width: 400px;
  @media(min-width: 600px) {
    max-width: 500px;
  }
  &:hover {
   box-shadow: 1px 1px gray;
    background-color: aliceblue;
    border-radius: 19px;
 }
`;
