import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Redirect({ to }) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to);
    }, [to, navigate]);
    return null;
}

export default Redirect;