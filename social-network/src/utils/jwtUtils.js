import jwtDecode from 'jwt-decode';


const getIdFromToken = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    return decodedToken.sub;
};

const jwtUtils = {
    getIdFromToken
};

export default jwtUtils;