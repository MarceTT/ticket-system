import React from 'react'

interface Image {
    id: string;
    url: string;
  }

interface ImageGalleryProps {
    images: Image[];
  }

const ImageGalleryTicket = ({images}: ImageGalleryProps) => {
  return (
    <div className="px-4 py-6">
      <div className="text-lg font-semibold mb-4">Images</div>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 shadow">
            <img src={image.url} alt={`Image ${image.id}`} className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGalleryTicket