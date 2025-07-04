import Row from "../../Common/Row";
import { GoBack } from "../../../containers/goBack/inedx";

const Back = (props) => {
    const { parent, text, isLightMode, navigate } = props;
    return (
        <Row
          style={{
            marginBottom: '-1em',
            justifyContent: 'space-between',
            padding: '0em 1em'
          }}
          className='d-flex'
        >
          <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>{parent}</h2>
          <GoBack navigate={navigate} text={text}/>
        </Row>
    )

}

export default Back;
