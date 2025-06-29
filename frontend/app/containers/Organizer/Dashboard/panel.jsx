import HeaderPanel from "./Header";
import BodyPanel from "./Body";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css'

export const HomePanel = (props) => {
    return (
        <>
        <HeaderPanel {...props}/>
        <BodyPanel {...props} />
        </>
    )
}