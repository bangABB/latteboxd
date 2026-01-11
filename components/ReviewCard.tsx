import React from 'react';
import { Review } from '../types';
import StarRating from './StarRating';
import { Heart, MessageCircle } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="border-b border-surface py-6 last:border-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex-shrink-0 flex items-center justify-center text-white font-bold text-sm select-none`}>
          {review.reviewerName.charAt(0)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-white font-bold text-sm hover:text-blue-400 cursor-pointer">{review.reviewerName}</span>
            <span className="text-xs text-gray-500">reviewed</span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
             <StarRating rating={review.rating} size="sm" />
             <span className="text-xs text-gray-500 ml-auto">{review.date}</span>
          </div>

          <div className="text-sm text-gray-300 font-serif leading-relaxed mb-4">
            {review.text}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-gray-500 select-none">
            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <Heart size={14} className={review.likes > 20 ? "fill-red-500 text-red-500" : ""} />
              {review.likes} likes
            </div>
             <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <MessageCircle size={14} />
              {Math.floor(review.likes / 5)} comments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;