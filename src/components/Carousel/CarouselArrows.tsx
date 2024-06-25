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
    <div>
      <button
        onClick={onPrevClick}
        className="absolute top-1/2 transform -translate-y-1/2 carousel_button"
      >
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
      <button
        onClick={onNextClick}
        className="absolute text-zinc-950 hover:text-zinc-400 right-0 top-1/2 transform -translate-y-1/2 carousel_button"
      >
        <span
          className={cn(
            'fa fd-component',
            'fd-icon',
            iconNext,
            classNames,
            'w-7 h-auto fill-current ml-2 text-gray-400',
            'text-3xl',
          )}
        ></span>
      </button>
    </div>
  );
};

export default CarouselArrows;
