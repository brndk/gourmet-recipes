import { useState } from 'react';
import { BlogPost, BlogComment } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, Clock, Heart, MessageSquare, Send, User, ChevronRight, X, Sparkles } from 'lucide-react';

interface BlogProps {
  blogPosts: BlogPost[];
  onUpdateBlogPosts: (posts: BlogPost[]) => void;
  selectedPostId: string | null;
  onSelectPost: (id: string | null) => void;
}

export function Blog({ blogPosts, onUpdateBlogPosts, selectedPostId, onSelectPost }: BlogProps) {
  const selectedPost = blogPosts.find((p) => p.id === selectedPostId) || null;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Всі');

  // Comment form states
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  const categories = ['Всі', 'Секрети Шефа', 'Техніки', 'Інгредієнти', 'Продукти'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Всі' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the detailed view
    const updated = blogPosts.map((p) => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    onUpdateBlogPosts(updated);
  };

  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) {
      setCommentError('Будь ласка, заповніть обидва поля.');
      return;
    }

    const newComment: BlogComment = {
      id: `comment_${Date.now()}`,
      author: commentAuthor.trim(),
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = blogPosts.map((p) => {
      if (p.id === postId) {
        return { ...p, comments: [newComment, ...p.comments] };
      }
      return p;
    });

    onUpdateBlogPosts(updated);

    // Reset comment form states
    setCommentAuthor('');
    setCommentText('');
    setCommentError('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-10 animate-fade-in" id="culinary-blog-container">
      {/* Blog Hero Intro Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[220px] flex flex-col justify-end p-8 border border-stone-800 shadow-xl">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1200"
            alt="Culinary Blog Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Кулінарний журнал
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white leading-none">
            Кулінарний Блог GOURMET
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
            Поради професійних шеф-кухарів, авторські есеї про культуру фудперінгу, унікальні технології обробки продуктів та секрети вишуканої сервіровки страв.
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/60 backdrop-blur border border-stone-200/60 p-4 rounded-2xl shadow-sm">
        {/* Interactive category buttons */}
        <div className="flex flex-wrap gap-1.5 items-center w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`blog-category-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-luxury-black text-white shadow-md'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Search text field */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="blog-search-posts"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук статей або авторів..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
          />
        </div>
      </div>

      {/* ARTICLES GRID RENDER */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl space-y-3">
          <p className="text-stone-400 text-sm font-sans">Статей за вашим запитом не знайдено.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Всі');
            }}
            className="text-xs font-semibold uppercase tracking-wider text-gold-600 hover:text-gold-700 underline"
          >
            Скинути фільтри
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              id={`blog-post-card-${post.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectPost(post.id)}
              className="group cursor-pointer bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-gold-500/20 transition-all duration-300 flex flex-col h-full"
            >
              {/* Photo header with category tag overlay */}
              <div className="h-48 relative overflow-hidden bg-stone-900">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />
                
                {/* Visual Category Label */}
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-luxury-black border border-stone-100 font-bold tracking-wider text-[9px] uppercase px-3 py-1 rounded-full shadow-sm">
                  {post.category}
                </span>

                {/* Read time overlay */}
                <span className="absolute bottom-4 right-4 bg-stone-950/60 backdrop-blur text-white/90 text-[10px] flex items-center gap-1 px-2.5 py-1 rounded-md font-mono">
                  <Clock className="w-3 h-3" />
                  {post.readTime} хв чит.
                </span>
              </div>

              {/* Content Block */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-stone-300" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-lg font-serif font-extrabold group-hover:text-gold-600 leading-snug tracking-tight transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans line-clamp-3">
                    {post.description}
                  </p>
                </div>

                {/* Action Row & Author */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 font-bold text-xs uppercase text-gold-600 flex items-center justify-center shrink-0">
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-700 leading-none">{post.author}</p>
                      <p className="text-[9px] text-stone-400 font-mono mt-0.5">{post.authorRole}</p>
                    </div>
                  </div>

                  {/* Likes and Comments Counters */}
                  <div className="flex items-center gap-3">
                    <button
                      id={`like-btn-card-${post.id}`}
                      onClick={(e) => handleLike(post.id, e)}
                      className="flex items-center gap-1.5 text-stone-400 hover:text-rose-500 font-mono text-xs cursor-pointer transition-colors"
                      title="Поставити вподобайку"
                    >
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-100 group-hover:scale-110 active:scale-95 transition-transform" />
                      <span>{post.likes}</span>
                    </button>
                    
                    <div className="flex items-center gap-1 text-stone-400 font-mono text-xs">
                      <MessageSquare className="w-4 h-4 text-stone-300" />
                      <span>{post.comments.length}</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-gold-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* FULL-SIZE IMMERSIVE ARTICLE MODAL */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            id="blog-post-detailed-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto"
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative bg-white rounded-3xl border border-stone-200 shadow-2xl transition-all duration-300 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in flex flex-col"
            >
              {/* Top Banner image header */}
              <div className="relative h-64 sm:h-80 bg-stone-900 shrink-0">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                
                {/* Close Button Trigger */}
                <button
                  id="close-detailed-blog-post-btn"
                  onClick={() => {
                    onSelectPost(null);
                    setCommentError('');
                  }}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 text-stone-700 hover:text-rose-600 hover:scale-105 transition-all outline-none border border-stone-200/40 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Banner typography header overlays */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-gold-600 text-white border border-gold-500 font-bold tracking-wider text-[9px] uppercase px-3 py-1 rounded-full shadow-sm">
                      {selectedPost.category}
                    </span>
                    <span className="text-stone-300 text-xs flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedPost.readTime} хв читання
                    </span>
                    <span className="text-stone-300 text-xs flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(selectedPost.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-serif font-black tracking-tight leading-tight">
                    {selectedPost.title}
                  </h2>
                </div>
              </div>

              {/* Grid content space */}
              <div className="p-6 sm:p-8 space-y-8 flex-grow">
                {/* Author Block Profile */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-50 border border-gold-200 text-gold-600 font-bold uppercase tracking-wider text-sm flex items-center justify-center font-serif">
                      {selectedPost.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800 leading-tight">{selectedPost.author}</p>
                      <p className="text-xs text-stone-500 font-sans">{selectedPost.authorRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`like-btn-big-${selectedPost.id}`}
                      onClick={(e) => handleLike(selectedPost.id, e)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-rose-600" />
                      <span>{selectedPost.likes} Вподобань</span>
                    </button>
                  </div>
                </div>

                {/* Article body paragraphs */}
                <article className="prose text-stone-700 mx-auto text-sm sm:text-base leading-relaxed tracking-tight space-y-5 font-serif max-w-full">
                  {selectedPost.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="first-letter:text-3xl first-letter:font-bold first-letter:text-gold-600 first-letter:mr-1.5 first-letter:float-left p-0 mb-4 font-light text-stone-700">
                      {pIdx === 0 ? paragraph : paragraph}
                    </p>
                  ))}
                </article>

                {/* DISCUSSION ZONE (COMMENTS) */}
                <div className="pt-8 border-t border-stone-100 space-y-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gold-600" />
                    <h3 className="text-lg font-serif font-bold text-luxury-black">
                      Обговорення статті ({selectedPost.comments.length})
                    </h3>
                  </div>

                  {/* Form to submit feedback */}
                  <form onSubmit={(e) => handleAddComment(e, selectedPost.id)} className="space-y-4 bg-stone-50 border border-stone-100 p-5 rounded-2xl">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-stone-600">Додати коментар</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Ваше ім’я</label>
                        <input
                          id="comment-author-field"
                          type="text"
                          required
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs outline-none focus:border-gold-500 transition-all font-sans"
                          placeholder="Шеф-аматор..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Повідомлення</label>
                      <textarea
                        id="comment-text-field"
                        required
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs outline-none focus:border-gold-500 transition-all font-sans resize-none"
                        placeholder="Поділіться вашими враженнями або запитаннями..."
                      />
                    </div>

                    {commentError && (
                      <p className="text-rose-500 text-xs font-sans">{commentError}</p>
                    )}

                    <button
                      id="submit-comment-btn"
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Надіслати коментар
                    </button>
                  </form>

                  {/* Comments Feed list */}
                  <div className="space-y-4">
                    {selectedPost.comments.length === 0 ? (
                      <p className="text-stone-400 text-xs font-sans text-center py-4 bg-stone-50/50 rounded-xl">
                        Будьте першим, хто залишить відгук про цю статтю!
                      </p>
                    ) : (
                      selectedPost.comments.map((comment) => (
                        <div key={comment.id} className="p-4 border border-stone-100 rounded-2xl bg-white space-y-2 flex gap-3 shadow-2xs">
                          <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-xs uppercase shrink-0">
                            <User className="w-4 h-4 text-stone-400" />
                          </div>
                          <div className="space-y-1 w-full">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs font-bold text-stone-800">{comment.author}</span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {formatDate(comment.createdAt)} в {new Date(comment.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-stone-600 leading-relaxed font-sans">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
