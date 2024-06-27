import { FC } from 'react';
import cn from 'classnames';

interface CarouselArrowsProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  iconPrev: string;
  iconNext: string;
  classNames: string[];
}

const CarouselArrows: FC<CarouselArrowsProps> = ({
  onPrevClick,
  onNextClick,
  iconPrev,
  iconNext,
  classNames,
}) => {
  return (
    <div className="flex justify-between">
      <button onClick={onPrevClick} className="carousel_button">
        <span
          className={cn(
            'fa fd-component',
            'fd-icon',
            iconPrev,
            classNames,
            'w-7 h-auto fill-current text-gray-400 hover:text-gray-700',
            'text-3xl',
          )}
        ></span>
      </button>
      <button onClick={onNextClick} className="carousel_button">
        <span
          className={cn(
            'fa fd-component',
            'fd-icon',
            iconNext,
            classNames,
            'w-7 h-auto fill-current text-gray-400 hover:text-gray-700',
            'text-3xl',
          )}
        ></span>
      </button>
    </div>
  );
};

export default CarouselArrows;
