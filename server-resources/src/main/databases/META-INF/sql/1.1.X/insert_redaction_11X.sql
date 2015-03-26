Insert into category
  (id, category)
Values
  (7,  'Retour de terrain'),
  (8,  'Forme libre'),
  (9,  'Chronique'),
  (10, 'Portrait'),
  (11, 'Article d''analyse'),
  (12, 'Critique'),
  (13, 'Billet d''humeur'),
  (14, 'Diaporama'),
  (15, 'Dessin');
  
update category
set category = 'Brève'
where id = 1;