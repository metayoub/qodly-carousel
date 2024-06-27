import { FC } from 'react';
import cn from 'classnames';

interface CarouselDotsProps {
  totalDots: number;
  selectedDot: number;
  onDotClick: (index: number) => void;
}

const CarouselDots: FC<CarouselDotsProps> = ({ totalDots, selectedDot, onDotClick }) => {
  const dotsToShow = () => {
    if (totalDots <= 5) {
      return Array.from({ length: totalDots }).map((_, index) => index);
    }

    const dots = [];
    if (selectedDot < 2) {
      dots.push(0, 1, 2, 3, totalDots - 1);
    } else if (selectedDot > totalDots - 3) {
      dots.push(0, totalDots - 4, totalDots - 3, totalDots - 2, totalDots - 1);
    } else {
      dots.push(0, selectedDot - 1, selectedDot, selectedDot + 1, totalDots - 1);
    }

    return Array.from(new Set(dots)).sort((a, b) => a - b);
  };

  return (
    <div className="flex justify-center relative bottom-2 hover:bg-black carousel_dots">
      {dotsToShow().map((index) => (
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
