import React, { useState, useEffect } from 'react';
import Input from '../../Common/HtmlTags/Input';
import Button from '../../Common/HtmlTags/Button';
import AdvancedUpload from '../AdanceFileUpload';
import { FaTrash } from 'react-icons/fa';
import { API_URL } from '../../../constants';
import resolveImage from '../ResolveImage';

const ColorImageManager = (props) => {
  const {
    colorAndImage = [],
    onChange,
    isLightMode,
    productColorAndImageToRemove
  } = props;

  const [newColor, setNewColor] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [shouldClearFiles, setShouldClearFiles] = useState(false);

  useEffect(() => {
    if (shouldClearFiles) {
      setShouldClearFiles(false);
    }
  }, [shouldClearFiles]);

  const addColorImage = () => {
    if (!newColor.trim() || newImages.length === 0) return;

    const newColorImage = {
      color: newColor.trim(),
      imageUrl: newImages.map(file => file),
      findFileName: {
        color: newColor.trim(),
        image: newImages.map(file => file.name)
      }
    };

    onChange([...colorAndImage, newColorImage]);
    setNewColor('');
    setNewImages([]);
  };

  const removeColorImage = (index) => {
    const updated = colorAndImage.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateColor = (index, newColorValue) => {
    const updated = colorAndImage.map((item, i) => {
      if (i === index) {
        return { ...item, color: newColorValue };
      }
      return item;
    });
    onChange(updated);
  };

  return (
    <div className={`color-image-manager ${isLightMode ? 'p-black' : 'p-white'}`}>
      <h5 style={{ paddingTop: '1em', marginBottom: '1em' }}>Color & Image Management</h5>
      
      {/* Existing Color Images */}
      {colorAndImage.length > 0 && (
        <div style={{ marginBottom: '2em' }}>
          <h6>Current Colors:</h6>
          {colorAndImage.map((item, index) => (
            <div key={index} style={{ 
              marginBottom: '1.5em',
              padding: '1em',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '1em' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    type="text"
                    placeholder="Color name"
                    value={item?.color}
                    onInputChange={(name, value) => updateColor(index, value)}
                  />
                </div>
                <Button
                  text={<FaTrash />}
                  onClick={() => {
                    removeColorImage(index)
                    productColorAndImageToRemove(item)
                  }}
                  style={{ padding: '0.5em 1em', backgroundColor: '#dc3545', color: 'white' }}
                />
              </div>
              
              {/* Display existing images */}
              {item?.imageUrl && item?.imageUrl.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {item?.imageUrl.map((url, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={typeof url === 'string' ? resolveImage(`${API_URL}${url}`) : URL.createObjectURL(url)}
                      alt={`${item?.color} ${imgIndex + 1}`}
                      style={{ 
                        width: '80px',
                        height: '80px', 
                        objectFit: 'cover', 
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Color Image */}
      <div style={{ 
        padding: '1.5em', 
        border: '2px dashed #9172EC', 
        borderRadius: '8px',
        backgroundColor: isLightMode ? '#f8f9fa' : '#2d2d2d'
      }}>
        <h6>Add New Color:</h6>
        <div style={{ marginBottom: '1em' }}>
          <Input
            type="text"
            label="Color Name"
            placeholder="e.g., Red, Blue, Black, White"
            value={newColor}
            onInputChange={(name, value) => setNewColor(value)}
          />
        </div>
        
        <div style={{ marginBottom: '1em' }}>
          <h6>Upload Images for this Color:</h6>
          <AdvancedUpload
            onFilesChange={(files) => setNewImages(files)}
            limit={5}
            vLimit={0}
            imageLimit={10 * 1024 * 1024}
            clearFiles={shouldClearFiles}
          />
        </div>

        <Button
          text="Add Color"
          onClick={() => {
            addColorImage();
            setShouldClearFiles(true);
          }}
          disabled={!newColor.trim() || newImages.length === 0}
          style={{ padding: '1em 1.5em' }}
        />
      </div>
    </div>
  );
};

export default ColorImageManager;