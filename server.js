import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

app.get('/admin', (req,res)=>{
  const secret = process.env.ADMIN_SECRET;
  const token = req.header('x-admin-secret') || req.query.secret;
  if (!secret || token !== secret) return res.status(404).send('Not found');
  res.json({ ok:true, message:'Admin endpoint active', time:new Date().toISOString() });
});

app.post('/api/ai/slogan', (req,res)=>{
  const { timeOfDay='day', locale='tr' } = req.body || {};
  const t = {
    morning: { tr:['Yeni bir gün, yeni fırsatlar.','Parla, keşfet, şıklat.'],
               en:['New day, new deals.','Shine, explore, snap.'] },
    day:     { tr:['Parmak şıklatman kadar kolay.','Gülümse, fırsatlar seni bulsun.'],
               en:['As easy as a finger snap.','Smile, let deals find you.'] },
    evening: { tr:['Rahatla, fırsatlar seni bekliyor.','Doğru seçim, bir şıklatman kadar yakın.'],
               en:['Unwind, deals await.','The right choice is a snap away.'] },
    night:   { tr:['Sessiz gecede fırsatlar canlı.','Yıldızlar kadar parlak fırsatlar.'],
               en:['Quiet night, live deals.','Deals bright as stars.'] }
  };
  const arr = (t[timeOfDay] && (t[timeOfDay][locale] || t[timeOfDay]['en'])) || t.day.en;
  res.json({ slogan: arr[Math.floor(Math.random()*arr.length)] });
});

app.post('/api/ai/vitrine', (req,res)=>{
  const { lastCategory='electronics', locale='tr' } = req.body || {};
  const data = {
    electronics: { tr:['Laptop fırsatları','Kulaklık indirimleri','Akıllı saatler','Monitör seçkisi'],
                   en:['Laptop deals','Headphone discounts','Smartwatches','Monitor picks'] },
    travel:      { tr:['Uçak bileti','Son dakika oteller','Valiz & aksesuar','Araç kiralama'],
                   en:['Flights','Last-minute hotels','Luggage & accessories','Car rentals'] },
    fashion:     { tr:['Yeni sezon','Sneaker fırsatları','Basic & premium','Aksesuarlar'],
                   en:['New season','Sneaker deals','Basics & premium','Accessories'] },
    home:        { tr:['Minimal dekor','Aydınlatma','Ev teknolojisi','Mutfak seçkisi'],
                   en:['Minimal decor','Lighting','Home tech','Kitchen picks'] }
  };
  const arr = (data[lastCategory] && (data[lastCategory][locale] || data[lastCategory]['en'])) || data.electronics.en;
  res.json({ recommended: arr.slice(0,4).map((t,i)=>({ id:i+1, title:t })) });
});

const distDir = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(distDir));
app.get('*', (req,res)=> res.sendFile(path.join(distDir,'index.html')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log('Server running on :' + PORT));
