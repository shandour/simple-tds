import React from 'react';

import {Row} from '../PageElements';
import Select from 'react-select';


export default ({
    idx,
    data,
    countries,
    deleteLandingPage,
    setLandingPageFieldValue,
    getErrors,
    loading,
}) => (
        <Row>
        <button type="button" onClick={() => deleteLandingPage(idx)}>Delete landing page</button>
        <input
    type="url"
    name="url"
    onChange={(e) => setLandingPageFieldValue(idx, e.target.name, e.target.value)}
    value={data.url || ''}
    disabled={loading}
    placeholder="Provide a url."
    required
        />
        {getErrors(idx, 'url')}
    
            <input
    type="number"
    name="weight"
    min="1"
    onChange={(e) => setLandingPageFieldValue(idx, e.target.name, e.target.value)}
    value={data.weight || 1}
    placeholder="Assign a weight."
    disabled={loading}
        />
        {getErrors(idx, 'weight')}

   <Select
    value={data.country || null}
    name="country"
    onChange={(selectedOption) => setLandingPageFieldValue(idx, 'country', selectedOption)}
    options={countries}
    isSearchable
        />
        
        {getErrors(idx, 'url')}
        </Row>
)
