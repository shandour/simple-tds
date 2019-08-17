import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { LongGrayButton } from "./Buttons";
import {
  getFullLink,
  landingPagesWithCountryValues,
  validateLandingPages
} from "./utils";
import { Row } from "./PageElements";
import LandingPagesForm from "./LinkForms/LandingPagesForm";
import { axios } from "../axios";

export default ({ history }) => {
  const [url, setUrl] = useState("");
  const [landingPages, setLandingPages] = useState([
    {
      url: "",
      weight: 1,
      country: null
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getUrl = async () => {
    setErrors({});
    setLoading(true);
    try {
      const resp = await axios.get("links/get-url/");
      if (resp.data) {
        setUrl(resp.data.url || "");
      }
    } catch ({ response }) {
      if (response) {
        setErrors(response.data);
      } else {
        setErrors({
          nonFieldErrors: [
            "Network error. Check your Internet connection and try reloading the page."
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateLandingPages = landingPages => {
    let success = true;
    const errors = [];
    if (!landingPages.length) {
      success = false;
    }
    landingPages.forEach((lPage, idx) => {
      errors[idx] = {};
      if (!lPage.url) {
        errors[idx] = { url: "This field cannot be empty" };
        success = false;
      }
    });

    if (!success) {
      setErrors({
        landingPages: errors
      });
      throw Error("Landing page validation failed");
    }
  };

  const landingPagesWithCountryValues = landingPages =>
    landingPages.map(lp => {
      lp.country = lp.country ? lp.country.value : null;
      return lp;
    });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      validateLandingPages(landingPages);

      const data = {
        url,
        landingPages: landingPagesWithCountryValues(landingPages)
      };
      const resp = await axios.post("links/", data);
      history.push(`/link/${resp.data.url}`);
    } catch ({ response }) {
      if (response) {
        setErrors(response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CenterAlignRow>
        <LinkDiv>{getFullLink(url || "YOUR SHORT URL")}</LinkDiv>
        <MarginLeftButton onClick={getUrl} disabled={loading}>
          Generate short url
        </MarginLeftButton>
      </CenterAlignRow>
      {url && (
        <LandingPagesForm
          submit={submit}
          loading={loading}
          landingPages={landingPages}
          setLandingPages={setLandingPages}
          errors={errors}
          setErrors={setErrors}
        />
      )}
    </>
  );
};

const CenterAlignRow = styled(Row)`
  align-items: center;
  flex-wrap: wrap;
`;

const MarginLeftButton = styled(LongGrayButton)`
  margin-left: -6px;
`;

const LinkDiv = styled.div`
  border: 0.5px solid gray;
  padding: 10px;
`;
