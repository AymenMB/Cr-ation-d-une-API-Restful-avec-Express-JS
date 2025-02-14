const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./maBaseDeDonnees.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Erreur de connexion à SQLite :", err.message);
    } else {
        console.log('✅ Connecté à la base de données SQLite.');

     
        db.run(`CREATE TABLE IF NOT EXISTS personnes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            adresse TEXT
        )`, (err) => {
            if (err) {
                console.error("Erreur lors de la création de la table :", err.message);
            } else {
                console.log('✅ Table "personnes" prête.');

   
                db.get(`SELECT COUNT(*) AS count FROM personnes`, [], (err, row) => {
                    if (err) {
                        console.error("Erreur lors de la vérification des données existantes :", err.message);
                    } else if (row.count === 0) { 
                        const personnes = [
                            { nom: 'Bob', adresse: '123 Rue Principale' },
                            { nom: 'Alice', adresse: '456 Avenue des Champs' },
                            { nom: 'Charlie', adresse: '789 Boulevard Central' }
                        ];

                        personnes.forEach(({ nom, adresse }) => {
                            db.run(`INSERT INTO personnes (nom, adresse) VALUES (?, ?)`, [nom, adresse], (err) => {
                                if (err) {
                                    console.error("Erreur lors de l'insertion de", nom, ":", err.message);
                                } else {
                                    console.log(`✅ Personne ajoutée : ${nom}`);
                                }
                            });
                        });
                    } else {
                        console.log('⚠️ La table contient déjà des données, pas d’insertion initiale.');
                    }
                });
            }
        });
    }
});

const updatePerson = (id, nom, adresse) => {
    if (!id || !nom || !adresse) {
        console.error("❌ ID, nom et adresse sont requis pour mettre à jour une personne.");
        return;
    }

    db.run(`UPDATE personnes SET nom = ?, adresse = ? WHERE id = ?`, [nom, adresse, id], function (err) {
        if (err) {
            console.error("❌ Erreur lors de la mise à jour :", err.message);
        } else if (this.changes === 0) {
            console.log(`⚠️ Aucune personne trouvée avec l'ID ${id}`);
        } else {
            console.log(`✅ Personne avec l'ID ${id} mise à jour.`);
        }
    });
};


const deletePerson = (id) => {
    if (!id) {
        console.error("❌ ID requis pour supprimer une personne.");
        return;
    }

    db.run(`DELETE FROM personnes WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error("❌ Erreur lors de la suppression :", err.message);
        } else if (this.changes === 0) {
            console.log(`⚠️ Aucune personne trouvée avec l'ID ${id}`);
        } else {
            console.log(`✅ Personne avec l'ID ${id} supprimée.`);
        }
    });
};

module.exports = db;
