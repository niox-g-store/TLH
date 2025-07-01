import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DescriptionBox = (props) => {
  const {
    error, onChange,
    formData, placeholder
  } = props;

  return (
    <div style={{ margin: '10px 0px 80px 0px' }}>
      <label>Description:</label>
      <ReactQuill
        theme="snow"
        style={{ height: '200px', marginTop: "10px" }}
        value={formData.description}
        name={'description'}
        onChange={(value) => {
          onChange('description', value)
        }}
        placeholder={placeholder}
      />
      <span style={{color: 'red'}} className='invalid-message'>{error && error[0]}</span>
      </div>
  );
};

export default DescriptionBox;
