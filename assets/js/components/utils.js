export const getDate = (dateTime) => {
    let date = ''
    try {
        date = new Date(dateTime).toLocaleString();
    } finally {
        return date;
    }
};

export const getFullLink = (link) => `${window.location.origin}/${link}`;
