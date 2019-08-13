import React, {useEffect, useContext} from "react";

import { UserContext } from '../App';


export default () => {
    const {logout} = useContext(UserContext);
    useEffect(() => {
        logout();
    }, []);

    return null;
}
