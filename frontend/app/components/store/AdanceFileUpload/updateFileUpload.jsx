import React, { useState, useEffect } from 'react';
import { FaFileVideo } from 'react-icons/fa';

/**
 * AdvancedUploadHelper Component
 *
 * This component is designed to display and manage a list of image and video URLs.
 * It allows users to preview the provided URLs and remove them from the list.
 * Changes to the list of URLs are communicated back to the parent component
 * via the onUrlsChange callback. Additionally, when a URL is removed, the
 * onRemoveUrlChange callback is triggered with the URL that was removed.
 *
 * @param {object} props - The component's props.
 * @param {string[]} props.initialUrls - An array of URL strings (image or video).
 * @param {function(string[]): void} props.onUrlsChange - Callback function
 * that is called with the updated array of URL strings whenever a URL is removed.
 * @param {function(string): void} [props.onRemoveUrlChange] - Optional callback function
 * that is called with the URL string of the item that was just removed.
 */
const AdvancedUploadHelper = ({ initialUrls = [], onRemoveUrlChange }) => {
  // State to hold the internal representation of URLs.
  // Each item will be an object with properties like name, type, url, and isUrl.
  const [urls, setUrls] = useState([]);

  // useEffect hook to process initialUrls prop when the component mounts
  // or when initialUrls prop changes.
  useEffect(() => {
    // Map over the initialUrls array to create internal "mock" file objects.
    // This allows consistent rendering logic with the original AdvancedUpload.
    const processedInitialUrls = initialUrls.map((url) => {
      const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
      const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

      return {
        name: url.substring(url.lastIndexOf('/') + 1), // Extract filename from URL
        type: isImage ? 'image/jpeg' : isVideo ? 'video/mp4' : 'application/octet-stream',
        url: url,      // Store the original URL
        isUrl: true,   // Custom flag to identify this as a URL-based item
      };
    });
    setUrls(processedInitialUrls);
  }, [initialUrls]); // Dependency array: re-run effect if initialUrls changes

  /**
   * Handles the removal of a URL from the displayed list.
   *
   * @param {number} index - The index of the URL to be removed from the `urls` state array.
   */
  const removeUrl = (index) => {
    // Get the URL item that is about to be removed
    const removedUrlItem = urls[index];

    // Create a new array by filtering out the item at the specified index.
    const updatedUrls = urls.filter((_, i) => i !== index);
    setUrls(updatedUrls); // Update the component's internal state

    // Extract only the original URL strings for the onUrlsChange callback.
    const urlStringsForOnUrlsChange = updatedUrls.map((item) => item.url);

    // Call the onRemoveUrlChange prop with the URL string of the removed item.
    if (onRemoveUrlChange && removedUrlItem) {
      onRemoveUrlChange(removedUrlItem.url);
    }
  };

  return (
    <div className="">
      {urls.length === 0 && (
        <p className="text-gray-500 text-center py-4">No File to display.</p>
      )}

      {urls.length > 0 && (
        <div
          className="mt-4 flex flex-wrap gap-4 justify-center"
          style={{
            marginTop: '15px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          {urls.map((urlItem, i) => {
            const isImage = urlItem.type.startsWith('image/');
            const isVideo = urlItem.type.startsWith('video/');

            return (
              <div
                key={urlItem.url} // Use the URL as a unique key for React list rendering
                className="relative rounded-md overflow-hidden shadow-md"
                style={{ position: 'relative' }}
              >
                {/* Render image preview if it's an image URL */}
                {isImage && (
                  <img
                    src={urlItem.url}
                    alt={urlItem.name}
                    className="w-32 h-32 object-cover rounded-md"
                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 6 }}
                  />
                )}
                {/* Render video icon and name if it's a video URL */}
                {isVideo && (
                  <div
                    className="w-32 h-32 border border-gray-300 rounded-md flex flex-col items-center justify-center p-2 text-center text-sm text-gray-700"
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
                    <FaFileVideo size={40} className="text-gray-500" style={{ color: '#555' }} />
                    <div
                      className="mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap"
                      title={urlItem.name}
                      style={{
                        marginTop: 6,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      {urlItem.name}
                    </div>
                  </div>
                )}
                {/* Remove button */}
                <button
                  onClick={() => removeUrl(i)}
                  className="absolute top-0.5 right-0.5 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer hover:bg-opacity-80 transition-all"
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
          })}
        </div>
      )}
    </div>
  );
};

export default AdvancedUploadHelper;
