import React, {useEffect, useState, useContext, useMemo} from 'react';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import styled from 'styled-components';

import {AddButton, CancelButton, SubmitButton} from '../Buttons';
import LandingPageFormRow from './LandingPageFormRow';
import {ErrorDiv} from '../FormComponents';
import {LandingPagesContainer} from '../PageElements';
import { UserContext } from "../../App";


const computeCountryOptions = (countries) => {
    if (!countries || !countries.length) return [];
    return [
        ...[{value: null, label: 'No country'}],
        ...countries.map(c => ({value: c.code, label: c.name})),
        ]
};

export default ({
    submit,
    loading,
    landingPages,
    setLandingPages,
    errors,
    setErrors,
}) => {
    const {countries} = useContext(UserContext);
    const selectCountries = useMemo(() => computeCountryOptions(countries), [countries]);
    const {landingPages: landingPageErrors=[] }= errors;

    const getErrors = (idx, field) => {
        if (Object.entries(landingPageErrors[idx] || {}).length === 0) return null;

        return (
                <ErrorDiv>
                {Object.values(landingPageErrors[idx][field] || {}).join('. ')}
            </ErrorDiv>
        );
    };

    const deleteLandingPage = (idx) => {
        const newLandingPages = [...landingPages];
        const newLandingPageErrors = [...landingPageErrors];
        newLandingPages.splice(idx, 1);
        landingPageErrors.splice(idx, 1);
        setLandingPages(newLandingPages);
        setErrors({
            ...errors,
            ...{'landingPages': newLandingPageErrors},
        });
    };

    const addLandingPage = () => {
        const newLandingPages = [...landingPages];
        newLandingPages.push({
            url: '',
            weight: 1,
            country: null,
        });
        setLandingPages(newLandingPages);
    };

    const setLandingPageFieldValue = (idx, name, value) => {
        const newLandingPages = [...landingPages];
        newLandingPages[idx][name] = value;
        setLandingPages(newLandingPages);
    }

    return (
        <>
            <form onSubmit={submit}>
            <LandingPagesContainer>
            {landingPages.map((lp, idx) =>
                              <>
                              <LandingPageFormRow key={`lp-${idx}`}
                              idx={idx}
                              data={lp}
                              countries={selectCountries}
                              deleteLandingPage={deleteLandingPage}
                              setLandingPageFieldValue={setLandingPageFieldValue}
                              getErrors={getErrors}
                              loading={loading}
                              />
                              </>
                             )}
                    <AddButton onClick={addLandingPage}>Add Landing page</AddButton>
            </LandingPagesContainer>
            <OuterSubmitBtnDiv>
            <div>
            <SubmitButton type="submit">Submit</SubmitButton>
</div>
        </OuterSubmitBtnDiv>
            </form>
            {(errors.nonFieldErrors && errors.nonFieldErrors.length) &&
             <ErrorDiv>{errors.nonFieldErrors.join('. ')}</ErrorDiv>}
        </>
    );
};

const OuterSubmitBtnDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px;
}
`;
