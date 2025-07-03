import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';

const DescriptionBox = (props) => {
  const {
    error, onChange,
    formData, placeholder, isLightMode
  } = props;

  return (
    <div style={{ margin: '10px 0px 80px 0px' }}>
      <label>Description</label>
      <ReactQuill
        theme='snow'
        className={`${isLightMode ? 'quill-light' : 'quill-dark'}`}
        style={{ height: '200px', marginTop: "10px" }}
        value={formData.description}
        name={'description'}
        onChange={(value) => {
          onChange('description', value)
        }}
        placeholder={placeholder}
      />
      <span style={{ color: 'red',
                     position: 'relative',
                     bottom: '-70px'}} className='invalid-message'>{error && error}</span>
      </div>
  );
};

export default DescriptionBox;
