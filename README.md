# SocialApp
Progetto dello studente di Intelligenza Artificiale SM3201156.

Per installare:
1. fare git clone
2. un docker compose up -d nella relativa cartella (-d per il detach)
3. quando il docker è pronto (non prima), mentre è avviato, eseguire:
    1. docker exec -it db bin/bash
    2. mysql -uroot
    3. use njs;
    4. source /example.sql 

Il punto 3 serve per caricare il database che permette di far funzionare il sito.
Oltre che il database example.sql è stato fornito anche un database vuoto (default.sql).
1. 3a serve per entrare nella shell del container
2. 3b/c/d selezionano il database da usare e grazie al comando source si importa il file .sql

Dopo l'installazione ed il caricamento del database è possibile usare il sito.
