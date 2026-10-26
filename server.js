const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Инициализация Supabase с использованием переменных окружения из Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Помилка: Не задано SUPABASE_URL або SUPABASE_KEY у змінних середовища!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Настройка статических папок (для картинок, стилей и скриптов)
app.use(express.static(path.join(__dirname)));
app.use('/img', express.static(path.join(__dirname, 'img')));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API-эндпоинт для получения списка блюд из базы данных Supabase
app.get('/api/dishes', async (req, res) => {
  try {
    const { data, error } = await supabase.from('dishes').select('*');
    
    if (error) {
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Помилка при отриманні даних з Supabase:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Запуск сервера (локально)
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
