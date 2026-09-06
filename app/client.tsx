import { createRoot } from 'react-dom/client';
import Home from './page';
import './globals.css';
const root = document.getElementById('root');
if (!root) throw new Error('Application root is missing.');
createRoot(root).render(<Home />);
