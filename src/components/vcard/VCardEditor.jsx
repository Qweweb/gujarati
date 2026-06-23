import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVCardByUserId, saveVCard, isSlugAvailable } from '../../utils/vcard_helper';
import { supabase } from '../../supabaseClient';
import VCardPreview from './VCardPreview';

const VCardEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'preview'
  const [error, setError] = useState('');
  
  const [vcard, setVcard] = useState({
    slug: '',
    profile_image: '',
    cover_image: '',
    name: '',
    job_title: '',
    company: '',
    bio: '',
    theme_id: 'modern',
    theme_colors: { primary: '#0d9488' },
    social_links: [],
    contact_details: [],
    products: [],
    gallery: [],
    status: true
  });

  useEffect(() => {
    fetchVCard();
  }, []);

  const fetchVCard = async () => {
    setLoading(true);
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) {
        navigate('/');
        return;
      }
      
      const card = await getVCardByUserId(authUser.user.id);
      if (card) {
        setVcard(card);
      } else {
        const namePart = authUser.user.user_metadata?.full_name?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 8);
        setVcard(prev => ({ ...prev, slug: namePart, name: authUser.user.user_metadata?.full_name || '' }));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVcard(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    
    if (!vcard.name || !vcard.slug) {
      setError('કૃપા કરીને નામ અને લિંક (Slug) ભરો.');
      return;
    }
    
    // Check slug formatting
    if (!/^[a-z0-9-]+$/.test(vcard.slug)) {
      setError('લિંક (Slug) માં માત્ર નાના અક્ષરો (a-z), આંકડા (0-9) અને ડેશ (-) વાપરી શકાય.');
      return;
    }

    setSaving(true);
    
    // Check slug availability
    const available = await isSlugAvailable(vcard.slug, vcard.id);
    if (!available) {
      setError('આ લિંક (Slug) પહેલેથી જ લેવાઈ ગઈ છે. કૃપા કરીને બીજી પસંદ કરો.');
      setSaving(false);
      return;
    }

    const res = await saveVCard(vcard);
    if (res.success) {
      setVcard(res.data);
      alert('કાર્ડ સફળતાપૂર્વક સેવ થઈ ગયું છે!');
      navigate('/vcard-dashboard');
    } else {
      setError('કાર્ડ સેવ કરવામાં ભૂલ આવી: ' + res.error);
    }
    setSaving(false);
  };

  // Contact Field Handlers
  const addContact = (type) => {
    setVcard(prev => ({
      ...prev,
      contact_details: [...prev.contact_details, { type, value: '', label: '' }]
    }));
  };

  const updateContact = (index, field, value) => {
    const updated = [...vcard.contact_details];
    updated[index][field] = value;
    setVcard(prev => ({ ...prev, contact_details: updated }));
  };

  const removeContact = (index) => {
    setVcard(prev => ({
      ...prev,
      contact_details: prev.contact_details.filter((_, i) => i !== index)
    }));
  };

  // Social Field Handlers
  const addSocial = () => {
    setVcard(prev => ({
      ...prev,
      social_links: [...prev.social_links, { platform: 'instagram', url: '', label: '' }]
    }));
  };

  const updateSocial = (index, field, value) => {
    const updated = [...vcard.social_links];
    updated[index][field] = value;
    setVcard(prev => ({ ...prev, social_links: updated }));
  };

  const removeSocial = (index) => {
    setVcard(prev => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index)
    }));
  };

  // Product Handlers
  const addProduct = () => {
    if (vcard.products?.length >= 8) return alert('વધુમાં વધુ ૮ પ્રોડક્ટ એડ કરી શકાય છે.');
    setVcard(prev => ({
      ...prev,
      products: [...(prev.products || []), { name: '', description: '', price: '', image: '', url: '' }]
    }));
  };

  const updateProduct = (index, field, value) => {
    const updated = [...(vcard.products || [])];
    updated[index][field] = value;
    setVcard(prev => ({ ...prev, products: updated }));
  };

  const removeProduct = (index) => {
    setVcard(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  // Gallery Handlers
  const addGalleryImage = () => {
    if (vcard.gallery?.length >= 8) return alert('વધુમાં વધુ ૮ ઈમેજ એડ કરી શકાય છે.');
    setVcard(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), { url: '', caption: '' }]
    }));
  };

  const updateGalleryImage = (index, field, value) => {
    const updated = [...(vcard.gallery || [])];
    updated[index][field] = value;
    setVcard(prev => ({ ...prev, gallery: updated }));
  };

  const removeGalleryImage = (index) => {
    setVcard(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  // Testimonial Handlers
  const addTestimonial = () => {
    if (vcard.testimonials?.length >= 5) return alert('વધુમાં વધુ ૫ રિવ્યુઝ એડ કરી શકાય છે.');
    setVcard(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), { name: '', text: '', rating: '5' }]
    }));
  };

  const updateTestimonial = (index, field, value) => {
    const updated = [...(vcard.testimonials || [])];
    updated[index][field] = value;
    setVcard(prev => ({ ...prev, testimonials: updated }));
  };

  const removeTestimonial = (index) => {
    setVcard(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  const updateBusinessHours = (day, value) => {
    setVcard(prev => ({
      ...prev,
      business_hours: { ...(prev.business_hours || {}), [day]: value }
    }));
  };

  const handleImageUpload = async (e, fieldName, index = null, arrayName = null) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('કૃપા કરીને માત્ર ફોટો (Image) જ સિલેક્ટ કરો.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('ફોટો 10MB થી નાનો હોવો જોઈએ.');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'gujarati_app');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/doyvfjcfg/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.secure_url) {
        const imageUrl = data.secure_url;
        if (arrayName === 'products') {
          updateProduct(index, fieldName, imageUrl);
        } else if (arrayName === 'gallery') {
          updateGalleryImage(index, fieldName, imageUrl);
        } else {
          setVcard(prev => ({ ...prev, [fieldName]: imageUrl }));
        }
      } else {
        alert('Upload Error: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      alert('ફોટો અપલોડ ફેઈલ. ઈન્ટરનેટ કનેક્શન તપાસો.');
    }
  };

  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1E1A18] border-b border-stone-200 dark:border-stone-800 shrink-0 shadow-sm z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300">
          <span className="material-symbols-outlined">close</span>
        </button>
        
        {/* Mobile Tabs */}
        <div className="flex bg-stone-100 dark:bg-stone-900 rounded-xl p-1 md:hidden">
          <button 
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold font-gujarati transition-all ${activeTab === 'editor' ? 'bg-white dark:bg-stone-800 shadow text-teal-600' : 'text-stone-500'}`}
          >
            એડિટ (Edit)
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold font-gujarati transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-stone-800 shadow text-teal-600' : 'text-stone-500'}`}
          >
            પ્રીવ્યુ (Preview)
          </button>
        </div>
        
        <h1 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100 hidden md:block">એડિટર (VCard Editor)</h1>

        <button 
          onClick={handleSave} 
          disabled={saving}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-gujarati font-bold text-sm shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {saving ? <span className="animate-spin material-symbols-outlined text-sm">sync</span> : <span className="material-symbols-outlined text-sm">save</span>}
          સેવ કરો
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 text-sm font-gujarati font-bold border-b border-red-200 dark:border-red-900 text-center shrink-0">
          {error}
        </div>
      )}

      {/* Main Content Area (Split on Desktop, Tabbed on Mobile) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Editor Panel */}
        <div className={`w-full md:w-1/2 lg:w-7/12 flex-col overflow-y-auto ${activeTab === 'editor' ? 'flex' : 'hidden md:flex'}`}>
          <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-2xl mx-auto w-full pb-32">
            
            {/* Section: Themes */}
            <div className="space-y-4">
              <h2 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">palette</span>
                થીમ પસંદ કરો (Theme)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'modern', label: 'Modern' },
                  { id: 'classic', label: 'Classic' },
                  { id: 'glass', label: 'Glassmorphism' },
                  { id: 'minimal', label: 'Minimalist' },
                  { id: 'vibrant', label: 'Vibrant Pop' },
                  { id: 'dark', label: 'Dark Mode' },
                  { id: 'restaurant', label: 'Restaurant / Cafe' },
                  { id: 'corporate', label: 'CA / Lawyer' },
                  { id: 'medical', label: 'Doctor / Clinic' },
                  { id: 'realestate', label: 'Real Estate' },
                  { id: 'astrology', label: 'Astrology' },
                  { id: 'ayurveda', label: 'Ayurveda' },
                  { id: 'bluecollar', label: 'Service / Worker' }
                ].map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => setVcard({ ...vcard, theme_id: t.id })}
                    className={`py-3 px-2 rounded-xl border-2 font-gujarati font-bold text-[11px] uppercase tracking-wider transition-all ${
                      vcard.theme_id === t.id 
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 shadow-sm' 
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-teal-300 dark:hover:border-teal-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section: Basic Info */}
            <div className="space-y-4">
              <h2 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">person</span>
                બેઝિક માહિતી (Basic Info)
              </h2>
              
              <div>
                <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">તમારી લિંક (Custom Slug) *</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-stone-100 dark:bg-stone-900 border border-r-0 border-stone-200 dark:border-stone-800 rounded-l-xl text-stone-500 text-sm">
                    gujaratiapp.in/vcard/
                  </span>
                  <input 
                    type="text" name="slug" value={vcard.slug} onChange={handleChange}
                    className="flex-1 px-3 py-2.5 rounded-r-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-sans"
                    placeholder="tamarun-naam"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">પ્રોફાઈલ ફોટો (Profile Image)</label>
                  <div className="flex flex-col gap-2">
                    {vcard.profile_image && (
                      <img src={vcard.profile_image} alt="Profile preview" className="w-16 h-16 rounded-full object-cover border border-stone-200 dark:border-stone-700" />
                    )}
                    <input 
                      type="file" accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'profile_image')}
                      className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">કવર ફોટો (Cover Image)</label>
                  <div className="flex flex-col gap-2">
                    {vcard.cover_image && (
                      <img src={vcard.cover_image} alt="Cover preview" className="w-full h-16 rounded-xl object-cover border border-stone-200 dark:border-stone-700" />
                    )}
                    <input 
                      type="file" accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'cover_image')}
                      className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">પૂરું નામ (Full Name) *</label>
                <input 
                  type="text" name="name" value={vcard.name} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-gujarati"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">હોદ્દો (Job Title / Profession)</label>
                  <input 
                    type="text" name="job_title" value={vcard.job_title} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-gujarati"
                  />
                </div>
                <div>
                  <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">કંપની (Company/Business Name)</label>
                  <input 
                    type="text" name="company" value={vcard.company} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-gujarati"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">તમારા વિશે (Bio / About)</label>
                <textarea 
                  name="bio" value={vcard.bio} onChange={handleChange} rows="3"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-gujarati resize-none"
                ></textarea>
              </div>
            </div>

            <hr className="border-stone-200 dark:border-stone-800" />

            {/* Section: Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">call</span>
                  સંપર્કની વિગતો (Contact Details)
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => addContact('phone')} className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded font-bold hover:bg-stone-200 dark:hover:bg-stone-700">+ Phone</button>
                  <button onClick={() => addContact('email')} className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded font-bold hover:bg-stone-200 dark:hover:bg-stone-700">+ Email</button>
                  <button onClick={() => addContact('location')} className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded font-bold hover:bg-stone-200 dark:hover:bg-stone-700">+ Addr</button>
                </div>
              </div>

              {vcard.contact_details.length === 0 && (
                <p className="text-xs text-stone-500 font-gujarati">કોઈ વિગત એડ કરેલ નથી.</p>
              )}

              {vcard.contact_details.map((contact, index) => (
                <div key={index} className="flex gap-2 items-center bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-stone-500 text-sm">
                      {contact.type === 'phone' ? 'call' : contact.type === 'email' ? 'mail' : 'location_on'}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" value={contact.value} onChange={(e) => updateContact(index, 'value', e.target.value)}
                      placeholder={contact.type === 'phone' ? '+91 9876543210' : contact.type === 'email' ? 'email@domain.com' : 'City, State'}
                      className="w-full bg-transparent text-sm border-b border-stone-200 dark:border-stone-700 focus:border-teal-500 outline-none pb-1"
                    />
                    <input 
                      type="text" value={contact.label} onChange={(e) => updateContact(index, 'label', e.target.value)}
                      placeholder="લેબલ (Office, Personal...)"
                      className="w-full bg-transparent text-xs text-stone-500 border-b border-stone-200 dark:border-stone-700 focus:border-teal-500 outline-none pb-1 font-gujarati"
                    />
                  </div>
                  <button onClick={() => removeContact(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            <hr className="border-stone-200 dark:border-stone-800" />

            {/* Section: Social Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">public</span>
                  સોશિયલ લિંક્સ (Social Links)
                </h2>
                <button onClick={addSocial} className="text-xs bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full font-bold hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">add</span> Add Link
                </button>
              </div>

              {vcard.social_links.length === 0 && (
                <p className="text-xs text-stone-500 font-gujarati">કોઈ લિંક એડ કરેલ નથી.</p>
              )}

              {vcard.social_links.map((link, index) => (
                <div key={index} className="flex gap-2 items-start bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                  <select 
                    value={link.platform} onChange={(e) => updateSocial(index, 'platform', e.target.value)}
                    className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="youtube">YouTube</option>
                    <option value="website">Website</option>
                  </select>
                  
                  <div className="flex-1 space-y-2">
                    <input 
                      type="url" value={link.url} onChange={(e) => updateSocial(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-transparent text-sm border-b border-stone-200 dark:border-stone-700 focus:border-teal-500 outline-none pb-1"
                    />
                    <input 
                      type="text" value={link.label} onChange={(e) => updateSocial(index, 'label', e.target.value)}
                      placeholder="ડિસ્પ્લે ટેક્સ્ટ (જેમ કે: @username)"
                      className="w-full bg-transparent text-xs text-stone-500 border-b border-stone-200 dark:border-stone-700 focus:border-teal-500 outline-none pb-1 font-gujarati"
                    />
                  </div>
                  <button onClick={() => removeSocial(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full mt-1">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            <hr className="border-stone-200 dark:border-stone-800" />

            {/* Section: Products */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">storefront</span>
                  પ્રોડક્ટ્સ / સર્વિસ (Products)
                </h2>
                <button onClick={addProduct} className="text-xs bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full font-bold hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">add</span> Add Product
                </button>
              </div>

              {(!vcard.products || vcard.products.length === 0) && (
                <p className="text-xs text-stone-500 font-gujarati">કોઈ પ્રોડક્ટ એડ કરેલ નથી. (Max 8)</p>
              )}

              {vcard.products?.map((prod, index) => (
                <div key={index} className="flex flex-col gap-2 bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 relative">
                  <button onClick={() => removeProduct(index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                  
                  <div className="font-gujarati text-xs font-bold text-teal-600 mb-1">પ્રોડક્ટ {index + 1}</div>
                  
                  <input type="text" value={prod.name} onChange={(e) => updateProduct(index, 'name', e.target.value)} placeholder="પ્રોડક્ટનું નામ *" className="w-full bg-transparent text-sm border-b border-stone-200 dark:border-stone-700 focus:border-teal-500 outline-none pb-1 font-gujarati" />
                  
                  <div className="flex items-center gap-2">
                    {prod.image && <img src={prod.image} className="w-10 h-10 object-cover rounded border border-stone-200" alt="product preview" />}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image', index, 'products')} className="w-full text-[10px] text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-teal-50 file:text-teal-700" />
                  </div>
                  
                  <div className="flex gap-2">
                    <input type="text" value={prod.price} onChange={(e) => updateProduct(index, 'price', e.target.value)} placeholder="કિંમત (Price)" className="w-1/3 bg-transparent text-xs border-b border-stone-200 dark:border-stone-700 focus:border-teal-500 outline-none pb-1 font-sans" />
                    <input type="url" value={prod.url} onChange={(e) => updateProduct(index, 'url', e.target.value)} placeholder="બાય લિંક (Buy/More Info URL)" className="flex-1 bg-transparent text-xs text-stone-500 border-b border-stone-200 dark:border-stone-700 focus:border-teal-500 outline-none pb-1" />
                  </div>
                  
                  <textarea value={prod.description} onChange={(e) => updateProduct(index, 'description', e.target.value)} placeholder="વર્ણન (Description)" rows="2" className="w-full bg-transparent text-xs text-stone-500 border border-stone-200 dark:border-stone-700 focus:border-teal-500 outline-none rounded p-2 font-gujarati resize-none mt-2"></textarea>
                </div>
              ))}
            </div>

            <hr className="border-stone-200 dark:border-stone-800" />

            {/* Section: Gallery */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">collections</span>
                  ગેલેરી (Image Gallery)
                </h2>
                <button onClick={addGalleryImage} className="text-xs bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full font-bold hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">add</span> Add Image
                </button>
              </div>

              {(!vcard.gallery || vcard.gallery.length === 0) && (
                <p className="text-xs text-stone-500 font-gujarati">કોઈ ઈમેજ એડ કરેલ નથી. (Max 8)</p>
              )}

              {vcard.gallery?.map((img, index) => (
                <div key={index} className="flex gap-3 items-center bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                  <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden shrink-0">
                    {img.url ? <img src={img.url} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-stone-400 m-3">image</span>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'url', index, 'gallery')} className="w-full text-[10px] text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-teal-50 file:text-teal-700" />
                    <input type="text" value={img.caption} onChange={(e) => updateGalleryImage(index, 'caption', e.target.value)} placeholder="કેપ્શન (Caption)" className="w-full bg-transparent text-xs text-stone-800 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 focus:border-teal-500 outline-none pb-1 font-gujarati" />
                  </div>
                  <button onClick={() => removeGalleryImage(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Section: Payment Details */}
            <div className="space-y-4 pt-6 border-t border-stone-200 dark:border-stone-800">
              <h2 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">account_balance</span>
                પેમેન્ટ વિગતો (Payment Details)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">UPI નામ (UPI Name)</label>
                  <input 
                    type="text" name="upiName" value={vcard.upiName || ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-gujarati"
                    placeholder="e.g. Ramesh Bhai"
                  />
                </div>
                <div>
                  <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">UPI ID</label>
                  <input 
                    type="text" name="upiId" value={vcard.upiId || ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-sans"
                    placeholder="e.g. 9876543210@ybl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">UPI QR કોડ ફોટો (UPI QR Code Image)</label>
                <div className="flex flex-col gap-2">
                  {vcard.upi_qr && (
                    <img src={vcard.upi_qr} alt="UPI QR preview" className="w-24 h-24 rounded-lg object-cover border border-stone-200 dark:border-stone-700" />
                  )}
                  <input 
                    type="file" accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'upi_qr')}
                    className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                <h3 className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300">બેંક ખાતાની વિગતો (Bank Details)</h3>
                
                <div>
                  <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">બેંકનું નામ (Bank Name)</label>
                  <input 
                    type="text" name="bankName" value={vcard.bankName || ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-gujarati"
                    placeholder="e.g. State Bank of India"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">ખાતા નંબર (Account Number)</label>
                    <input 
                      type="text" name="bankAccount" value={vcard.bankAccount || ''} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">IFSC કોડ</label>
                    <input 
                      type="text" name="bankIfsc" value={vcard.bankIfsc || ''} onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-sans uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Live Preview Panel */}
        <div className={`w-full md:w-1/2 lg:w-5/12 bg-stone-200 dark:bg-[#121212] flex-col items-center justify-center p-4 md:p-8 overflow-y-auto ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
          <div className="bg-white dark:bg-black rounded-[40px] w-[320px] h-[650px] shadow-2xl overflow-hidden border-[8px] border-stone-800 dark:border-stone-700 relative shrink-0">
            {/* Mobile Notch UI */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
               <div className="w-32 h-5 bg-stone-800 dark:bg-stone-700 rounded-b-3xl"></div>
            </div>
            
            {/* The actual preview rendering */}
            <div className="w-full h-full overflow-y-auto no-scrollbar pointer-events-none">
              <VCardPreview vcard={vcard} isPreview={true} />
            </div>
          </div>
          <p className="mt-6 text-sm text-stone-500 font-gujarati font-bold hidden md:block">
            <span className="material-symbols-outlined text-[16px] inline-block align-text-bottom mr-1">smartphone</span>
            Live Mobile Preview
          </p>
        </div>

      </div>
    </div>
  );
};

export default VCardEditor;
