import React, {useEffect, useState, useContext, useMemo} from 'react';
import {Link} from 'react-router-dom';
import Select from 'react-select';

import {getDate, getFullLink} from '../utils';
import {Row, CenteredTitle, ErrorTitle} from '../PageElements';
import { UserContext } from "../../App";


const computeCountryOptions = (countries) => {
    if (!countries || !countries.length) return [];
    return countries.map(c => ({value: c.code, label: c.name}));
};

export default () => {
    const {countries} = useContext(UserContext);
    const selectCountries = useMemo(() => computeCountryOptions(countries), [countries]);

    return null;
};

