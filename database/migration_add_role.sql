-- Migration: adiciona coluna role à tabela users
-- Rode este script se o banco já existia antes de role ser adicionado ao schema.

alter table users add column if not exists role text not null default 'user';

-- Promove o admin existente
update users set role = 'admin' where email = 'admin@turbofit360.com';
