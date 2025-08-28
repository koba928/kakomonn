// アップロード最適化のための追加実装案

// 1. ファイル圧縮（画像の場合）
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // 最大幅を1920pxに制限
  const maxWidth = 1920;
  const scale = Math.min(1, maxWidth / bitmap.width);
  
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), file.type, 0.85);
  });
  
  return new File([blob], file.name, { type: file.type });
}

// 2. チャンク分割アップロード（大きなファイル用）
async function uploadInChunks(
  file: File, 
  filePath: string,
  onProgress?: (percent: number) => void
) {
  const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  const chunks = Math.ceil(file.size / CHUNK_SIZE);
  
  for (let i = 0; i < chunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    
    // Upload chunk
    await supabase.storage
      .from('past-exams')
      .upload(`${filePath}.part${i}`, chunk);
    
    if (onProgress) {
      onProgress(((i + 1) / chunks) * 100);
    }
  }
  
  // Combine chunks server-side
}

// 3. 並列アップロード（複数ファイル対応）
async function uploadMultipleFiles(files: File[]) {
  const uploadPromises = files.map(file => 
    uploadSingleFile(file).catch(err => ({
      file: file.name,
      error: err.message
    }))
  );
  
  const results = await Promise.allSettled(uploadPromises);
  return results;
}

// 4. キャッシュ活用（同じファイルの重複チェック）
async function checkDuplicateFile(file: File): Promise<boolean> {
  const hash = await calculateFileHash(file);
  
  const { data } = await supabase
    .from('past_exams')
    .select('id')
    .eq('file_hash', hash)
    .single();
    
  return !!data;
}

async function calculateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}