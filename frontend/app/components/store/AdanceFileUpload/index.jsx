import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import { FaFileVideo } from 'react-icons/fa';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;  // 2MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

const AdvancedUpload = (props) => {
  const { error, onFilesChange } = props;
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
  return () => {
    files.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
  };
  }, [files]);

  const validateFile = (file) => {
    if (file.type.startsWith('image/')) {
      if (file.size > MAX_IMAGE_SIZE) {
        return `Image "${file.name}" exceeds 2MB limit.`;
      }
    } else if (file.type.startsWith('video/')) {
      if (file.size > MAX_VIDEO_SIZE) {
        return `Video "${file.name}" exceeds 20MB limit.`;
      }
    } else {
      return `File "${file.name}" is not an accepted type.`;
    }
    return null;
  };

const handleFiles = (selectedFiles) => {
  let newFiles = [];
  let newErrors = [];

  const currentImageCount = files.filter((f) => f.type?.startsWith('image/')).length;

  Array.from(selectedFiles).forEach((file) => {
    const error = validateFile(file);
    if (error) {
      newErrors.push(error);
    } else {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (isImage && currentImageCount + newFiles.filter(f => f.type?.startsWith('image/')).length >= 5) {
        newErrors.push(`Cannot upload more than 5 images.`);
        return; // skip this file
      }
      const currentVideoCount = files.filter(f => f.type?.startsWith('video/')).length;
      if (isVideo && currentVideoCount >= 1) {
        newErrors.push('Only 1 video is allowed.');
        return;
      }
      newFiles.push(Object.assign(file, { previewUrl: URL.createObjectURL(file) }));
      // newFiles.push(file);
    }
  });

  if (newFiles.length > 0) {
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  }

  setErrors(newErrors);
};


  const onInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = null; // reset input
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="upload-drop-zone"
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          color: '#666',
          position: 'relative',
        }}
        onClick={() => inputRef.current.click()}
      >
        <AiOutlineUpload size={40} />
        <p style={{ marginTop: '10px' }}>
          Upload images (max 2MB) or videos (max 20MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
          style={{ display: 'none' }}
          onChange={onInputChange}
        />
      </div>

      {errors.length > 0 && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div>
          <div style={{ marginTop: 10, fontSize: 14, color: '#333' }}>
            {`${files.filter(f => f.type.startsWith('image/')).length} / 5 images`}
            {' • '}
            {`${files.filter(f => f.type.startsWith('video/')).length} / 1 video`}
          </div>
        <div
          style={{
            marginTop: '15px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          {files.map((file, i) => {
            if (file.type.startsWith('image/')) {
              // Show image thumbnail
              // const url = URL.createObjectURL(file);
              return (
                <div key={i} style={{ position: 'relative' }}>
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <button
                    onClick={() => removeFile(i)}
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      cursor: 'pointer',
                    }}
                    title="Remove"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              );
            } else if (file.type.startsWith('video/')) {
              // Show video icon + filename
              return (
                <div
                  key={i}
                  style={{
                    width: 120,
                    height: 120,
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    padding: 10,
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#333',
                  }}
                >
                  <FaFileVideo size={40} color="#555" />
                  <div
                    style={{
                      marginTop: 6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                    title={file.name}
                  >
                    {file.name}
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      cursor: 'pointer',
                    }}
                    title="Remove"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>
        </div>
      )}
    <span className='invalid-message'>{error && error[0]}</span>
    </div>
  );
};

export default AdvancedUpload;
