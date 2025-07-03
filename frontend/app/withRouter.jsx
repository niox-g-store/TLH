import { useParams, useNavigate, useLocation } from 'react-router-dom';

export function withRouter (Component) {
  return function WrappedComponent (props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    return <Component {...props} match={{ params }} navigate={navigate} location={location} />;
  };
}
