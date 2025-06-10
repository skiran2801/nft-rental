import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const ListingForm = ({ onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerDay: '',
    minDuration: '1',
    maxDuration: '30',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setError('Please upload an image file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.image) {
        throw new Error('Please upload an NFT image');
      }

      if (!formData.name.trim()) {
        throw new Error('Please enter a name for your NFT');
      }

      if (!formData.pricePerDay || parseFloat(formData.pricePerDay) <= 0) {
        throw new Error('Please enter a valid daily price');
      }

      await onSubmit(formData);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          NFT Image
        </label>
        <div 
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-64 mx-auto rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex flex-col items-center text-sm text-gray-600">
                <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isProcessing}
                  />
                </label>
                <p>or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          NFT Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="My Awesome NFT"
          required
          disabled={isProcessing}
        />
      </div>

      {/* Price Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price per Day (ETH)
        </label>
        <input
          type="number"
          name="pricePerDay"
          step="0.001"
          value={formData.pricePerDay}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.1"
          required
          disabled={isProcessing}
        />
      </div>

      {/* Duration Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Duration (days)
          </label>
          <input
            type="number"
            name="minDuration"
            value={formData.minDuration}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="1"
            required
            min="1"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Duration (days)
          </label>
          <input
            type="number"
            name="maxDuration"
            value={formData.maxDuration}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="30"
            required
            min="1"
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your NFT..."
          rows="3"
          disabled={isProcessing}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isProcessing}
          className={`px-4 py-2 rounded-lg text-white ${
            isProcessing 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Create and List NFT'}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;