import React, { useState } from 'react';
import Input from '../../Common/HtmlTags/Input';
import Button from '../../Common/HtmlTags/Button';
import { FaTrash } from 'react-icons/fa';

const SizeChartManager = ({ sizeQuantity = [], onChange, isLightMode }) => {
  const [newSize, setNewSize] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const addSizeChart = () => {
    if (!newSize.trim() || !newQuantity) return;

    const newSizeChart = {
      size: newSize.trim(),
      quantity: parseInt(newQuantity)
    };

    onChange([...sizeQuantity, newSizeChart]);
    setNewSize('');
    setNewQuantity('');
  };

  const removeSizeChart = (index) => {
    const updated = sizeQuantity.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateSizeChart = (index, field, value) => {
    const updated = sizeQuantity.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: field === 'quantity' ? parseInt(value) || '' : value
        };
      }
      return item;
    });
    onChange(updated);
  };

  return (
    <div className={`size-chart-manager ${isLightMode ? 'p-black' : 'p-white'}`}>
      <h5 style={{ paddingTop: '1em', marginBottom: '1em' }}>Size Chart Management</h5>
      
      {/* Existing Size Charts */}
      {sizeQuantity.length > 0 && (
        <div style={{ marginBottom: '2em' }}>
          <h6>Current Size Charts:</h6>
          {sizeQuantity.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1em', 
              marginBottom: '1em',
              padding: '1em',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}>
              <div style={{ flex: 1 }}>
                <Input
                  type="text"
                  placeholder="Size (e.g., Small, Medium, Large)"
                  value={item.size}
                  onInputChange={(name, value) => updateSizeChart(index, 'size', value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onInputChange={(name, value) => updateSizeChart(index, 'quantity', value)}
                />
              </div>
              <Button
                text={<FaTrash />}
                onClick={() => removeSizeChart(index)}
                style={{ padding: '0.5em 1em', backgroundColor: '#dc3545', color: 'white' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add New Size Chart */}
      <div style={{ 
        padding: '1.5em', 
        border: '2px dashed #9172EC', 
        borderRadius: '8px',
        backgroundColor: isLightMode ? '#f8f9fa' : '#2d2d2d'
      }}>
        <h6>Add New Size Chart:</h6>
        <div style={{ display: 'flex', gap: '1em', alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <Input
              type="text"
              label="Size"
              placeholder="e.g., Small, Medium, Large, XL"
              value={newSize}
              onInputChange={(name, value) => setNewSize(value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              type="number"
              label="Quantity"
              placeholder="Available quantity"
              value={newQuantity}
              onInputChange={(name, value) => setNewQuantity(value)}
            />
          </div>
          <Button
            text="Add Size"
            onClick={addSizeChart}
            disabled={!newSize.trim() || !newQuantity}
            style={{ padding: '1em 1.5em' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SizeChartManager;