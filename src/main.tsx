import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/latin-600.css';
import '@fontsource/be-vietnam-pro/latin-700.css';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-600.css';
import '@fontsource/be-vietnam-pro/vietnamese-700.css';
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/playfair-display/vietnamese-700.css';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
