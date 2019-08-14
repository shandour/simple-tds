import React, {useEffect, useState} from 'react';
import { Container, Row } from 'styled-bootstrap-grid';

import axios from '../Axios';

export default () => {
    const [links, setLinks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        setError([]);
        try {
            const result = await axios.get('links/');
            if (result.data) {
                useState(result.data);
            }
            catch(e) {
                setError('Network error. CHeck your Internet connection and try reloading the page.');
            }
        }, []);

              return (
                      <Container>
                      {links.map(link =>
                                 <Row key={link.id}>
                                 {link.url}
                                 </Row>
                                )}
                  </Container>
              );
};
