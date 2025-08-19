'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle, Reply, ThumbsUp, Flag, Send } from 'lucide-react';
import type { BlogComment, Locale } from '../../types';

interface BlogCommentsProps {
  articleId: string;
  locale: Locale;
}

// Mock comment data - in a real app, this would come from an API
const mockComments: BlogComment[] = [
  {
    id: '1',
    articleId: 'article-1',
    author: {
      name: 'Marie Dubois',
      email: 'marie@example.com',
      isVerified: true,
    },
    content: 'Excellent article ! J\'ai appris beaucoup de choses sur Lyon. Merci pour ces informations très utiles.',
    status: 'approved',
    likes: 3,
    replies: 1,
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: '2',
    articleId: 'article-1',
    parentId: '1',
    author: {
      name: 'Guide de Lyon',
      email: 'admin@guidedelyon.com',
      isVerified: true,
    },
    content: 'Merci Marie ! N\'hésitez pas à consulter nos autres articles sur Lyon.',
    status: 'approved',
    likes: 1,
    replies: 0,
    createdAt: new Date('2024-01-15T14:20:00Z'),
    updatedAt: new Date('2024-01-15T14:20:00Z'),
  },
  {
    id: '3',
    articleId: 'article-1',
    author: {
      name: 'Pierre Martin',
      email: 'pierre@example.com',
      isVerified: false,
    },
    content: 'Je recommande également le parc de la Tête d\'Or pour les familles. C\'est un endroit magnifique !',
    status: 'approved',
    likes: 2,
    replies: 0,
    createdAt: new Date('2024-01-16T09:15:00Z'),
    updatedAt: new Date('2024-01-16T09:15:00Z'),
  },
];

export default function BlogComments({ articleId, locale }: BlogCommentsProps) {
  const t = useTranslations('blog.comments');
  
  const [comments, setComments] = useState<BlogComment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter comments for this article
  const articleComments = comments.filter(comment => 
    comment.articleId === articleId && comment.status === 'approved'
  );

  // Organize comments by parent/child relationship
  const topLevelComments = articleComments.filter(comment => !comment.parentId);
  const getReplies = (parentId: string) => 
    articleComments.filter(comment => comment.parentId === parentId);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const comment: BlogComment = {
      id: `comment-${Date.now()}`,
      articleId,
      author: {
        name: 'Utilisateur Anonyme',
        email: 'user@example.com',
        isVerified: false,
      },
      content: newComment,
      status: 'pending',
      likes: 0,
      replies: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const reply: BlogComment = {
      id: `reply-${Date.now()}`,
      articleId,
      parentId,
      author: {
        name: 'Utilisateur Anonyme',
        email: 'user@example.com',
        isVerified: false,
      },
      content: replyContent,
      status: 'pending',
      likes: 0,
      replies: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setComments(prev => [...prev, reply]);
    setReplyContent('');
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('timeAgo.justNow');
    if (diffInHours < 24) return t('timeAgo.hoursAgo', { hours: diffInHours });
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return t('timeAgo.daysAgo', { days: diffInDays });
    
    return date.toLocaleDateString(locale);
  };

  return (
    <div className="space-y-6">
      
      {/* Comment form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {t('addComment')}
        </h4>
        
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('commentPlaceholder')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {t('moderationNotice')}
            </p>
            
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('noComments')}</p>
            <p className="text-sm">{t('beFirst')}</p>
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg p-6 shadow-sm border">
              
              {/* Comment header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {comment.author.name}
                      </span>
                      {comment.author.isVerified && (
                        <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                
                <button className="text-gray-400 hover:text-gray-600">
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Comment content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {comment.content}
                </p>
              </div>

              {/* Comment actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{comment.likes}</span>
                </button>
                
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span className="text-sm">{t('reply')}</span>
                </button>
              </div>

              {/* Reply form */}
              {replyingTo === comment.id && (
                <div className="mt-4 pl-6 border-l-2 border-gray-200">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitReply(comment.id);
                    }}
                    className="space-y-3"
                  >
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={t('replyPlaceholder', { name: comment.author.name })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      required
                    />
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !replyContent.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting ? t('submitting') : t('reply')}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                        className="px-4 py-2 text-gray-600 rounded text-sm hover:text-gray-800 transition-colors"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Replies */}
              {getReplies(comment.id).map((reply) => (
                <div key={reply.id} className="mt-4 pl-6 border-l-2 border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4">
                    
                    {/* Reply header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {reply.author.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 text-sm">
                              {reply.author.name}
                            </span>
                            {reply.author.isVerified && (
                              <span className="w-3 h-3 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                                ✓
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reply content */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      {reply.content}
                    </p>

                    {/* Reply actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLikeComment(reply.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-xs">{reply.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}