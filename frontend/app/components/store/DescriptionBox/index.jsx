import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';

const DescriptionBox = (props) => {
  const {
    error, onChange,
    formData, placeholder, isLightMode,
    label = "Description", type = "description"
  } = props;

  if (type === 'bio') {
    return (
    <div style={{ margin: '10px 0px 80px 0px' }}>
      <label>{label}</label>
      <ReactQuill
        theme='snow'
        className={`${isLightMode ? 'quill-light' : 'quill-dark'}`}
        style={{ height: '200px', marginTop: "10px" }}
        value={formData.bio}
        name={'bio'}
        onChange={(value) => {
          onChange('bio', value)
        }}
        placeholder={placeholder}
      />
      <span style={{ color: 'red',
                     position: 'relative',
                     bottom: '-50px'}} className='invalid-message'>{error && error}</span>
      </div>
  );
  } else {

  return (
    <div style={{ margin: '10px 0px 80px 0px' }}>
      <label>{label}</label>
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
                     bottom: '-50px'}} className='invalid-message'>{error && error}</span>
      </div>
  );
}
};

export default DescriptionBox;
