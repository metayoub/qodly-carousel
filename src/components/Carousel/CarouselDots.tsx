import { FC } from 'react';
import cn from 'classnames';

interface CarouselDotsProps {
  totalDots: number;
  selectedDot: number;
  onDotClick: (index: number) => void;
}

const CarouselDots: FC<CarouselDotsProps> = ({ totalDots, selectedDot, onDotClick }) => {
  return (
    <div className="flex justify-center relative bottom-2 hover:bg-black carousel_dots">
      {Array.from({ length: totalDots }).map((_, index) => (
        <div key={index} onClick={() => onDotClick(index)}>
          <div
            className={cn(
              'carousel_dot w-8 h-1 bg-gray-400 hover:bg-gray-600 rounded-full mx-1 cursor-pointer transition duration-300',
              {
                'active bg-gray-900 hover:bg-gray-700': index === selectedDot,
              },
            )}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default CarouselDots;
