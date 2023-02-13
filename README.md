"# SocialApp" 
Progetto dello studente di Intelligenza Artificiale SM3201156.

Per installare:
1 - fare git clone
2 - un docker compose up -d nella relativa cartella (-d per il detach)
3 - quando il docker è pronto (non prima), mentre è avviato, eseguire:
    a - docker exec -it db bin/bash
    b - mysql -uroot
    c - use njs;
    d - source /example.sql 

Il punto 3 serve per caricare il database che permette di far funzionare il sito.
Oltre che il database example.sql è stato fornito anche un database vuoto (default.sql).
- 3a serve per entrare nella shell del container
- 3b/c/d selezionano il database da usare e grazie al comando source si importa il file .sql

Dopo l'installazione ed il caricamento del database è possibile usare il sito.
