import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'md', showNumber = false }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 16 : 24;
  const colorClass = "text-accent fill-accent";

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} size={iconSize} className={colorClass} />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<StarHalf key={i} size={iconSize} className={colorClass} />);
    } else {
      stars.push(<Star key={i} size={iconSize} className="text-gray-600" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-accent">
        {stars}
      </div>
      {showNumber && <span className="text-white ml-2 text-sm opacity-80">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;