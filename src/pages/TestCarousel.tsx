import React from 'react';
import { Carousel } from '../components/organisms/Carousel';

const TestCarousel: React.FC = () => {
  // Sample image items for the carousel
  const imageItems = [
    <div key="1" className="h-64 bg-blue-200 rounded-lg flex items-center justify-center">
      <h2 className="text-2xl text-blue-700">Slide 1</h2>
    </div>,
    <div key="2" className="h-64 bg-green-200 rounded-lg flex items-center justify-center">
      <h2 className="text-2xl text-green-700">Slide 2</h2>
    </div>,
    <div key="3" className="h-64 bg-red-200 rounded-lg flex items-center justify-center">
      <h2 className="text-2xl text-red-700">Slide 3</h2>
    </div>,
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Carousel Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Basic Carousel</h2>
        <Carousel 
          items={imageItems}
          autoPlay={false}
          showArrows={true}
          showDots={true}
          effect="slide"
          className="mb-4"
          height={300}
        />
      </div>
    </div>
  );
};

export default TestCarousel; 