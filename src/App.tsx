import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MonitorPlay, Download, Star, ChevronRight, X, Menu, Settings, Edit, Save, Plus, Trash2, LogOut, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { initialApps, categories as initialCategories, AppData } from './data/apps';

const AppCard = ({ app, onClick }: { app: AppData; onClick: () => void }) => (
  <motion.div
    layoutId={`app-card-${app.id}`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter') onClick();
    }}
    tabIndex={0}
    className="group bg-tv-card rounded-xl p-4 border border-white/5 hover:border-tv-accent/50 hover:bg-tv-card-hover focus:border-tv-accent focus:bg-tv-card-hover focus:outline-none focus:ring-2 focus:ring-tv-accent focus:scale-105 transition-all cursor-pointer flex flex-col items-center text-center outline-none"
    whileHover={{ y: -4 }}
  >
    <motion.img 
      layoutId={`app-icon-${app.id}`}
      src={app.icon} 
      alt={app.name} 
      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl mb-4 object-cover shadow-lg group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-shadow"
      referrerPolicy="no-referrer"
    />
    <h3 className="font-semibold text-sm md:text-base line-clamp-1 w-full">{app.name}</h3>
    <p className="text-xs text-gray-400 mt-1 mb-3 line-clamp-1 w-full">{app.developer}</p>
    
    <div className="flex items-center justify-center gap-3 text-xs text-gray-300 w-full mt-auto">
      <div className="flex items-center gap-1">
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <span>{app.rating}</span>
      </div>
      <div className="flex items-center gap-1">
        <Download className="w-3 h-3" />
        <span>{app.size}</span>
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const [apps, setApps] = useState<AppData[]>(() => {
    const saved = localStorage.getItem('atv_apps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse apps from localStorage', e);
      }
    }
    return initialApps;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('atv_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse categories from localStorage', e);
      }
    }
    return initialCategories;
  });

  useEffect(() => {
    localStorage.setItem('atv_apps', JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem('atv_categories', JSON.stringify(categories));
  }, [categories]);

  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppData | null>(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [categoryModal, setCategoryModal] = useState<{ isOpen: boolean; oldName?: string; newName: string }>({ isOpen: false, newName: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'app' | 'category'; id: string; name: string } | null>(null);

  const handleAdminToggle = () => {
    if (currentView === 'store') {
      if (isAuthenticated) {
        setCurrentView('admin');
      } else {
        setShowAuthModal(true);
      }
    } else {
      setCurrentView('store');
    }
  };

  const [adminTab, setAdminTab] = useState<'apps' | 'categories'>('apps');

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.developer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Tất cả' || app.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-tv-bg/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-tv-accent p-2 rounded-lg">
                <MonitorPlay className="w-6 h-6 text-tv-bg" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                ATV<span className="text-tv-accent">Store</span>
              </span>
            </div>

            {/* Search Bar (Desktop) */}
            {currentView === 'store' && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-tv-card text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-tv-card-hover focus:border-tv-accent focus:ring-2 focus:ring-tv-accent sm:text-sm transition-colors"
                    placeholder="Tìm kiếm ứng dụng, trò chơi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Admin Toggle */}
            <div className="hidden md:flex items-center gap-4 ml-auto">
              {currentView === 'admin' && (
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setCurrentView('store');
                  }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              )}
              <button
                onClick={handleAdminToggle}
                className="flex items-center gap-2 text-gray-300 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-tv-accent rounded-lg px-3 py-2 transition-colors"
              >
                {currentView === 'store' ? (
                  <>
                    <Settings className="w-5 h-5" />
                    <span>Quản lý</span>
                  </>
                ) : (
                  <>
                    <MonitorPlay className="w-5 h-5" />
                    <span>Cửa hàng</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search & Categories */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/10 bg-tv-card"
            >
              <div className="px-4 pt-4 pb-3 space-y-4">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-tv-bg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-tv-accent focus:ring-1 focus:ring-tv-accent sm:text-sm"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        activeCategory === category
                          ? 'bg-tv-accent text-tv-bg'
                          : 'bg-tv-bg text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleAdminToggle();
                    }}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-full"
                  >
                    {currentView === 'store' ? (
                      <>
                        <Settings className="w-5 h-5" />
                        <span>Quản lý ứng dụng</span>
                      </>
                    ) : (
                      <>
                        <MonitorPlay className="w-5 h-5" />
                        <span>Về cửa hàng</span>
                      </>
                    )}
                  </button>
                  {currentView === 'admin' && (
                    <button
                      onClick={() => {
                        setIsAuthenticated(false);
                        setCurrentView('store');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-full mt-4"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Đăng xuất</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        
        {currentView === 'admin' ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Quản trị</h1>
                <div className="flex bg-tv-card rounded-lg p-1 border border-white/10">
                  <button
                    onClick={() => setAdminTab('apps')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${adminTab === 'apps' ? 'bg-tv-accent text-tv-bg' : 'text-gray-400 hover:text-white'}`}
                  >
                    Ứng dụng
                  </button>
                  <button
                    onClick={() => setAdminTab('categories')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${adminTab === 'categories' ? 'bg-tv-accent text-tv-bg' : 'text-gray-400 hover:text-white'}`}
                  >
                    Danh mục
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 relative z-20">
                {adminTab === 'categories' ? (
                  <button 
                    onClick={() => {
                      setCategoryModal({ isOpen: true, newName: '' });
                    }}
                    className="bg-tv-accent hover:bg-tv-accent-hover text-tv-bg font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Thêm danh mục
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setEditingApp({
                        id: Date.now().toString(),
                        name: '',
                        developer: '',
                        category: categories.length > 1 ? categories[1] : 'Giải trí',
                        rating: 0,
                        downloads: '0',
                        size: '',
                        icon: 'https://picsum.photos/seed/newapp/128/128',
                        description: '',
                        screenshots: ['https://picsum.photos/seed/newapp1/640/360'],
                        version: '1.0.0',
                        downloadUrl: ''
                      });
                    }}
                    className="bg-tv-accent hover:bg-tv-accent-hover text-tv-bg font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Thêm ứng dụng
                  </button>
                )}
              </div>
            </div>

            {adminTab === 'apps' ? (
              <div className="bg-tv-card rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">Ứng dụng</th>
                        <th className="px-4 py-3 font-medium">Phiên bản</th>
                        <th className="px-4 py-3 font-medium">Danh mục</th>
                        <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {apps.map(app => (
                        <tr key={app.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <div>
                                <div className="font-medium">{app.name}</div>
                                <div className="text-xs text-gray-400">{app.developer}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-300">{app.version}</td>
                          <td className="px-4 py-3 text-gray-300">{app.category}</td>
                          <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => setEditingApp(app)}
                              className="p-2 text-gray-400 hover:text-tv-accent transition-colors inline-block"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setDeleteConfirm({ isOpen: true, type: 'app', id: app.id, name: app.name });
                              }}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors inline-block ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-tv-card rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">Tên danh mục</th>
                        <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {categories.filter(c => c !== 'Tất cả').map((category, index, arr) => (
                        <tr key={category} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-medium">{category}</td>
                          <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => {
                                if (index > 0) {
                                  const newCategories = [...categories];
                                  const allIndex = newCategories.indexOf('Tất cả');
                                  const actualIndex = index + (allIndex !== -1 ? 1 : 0);
                                  
                                  const temp = newCategories[actualIndex];
                                  newCategories[actualIndex] = newCategories[actualIndex - 1];
                                  newCategories[actualIndex - 1] = temp;
                                  
                                  setCategories(newCategories);
                                }
                              }}
                              disabled={index === 0}
                              className={`p-2 transition-colors inline-block ${index === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-tv-accent'}`}
                              title="Di chuyển lên"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (index < arr.length - 1) {
                                  const newCategories = [...categories];
                                  const allIndex = newCategories.indexOf('Tất cả');
                                  const actualIndex = index + (allIndex !== -1 ? 1 : 0);
                                  
                                  const temp = newCategories[actualIndex];
                                  newCategories[actualIndex] = newCategories[actualIndex + 1];
                                  newCategories[actualIndex + 1] = temp;
                                  
                                  setCategories(newCategories);
                                }
                              }}
                              disabled={index === arr.length - 1}
                              className={`p-2 transition-colors inline-block ml-1 ${index === arr.length - 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-tv-accent'}`}
                              title="Di chuyển xuống"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setCategoryModal({ isOpen: true, oldName: category, newName: category });
                              }}
                              className="p-2 text-gray-400 hover:text-tv-accent transition-colors inline-block ml-2"
                              title="Sửa tên"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setDeleteConfirm({ isOpen: true, type: 'category', id: category, name: category });
                              }}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors inline-block ml-2"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero Section */}
        {!searchQuery && activeCategory === 'Tất cả' && (
          <div className="mb-12 relative rounded-2xl overflow-hidden bg-tv-card border border-white/5">
            <div className="absolute inset-0">
              <img 
                src="https://picsum.photos/seed/tvhero/1200/400" 
                alt="Hero Background" 
                className="w-full h-full object-cover opacity-30"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-tv-bg via-tv-bg/80 to-transparent"></div>
            </div>
            <div className="relative p-8 md:p-12 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Kho Ứng Dụng <br/>
                <span className="text-tv-accent">Android TV</span> Tốt Nhất
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                Khám phá và tải xuống hàng ngàn ứng dụng, trò chơi miễn phí được tối ưu hóa hoàn hảo cho màn hình lớn của bạn.
              </p>
              <button className="bg-tv-accent hover:bg-tv-accent-hover focus:bg-tv-accent-hover focus:outline-none focus:ring-4 focus:ring-tv-accent/50 text-tv-bg font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all focus:scale-105">
                Khám phá ngay <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Categories (Desktop) */}
        <div className="hidden md:flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-tv-accent focus:scale-105 ${
                activeCategory === category
                  ? 'bg-tv-accent text-tv-bg shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'bg-tv-card text-gray-300 hover:bg-tv-card-hover focus:bg-tv-card-hover border border-white/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* App Grid */}
        {searchQuery || activeCategory !== 'Tất cả' ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {searchQuery ? 'Kết quả tìm kiếm' : `Ứng dụng ${activeCategory}`}
              </h2>
              <span className="text-sm text-gray-400">{filteredApps.length} ứng dụng</span>
            </div>

            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} onClick={() => setSelectedApp(app)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tv-card mb-4">
                  <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-300">Không tìm thấy ứng dụng nào</h3>
                <p className="text-gray-500 mt-2">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-10">
            {categories.filter(c => c !== 'Tất cả').map(category => {
              const categoryApps = apps.filter(app => app.category === category);
              if (categoryApps.length === 0) return null;
              
              return (
                <div key={category}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{category}</h2>
                    <button 
                      onClick={() => setActiveCategory(category)}
                      className="text-sm text-tv-accent hover:text-tv-accent-hover focus:text-tv-accent-hover focus:outline-none focus:ring-2 focus:ring-tv-accent rounded px-2 py-1 flex items-center transition-all"
                    >
                      Xem tất cả <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {categoryApps.map(app => (
                      <AppCard key={app.id} app={app} onClick={() => setSelectedApp(app)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-tv-card py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>© 2026 ATV Store. Kho ứng dụng miễn phí cho Android TV.</p>
          <p className="mt-2 text-xs text-gray-500">Tất cả các ứng dụng đều thuộc bản quyền của nhà phát triển tương ứng.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-tv-card rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 bg-tv-bg">
                <h2 className="text-xl font-bold">Xác thực quản trị viên</h2>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Nhập mật khẩu</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (passwordInput === 'admin123') {
                        setIsAuthenticated(true);
                        setShowAuthModal(false);
                        setCurrentView('admin');
                        setPasswordInput('');
                      } else {
                        alert('Mật khẩu không đúng!');
                      }
                    }
                  }}
                  className="w-full bg-tv-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tv-accent"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">Mật khẩu mặc định: admin123</p>
              </div>
              <div className="p-6 border-t border-white/10 bg-tv-bg flex justify-end gap-3">
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    if (passwordInput === 'admin123') {
                      setIsAuthenticated(true);
                      setShowAuthModal(false);
                      setCurrentView('admin');
                      setPasswordInput('');
                    } else {
                      alert('Mật khẩu không đúng!');
                    }
                  }}
                  className="bg-tv-accent hover:bg-tv-accent-hover text-tv-bg font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {categoryModal.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCategoryModal({ isOpen: false, newName: '' })}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-tv-card rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 bg-tv-bg">
                <h2 className="text-xl font-bold">{categoryModal.oldName ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Tên danh mục</label>
                <input
                  type="text"
                  value={categoryModal.newName}
                  onChange={e => setCategoryModal({ ...categoryModal, newName: e.target.value })}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const newName = categoryModal.newName.trim();
                      if (newName !== '') {
                        if (categoryModal.oldName) {
                          if (newName !== categoryModal.oldName) {
                            if (!categories.includes(newName)) {
                              setCategories(categories.map(c => c === categoryModal.oldName ? newName : c));
                              setApps(apps.map(app => app.category === categoryModal.oldName ? { ...app, category: newName } : app));
                              setCategoryModal({ isOpen: false, newName: '' });
                            } else {
                              alert('Danh mục này đã tồn tại!');
                            }
                          } else {
                            setCategoryModal({ isOpen: false, newName: '' });
                          }
                        } else {
                          if (!categories.includes(newName)) {
                            setCategories([...categories, newName]);
                            setCategoryModal({ isOpen: false, newName: '' });
                          } else {
                            alert('Danh mục này đã tồn tại!');
                          }
                        }
                      }
                    }
                  }}
                  className="w-full bg-tv-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tv-accent"
                  autoFocus
                />
              </div>
              <div className="p-6 border-t border-white/10 bg-tv-bg flex justify-end gap-3">
                <button 
                  onClick={() => setCategoryModal({ isOpen: false, newName: '' })}
                  className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    const newName = categoryModal.newName.trim();
                    if (newName !== '') {
                      if (categoryModal.oldName) {
                        if (newName !== categoryModal.oldName) {
                          if (!categories.includes(newName)) {
                            setCategories(categories.map(c => c === categoryModal.oldName ? newName : c));
                            setApps(apps.map(app => app.category === categoryModal.oldName ? { ...app, category: newName } : app));
                            setCategoryModal({ isOpen: false, newName: '' });
                          } else {
                            alert('Danh mục này đã tồn tại!');
                          }
                        } else {
                          setCategoryModal({ isOpen: false, newName: '' });
                        }
                      } else {
                        if (!categories.includes(newName)) {
                          setCategories([...categories, newName]);
                          setCategoryModal({ isOpen: false, newName: '' });
                        } else {
                          alert('Danh mục này đã tồn tại!');
                        }
                      }
                    }
                  }}
                  className="bg-tv-accent hover:bg-tv-accent-hover text-tv-bg font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Lưu
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm?.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-tv-card rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 bg-tv-bg">
                <h2 className="text-xl font-bold text-red-400">Xác nhận xóa</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-300">
                  Bạn có chắc muốn xóa {deleteConfirm.type === 'app' ? 'ứng dụng' : 'danh mục'} <span className="font-semibold text-white">"{deleteConfirm.name}"</span>?
                </p>
                {deleteConfirm.type === 'category' && (
                  <p className="text-sm text-gray-500 mt-2">
                    Các ứng dụng thuộc danh mục này sẽ không bị xóa nhưng có thể không hiển thị đúng.
                  </p>
                )}
              </div>
              <div className="p-6 border-t border-white/10 bg-tv-bg flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    if (deleteConfirm.type === 'app') {
                      setApps(apps.filter(a => a.id !== deleteConfirm.id));
                    } else {
                      setCategories(categories.filter(c => c !== deleteConfirm.id));
                    }
                    setDeleteConfirm(null);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* App Details Modal */}
      <AnimatePresence>
        {editingApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingApp(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-auto md:max-h-[90vh] bg-tv-card rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-tv-bg">
                <h2 className="text-xl font-bold">{apps.find(a => a.id === editingApp.id) ? 'Sửa ứng dụng' : 'Thêm ứng dụng mới'}</h2>
                <button 
                  onClick={() => setEditingApp(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tên ứng dụng</label>
                    <input 
                      type="text" 
                      value={editingApp.name}
                      onChange={e => setEditingApp({...editingApp, name: e.target.value})}
                      className="w-full bg-tv-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tv-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nhà phát triển</label>
                    <input 
                      type="text" 
                      value={editingApp.developer}
                      onChange={e => setEditingApp({...editingApp, developer: e.target.value})}
                      className="w-full bg-tv-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tv-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Danh mục</label>
                    <select 
                      value={editingApp.category}
                      onChange={e => setEditingApp({...editingApp, category: e.target.value})}
                      className="w-full bg-tv-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tv-accent"
                    >
                      {categories.filter(c => c !== 'Tất cả').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phiên bản</label>
                    <input 
                      type="text" 
                      value={editingApp.version}
                      onChange={e => setEditingApp({...editingApp, version: e.target.value})}
                      className="w-full bg-tv-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tv-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Link tải (APK)</label>
                    <input 
                      type="text" 
                      value={editingApp.downloadUrl}
                      onChange={e => setEditingApp({...editingApp, downloadUrl: e.target.value})}
                      className="w-full bg-tv-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tv-accent"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Link Icon</label>
                    <input 
                      type="text" 
                      value={editingApp.icon}
                      onChange={e => setEditingApp({...editingApp, icon: e.target.value})}
                      className="w-full bg-tv-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tv-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Mô tả</label>
                    <textarea 
                      value={editingApp.description}
                      onChange={e => setEditingApp({...editingApp, description: e.target.value})}
                      className="w-full bg-tv-bg border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tv-accent h-24 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-tv-bg flex justify-end gap-3">
                <button 
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    const exists = apps.find(a => a.id === editingApp.id);
                    if (exists) {
                      setApps(apps.map(a => a.id === editingApp.id ? editingApp : a));
                    } else {
                      setApps([...apps, editingApp]);
                    }
                    setEditingApp(null);
                  }}
                  className="bg-tv-accent hover:bg-tv-accent-hover text-tv-bg font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> Lưu
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              layoutId={`app-card-${selectedApp.id}`}
              className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:h-auto md:max-h-[85vh] bg-tv-bg rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="relative h-48 md:h-64 shrink-0">
                <img 
                  src={selectedApp.screenshots[0]} 
                  alt="Cover" 
                  className="w-full h-full object-cover opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tv-bg to-transparent" />
                
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-6 translate-y-1/3">
                  <motion.img 
                    layoutId={`app-icon-${selectedApp.id}`}
                    src={selectedApp.icon} 
                    alt={selectedApp.name} 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-tv-bg shadow-xl object-cover bg-tv-card"
                    referrerPolicy="no-referrer"
                  />
                  <div className="mb-2 md:mb-4 flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight">{selectedApp.name}</h2>
                    <p className="text-tv-accent font-medium">{selectedApp.developer}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 pt-16 md:pt-20 custom-scrollbar">
                
                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-white/10">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Đánh giá</span>
                    <div className="flex items-center gap-1 text-lg font-semibold">
                      {selectedApp.rating} <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Lượt tải</span>
                    <span className="text-lg font-semibold">{selectedApp.downloads}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Dung lượng</span>
                    <span className="text-lg font-semibold">{selectedApp.size}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Phiên bản</span>
                    <span className="text-lg font-semibold">{selectedApp.version}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Thể loại</span>
                    <span className="text-lg font-semibold">{selectedApp.category}</span>
                  </div>
                  
                  <div className="ml-auto w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setSelectedApp(null)}
                      className="w-full sm:w-auto bg-tv-card hover:bg-tv-card-hover border border-white/10 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-tv-accent"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Trở về
                    </button>
                    <a 
                      href={selectedApp.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-tv-accent hover:bg-tv-accent-hover focus:bg-tv-accent-hover focus:outline-none focus:ring-4 focus:ring-tv-accent/50 text-tv-bg font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all focus:scale-105"
                    >
                      <Download className="w-5 h-5" />
                      Tải APK
                    </a>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Giới thiệu</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedApp.description}
                  </p>
                </div>

                {/* Screenshots */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Ảnh chụp màn hình</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {selectedApp.screenshots.map((img, idx) => (
                      <img 
                        key={idx}
                        src={img} 
                        alt={`Screenshot ${idx + 1}`} 
                        className="h-40 md:h-48 rounded-lg object-cover border border-white/10 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
