-- Enable pgvector
create extension if not exists vector;

-- Documents table for RAG chunks
create table if not exists documents (
  id bigserial primary key,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1024)
);

-- HNSW index for cosine similarity search
create index if not exists documents_embedding_idx
  on documents
  using hnsw (embedding vector_cosine_ops);

-- Similarity search function
create or replace function match_documents(
  query_embedding vector(1024),
  match_count int default 5,
  match_threshold float default 0.0
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) >= match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;
