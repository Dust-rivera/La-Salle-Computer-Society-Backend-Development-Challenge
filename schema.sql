CREATE DATABASE products_db;
USE products_db;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    model VARCHAR(50),
    stock INT,
    type VARCHAR(50)
);

INSERT INTO products (name, price, model, stock, type) VALUES 
("Razer Cobra", 3950.00, "Pro", 14, "Wireless"),
("Razer Viper", 2200.00, "Mini", 10, "Wired"),
("Razer DeathAdder", 2650.00, "V3", 15, "Wired"),
("Razer Basilisk", 3200.00, "V3 Pro", 8, "Wireless"),
("Razer Orochi", 4800.00, "V2", 12, "Wireless"),
("Razer Naga", 4500.00, "V2 Pro", 6, "Wireless"),
("Logitech G Pro", 4800.00, "X Superlight", 20, "Wireless"),
("Logitech G502", 3100.00, "Hero", 18, "Wired"),
("Logitech G305", 3950.00, "Lightspeed", 25, "Wireless"),
("Logitech MX Master", 2400.00, "3S", 14, "Wireless"),
("Logitech G903", 3200.00, "Hero", 7, "Wireless"),
("SteelSeries Rival", 3350.00, "650", 16, "Wireless"),
("SteelSeries Sensei", 2750.00, "Ten", 11, "Wired"),
("SteelSeries Aerox", 3950.00, "3 Wireless", 9, "Wireless"),
("Corsair Dark Core", 3650.00, "RGB Pro", 13, "Wireless"),
("Corsair M65", 2580.00, "RGB Elite", 19, "Wired"),
("Corsair Ironclaw", 2420.00, "RGB Wireless", 22, "Wireless"),
("ASUS ROG Gladius", 2680.00, "III", 14, "Wired"),
("ASUS ROG Keris", 3100.00, "Wireless", 10, "Wireless"),
("HyperX Pulsefire", 3150.00, "Haste", 17, "Wired"),
("HyperX Pulsefire", 3450.00, "Dart", 12, "Wireless"),
("Zowie EC2", 3250.00, "CW", 15, "Wired"),
("Zowie FK1", 4180.00, "B", 18, "Wired");
