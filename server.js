const express = require('express');
const cors = require('cors');
const { JSDOM } = require('jsdom');
const app = express();
const PORT = 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/steal', (req, res) => {
  const bodyContent = req.body.content;
  const dom = new JSDOM(bodyContent);
  const texts = {};

  let index = 1;
  dom.window.document.querySelectorAll('body *').forEach(element => {
    if (element.textContent.trim() && element.children.length === 0) {
      // Игнорировать пустые и элементы с дочерними элементами
      texts[`txt${index++}`] = element.textContent.trim();
    }
  });

  res.json(texts);
});

app.post('/apply', (req, res) => {
  const { htmlContent, replacements } = req.body;
  const dom = new JSDOM(htmlContent);
  let index = 1;

  dom.window.document.querySelectorAll('body *').forEach(element => {
    if (element.textContent.trim() && element.children.length === 0) {
      const replacementKey = `txt${index}`;
      if (replacements[replacementKey]) {
        element.textContent = replacements[replacementKey];
        index++;
      }
    }
  });

  res.json({ updatedHtml: dom.window.document.body.innerHTML });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
