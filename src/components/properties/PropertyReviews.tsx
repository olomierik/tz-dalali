import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  property_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
}

interface PropertyReviewsProps {
  propertyId: string;
}

interface ReviewUser {
  name?: string;
  avatar_url?: string;
}

interface ReviewRow {
  id: string;
  property_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: ReviewUser;
}

async function fetchReviews(propertyId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:users(name, avatar_url)')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((r: ReviewRow) => ({
    id: r.id,
    property_id: r.property_id,
    user_id: r.user_id,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    user_name: r.user?.name ?? 'Anonymous',
    user_avatar: r.user?.avatar_url,
  }));
}

async function createReview(payload: { property_id: string; rating: number; comment: string }) {
  const { error } = await supabase.from('reviews').insert(payload);
  if (error) throw new Error(error.message);
}

function StarRating({ 
  value, 
  onChange, 
  readonly = false,
  size = 'md' 
}: { 
  value: number; 
  onChange?: (v: number) => void; 
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hover, setHover] = useState(0);
  const starSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={cn(
              starSize,
              (hover || value) >= star
                ? 'fill-booking-yellow text-booking-yellow'
                : 'fill-gray-200 text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}

import { cn } from '@/lib/utils';

function ReviewCard({ review, lang }: { review: Review; lang: 'en' | 'zh' }) {
  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diff < 60) return lang === 'en' ? 'Just now' : '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)} ${lang === 'en' ? 'min ago' : '分钟前'}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${lang === 'en' ? 'hours ago' : '小时前'}`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ${lang === 'en' ? 'days ago' : '天前'}`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-booking-blue/10 flex items-center justify-center shrink-0">
          {review.user_avatar ? (
            <img src={review.user_avatar} alt={review.user_name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-booking-blue font-semibold">
              {review.user_name?.charAt(0).toUpperCase() || 'A'}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{review.user_name}</h4>
            <span className="text-xs text-gray-400">{timeAgo(review.created_at)}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <StarRating value={review.rating} readonly />
            <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
          </div>

          {/* Comment */}
          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

export function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const { user } = useAuthContext();
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () => fetchReviews(propertyId),
  });

  const { data: userReview } = useQuery({
    queryKey: ['review', propertyId, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('reviews')
        .select('id')
        .eq('property_id', propertyId)
        .eq('user_id', user!.id)
        .maybeSingle();
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] });
      setShowForm(false);
      setComment('');
      setRating(5);
      toast({ title: lang === 'en' ? 'Review submitted!' : '评论已提交！' });
    },
    onError: (error: Error) => {
      toast({ 
        title: lang === 'en' ? 'Error' : '错误', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const handleSubmit = () => {
    if (!user) {
      toast({ title: lang === 'en' ? 'Please sign in first' : '请先登录', variant: 'destructive' });
      return;
    }
    if (!comment.trim()) {
      toast({ title: lang === 'en' ? 'Please write a review' : '请撰写评论', variant: 'destructive' });
      return;
    }
    createMutation.mutate({ property_id: propertyId, rating, comment });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-gray-900">
            {lang === 'en' ? 'Reviews' : '评论'}
            {reviews.length > 0 && (
              <span className="ml-2 text-base font-normal text-gray-500">
                ({reviews.length})
              </span>
            )}
          </h2>
          {averageRating && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-4 w-4',
                      parseFloat(averageRating) >= star
                        ? 'fill-booking-yellow text-booking-yellow'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{averageRating}</span>
              <span className="text-sm text-gray-400">
                ({lang === 'en' ? 'out of 5' : '满分5分'})
              </span>
            </div>
          )}
        </div>

        {user && !userReview && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="border-booking-blue text-booking-blue hover:bg-booking-blue-lighter"
          >
            {lang === 'en' ? 'Write a Review' : '撰写评论'}
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">
            {lang === 'en' ? 'Share your experience' : '分享您的体验'}
          </h3>

          <div className="space-y-1">
            <Label className="text-sm text-gray-600">
              {lang === 'en' ? 'Your rating' : '您的评分'}
            </Label>
            <StarRating 
              value={hoverRating || rating} 
              onChange={setRating}
              onHover={setHoverRating}
              size="lg"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm text-gray-600">
              {lang === 'en' ? 'Your review' : '您的评论'}
            </Label>
            <Textarea
              placeholder={lang === 'en' 
                ? 'Tell others about your experience with this property...' 
                : '与其他用户分享您对这套房产的体验...'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="bg-booking-blue hover:bg-booking-blue-light"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {lang === 'en' ? 'Submit Review' : '提交评论'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setComment('');
                setRating(5);
              }}
            >
              {lang === 'en' ? 'Cancel' : '取消'}
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {lang === 'en' 
              ? 'No reviews yet. Be the first to share your experience!'
              : '暂无评论。成为第一个分享体验的人！'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}