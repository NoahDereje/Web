CREATE TABLE contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  date DATE NOT NULL,
  dropdown text NOT NULL,
  checkbox text 
);

CREATE TABLE sale (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_message TEXT NOT NULL,
    start_sale TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_sale TIMESTAMP DEFAULT NULL
);
UPDATE sale
SET end_sale = CURRENT_TIMESTAMP;
