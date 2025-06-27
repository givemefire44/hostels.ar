import { supabase } from '../../../lib/supabaseClient';

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Post no encontrado</h1>
        <p>No existe ningún post con ese slug.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
      <h1>{post.titulo}</h1>
      {post.imagen && <img src={post.imagen} alt={post.titulo} style={{ maxWidth: "100%" }} />}
      <div dangerouslySetInnerHTML={{ __html: post.contenido }} />
    </main>
  );
}
