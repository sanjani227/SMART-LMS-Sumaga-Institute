const mysql = require('mysql2/promise');

async function seed() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sanjani2001',
        database: 'sumaga_lms',
        port: 3306
    });

    try {
        const query = `
        INSERT IGNORE INTO subjects (subjectName, gradeLevel) VALUES
        ('Sinhala-Grade6', '6'), ('English-Grade6', '6'), ('IT-Grade6', '6'), ('History-Grade6', '6'), ('Mathematics-Grade6', '6'), ('Science-Grade6', '6'),
        ('Sinhala-Grade7', '7'), ('English-Grade7', '7'), ('IT-Grade7', '7'), ('History-Grade7', '7'), ('Mathematics-Grade7', '7'), ('Science-Grade7', '7'),
        ('Sinhala-Grade8', '8'), ('English-Grade8', '8'), ('IT-Grade8', '8'), ('History-Grade8', '8'), ('Mathematics-Grade8', '8'), ('Science-Grade8', '8'),
        ('Sinhala-Grade9', '9'), ('English-Grade9', '9'), ('IT-Grade9', '9'), ('History-Grade9', '9'), ('Mathematics-Grade9', '9'), ('Science-Grade9', '9'),
        ('Sinhala-Grade10', '10'), ('English-Grade10', '10'), ('IT-Grade10', '10'), ('History-Grade10', '10'), ('Mathematics-Grade10', '10'), ('Science-Grade10', '10'),
        ('Sinhala-Grade11', '11'), ('English-Grade11', '11'), ('IT-Grade11', '11'), ('History-Grade11', '11'), ('Mathematics-Grade11', '11'), ('Science-Grade11', '11');
        `;
        const [result] = await connection.execute(query);
        console.log('Inserted ' + result.affectedRows + ' subject rows locally.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await connection.end();
    }
}
seed();
