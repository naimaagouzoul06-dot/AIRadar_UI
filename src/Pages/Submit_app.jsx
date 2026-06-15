import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getUser } from '../Js/useAuth';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

  .sa-root {
    min-height: 100vh;
    background: #0d0f1a;
    font-family: 'Inter', sans-serif;
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  .sa-bg {
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 85% 20%, rgba(16,185,129,0.14) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 15% 80%, rgba(79,70,229,0.18) 0%, transparent 60%),
                #0d0f1a;
    pointer-events: none;
  }

  .sa-grid {
    position: fixed;
    inset: 0;
    background-image: linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .sa-body {
    position: relative;
    z-index: 10;
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1.5rem 4rem;
  }

  .sa-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 2rem;
    backdrop-filter: blur(12px);
  }

  .sa-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  .sa-sub {
    color: #64748b;
    margin-bottom: 2rem;
    font-size: 0.9rem;
  }

  .sa-section {
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    color: #475569;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 1.5rem 0 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding-bottom: 0.5rem;
  }

  .sa-field { margin-bottom: 1rem; }
  .sa-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: #94a3b8;
    margin-bottom: 0.4rem;
  }
  .sa-label span { color: #6366f1; }

  .sa-input, .sa-select, .sa-textarea {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 0.7rem 0.85rem;
    color: #e2e8f0;
    font-size: 0.9rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .sa-input:focus, .sa-select:focus, .sa-textarea:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .sa-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .sa-check-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  .sa-check {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
  }
  .sa-check input { accent-color: #6366f1; }

  .sa-drop {
    border: 1px dashed rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .sa-drop:hover, .sa-drop.over { border-color: #6366f1; background: rgba(99,102,241,0.05); }
  .sa-drop-icon { width: 32px; height: 32px; margin: 0 auto 0.5rem; color: #475569; }
  .sa-drop-txt { font-size: 0.8rem; color: #475569; }
  .sa-drop-file { font-size: 0.75rem; color: #6366f1; margin-top: 0.3rem; }

  .sa-error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 8px;
    padding: 0.7rem;
    color: #f87171;
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .sa-btn {
    background: #6366f1;
    border: none;
    padding: 0.8rem;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    width: 100%;
    cursor: pointer;
    transition: 0.2s;
    margin-top: 1rem;
  }
  .sa-btn:hover { background: #4f46e5; transform: translateY(-1px); }
  .sa-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .sa-success {
    text-align: center;
    padding: 2rem;
  }
  .sa-success-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }
  .sa-success-title { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem; }
  .sa-success-sub { color: #64748b; margin-bottom: 1.5rem; }

  @media (max-width: 640px) {
    .sa-row { grid-template-columns: 1fr; }
    .sa-card { padding: 1.5rem; }
  }
`;

const UploadIcon = () => (
  <svg className="sa-drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function SubmitApp() {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    website_url: '',
    description: '',
    pricing_type: 'freemium',
    categorie_principale_id: '',
    company_name: '',
    company_country: '',
    release_date: '',
    is_new: false,
    api_available: false,
    is_available_web: true,
    is_available_windows: false,
    is_available_mac: false,
    is_available_ios: false,
    is_available_android: false,
    supported_languages: '',
    free_plan_details: '',
    pro_plan_details: '',
    integrations: '',
  });

  const navigate = useNavigate();
  const user = getUser();

  // Redirection si non connecté
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  // Charger les catégories existantes depuis l'API
  useEffect(() => {
    fetch(`${API_BASE}/getCategories.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Générer le slug à partir du nom
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setForm(prev => ({ ...prev, slug }));
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Tool name is required';
    if (!form.slug.trim()) return 'Slug is required';
    if (!form.website_url.trim()) return 'Website URL is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.categorie_principale_id && !newCategory) return 'Please select or add a category';
    return null;
  };

   useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        submitterName: user.name || '',
        submitterEmail: user.email || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Préparer les données (similaire à ai_tools)
    const submissionData = {
      ...form,
      company_country: form.company_country || null,
      release_date: form.release_date || null,
      // si nouvelle catégorie, on l'envoie séparément
      new_category_name: showNewCategory ? newCategory : null,
      // On n'envoie pas le fichier ici, il faudrait utiliser FormData pour l'upload
    };

    // Pour l'upload du logo, on utilise FormData
    const formData = new FormData();
    for (let key in submissionData) {
      if (submissionData[key] !== undefined && submissionData[key] !== null) {
        formData.append(key, submissionData[key]);
      }
    }
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      const response = await fetch(`${API_BASE}/submit_app.php`, {
        method: 'POST',
        body: formData, // pas de Content-Type, le navigateur gère le multipart
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="sa-root">
        <style>{css}</style>
        <div className="sa-bg" />
        <div className="sa-grid" />
        <div className="sa-body">
          <div className="sa-card sa-success">
            <div className="sa-success-icon"><CheckIcon /></div>
            <h2 className="sa-success-title">Submission received!</h2>
            <p className="sa-success-sub">Thank you for suggesting an AI tool. Our team will review it and add it to the directory soon.</p>
            <button className="sa-btn" onClick={() => window.location.reload()}>Submit another tool</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-root">
      <style>{css}</style>
      <div className="sa-bg" />
      <div className="sa-grid" />
      <div className="sa-body">
        <div className="sa-card">
          <h1 className="sa-title">Submit an AI Tool</h1>
          <p className="sa-sub">Fill out the form below to suggest a new AI tool for the directory. All fields marked with <span>*</span> are required.</p>

          <form onSubmit={handleSubmit}>
            {/* Section: Basic Info */}
            <div className="sa-section">Basic information</div>
            <div className="sa-field">
              <label className="sa-label">Tool Name <span>*</span></label>
              <input type="text" name="name" className="sa-input" value={form.name} onChange={handleChange} placeholder="e.g. ChatGPT" />
            </div>
            <div className="sa-field">
              <label className="sa-label">Slug (URL identifier) <span>*</span></label>
              <input type="text" name="slug" className="sa-input" value={form.slug} onChange={handleChange} placeholder="auto-generated from name" />
            </div>
            <div className="sa-row">
              <div className="sa-field">
                <label className="sa-label">Website URL <span>*</span></label>
                <input type="url" name="website_url" className="sa-input" value={form.website_url} onChange={handleChange} placeholder="https://example.com" />
              </div>
              <div className="sa-field">
                <label className="sa-label">Logo / Icon</label>
                <div className={`sa-drop${dragOver ? ' over' : ''}`} onClick={() => fileRef.current.click()} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
                  <UploadIcon />
                  <p className="sa-drop-txt"><strong>Click or drag</strong> an image (PNG, JPG, SVG)</p>
                  {logoFile && <p className="sa-drop-file">✓ {logoFile.name}</p>}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
                </div>
              </div>
            </div>
            <div className="sa-field">
              <label className="sa-label">Short description / Tagline</label>
              <input type="text" name="tagline" className="sa-input" placeholder="One-line description" value={form.tagline} onChange={handleChange} />
            </div>
            <div className="sa-field">
              <label className="sa-label">Detailed description <span>*</span></label>
              <textarea name="description" rows="4" className="sa-textarea" value={form.description} onChange={handleChange} placeholder="Describe the tool, its features, and use cases..." />
            </div>

            {/* Section: Classification */}
            <div className="sa-section">Classification</div>
            <div className="sa-row">
              <div className="sa-field">
                <label className="sa-label">Category <span>*</span></label>
                <select name="categorie_principale_id" className="sa-select" value={form.categorie_principale_id} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name} {cat.icon}</option>)}
                </select>
                <button type="button" className="sa-btn-secondary" style={{ marginTop: '0.5rem', background: 'transparent', border: '1px solid #475569', padding: '0.3rem 0.6rem', fontSize: '0.7rem' }} onClick={() => setShowNewCategory(!showNewCategory)}>+ Add new category</button>
                {showNewCategory && (
                  <input type="text" className="sa-input" style={{ marginTop: '0.5rem' }} placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                )}
              </div>
              <div className="sa-field">
                <label className="sa-label">Pricing type <span>*</span></label>
                <select name="pricing_type" className="sa-select" value={form.pricing_type} onChange={handleChange}>
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div className="sa-row">
              <div className="sa-field">
                <label className="sa-label">Company name</label>
                <input type="text" name="company_name" className="sa-input" value={form.company_name} onChange={handleChange} placeholder="e.g. OpenAI" />
              </div>
              <div className="sa-field">
                <label className="sa-label">Company country</label>
                <input type="text" name="company_country" className="sa-input" value={form.company_country} onChange={handleChange} placeholder="e.g. USA" />
              </div>
            </div>

            {/* Section: Availability */}
            <div className="sa-section">Platforms & API</div>
            <div className="sa-check-group">
              <label className="sa-check"><input type="checkbox" name="is_available_web" checked={form.is_available_web} onChange={handleChange} /> Web</label>
              <label className="sa-check"><input type="checkbox" name="is_available_windows" checked={form.is_available_windows} onChange={handleChange} /> Windows</label>
              <label className="sa-check"><input type="checkbox" name="is_available_mac" checked={form.is_available_mac} onChange={handleChange} /> Mac</label>
              <label className="sa-check"><input type="checkbox" name="is_available_ios" checked={form.is_available_ios} onChange={handleChange} /> iOS</label>
              <label className="sa-check"><input type="checkbox" name="is_available_android" checked={form.is_available_android} onChange={handleChange} /> Android</label>
            </div>
            <div className="sa-row">
              <div className="sa-field">
                <label className="sa-label">API available?</label>
                <select name="api_available" className="sa-select" value={form.api_available} onChange={handleChange}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div className="sa-field">
                <label className="sa-label">Release date</label>
                <input type="date" name="release_date" className="sa-input" value={form.release_date} onChange={handleChange} />
              </div>
            </div>
            <div className="sa-field">
              <label className="sa-label">Supported languages</label>
              <input type="text" name="supported_languages" className="sa-input" value={form.supported_languages} onChange={handleChange} placeholder="e.g. English, French, Spanish" />
            </div>

            {/* Section: Plans & Integrations */}
            <div className="sa-section">Plans & Integrations</div>
            <div className="sa-row">
              <div className="sa-field">
                <label className="sa-label">Free plan details</label>
                <input type="text" name="free_plan_details" className="sa-input" value={form.free_plan_details} onChange={handleChange} placeholder="What's included in free tier?" />
              </div>
              <div className="sa-field">
                <label className="sa-label">Pro/Paid plan details</label>
                <input type="text" name="pro_plan_details" className="sa-input" value={form.pro_plan_details} onChange={handleChange} placeholder="Pricing and features" />
              </div>
            </div>
            <div className="sa-field">
              <label className="sa-label">Integrations</label>
              <input type="text" name="integrations" className="sa-input" value={form.integrations} onChange={handleChange} placeholder="e.g. Slack, Zapier, API" />
            </div>
            <div className="sa-field">
              <label className="sa-label"><input type="checkbox" name="is_new" checked={form.is_new} onChange={handleChange} /> Mark as newly released?</label>
            </div>

            {error && <div className="sa-error">{error}</div>}
            <button type="submit" className="sa-btn" disabled={loading}>{loading ? 'Submitting...' : 'Submit for review'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}