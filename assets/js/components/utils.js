export const getDate = (dateTime) => {
    let date = ''
    try {
        date = new Date(dateTime).toLocaleString();
    } finally {
        return date;
    }
};

export const getFullLink = (link) => `${window.location.origin}/${link}`;

export const validateLandingPages = (landingPages) => {
    let success = true;
    const errors = [];
    if (!landingPages.length) {
        success = false;
    }
    landingPages.forEach((lPage, idx) => {
        errors[idx] = {};
        if (!lPage.url) {
            errors[idx] = {'url': 'This field cannot be empty'};
            success = false;
        }
    });

    if (!success) {
        setErrors({
            'landingPages': errors,
        });
        throw Error('Landing page validation failed');
    }
};

export const landingPagesWithCountryValues = (landingPages) => landingPages.map(lp => {
    lp.country = lp.country ? lp.country.value : null;
    return lp;
});


export const prepareCountriesForReactSelect = (landingPages) => landingPages.map(lp => {
    lp.country = lp.country ? {value: lp.country.code, label: lp.country.name} : null;
    return lp;
});
