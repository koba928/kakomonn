// PDF最適化のための実装案

// 1. PDFのファイルサイズ最適化
async function optimizePDF(file: File): Promise<File> {
  // ブラウザでPDFを直接圧縮するのは難しいため、以下の戦略を使用
  
  // 戦略1: ファイルサイズチェックのみ
  if (file.size > 10 * 1024 * 1024) { // 10MB以上
    throw new Error('PDFファイルが大きすぎます。10MB以下に圧縮してからアップロードしてください。');
  }
  
  return file;
}

// 2. PDFの事前検証（高速化）
async function validatePDF(file: File): Promise<boolean> {
  // PDFヘッダーチェック（最初の5バイトが %PDF- であることを確認）
  const header = await file.slice(0, 5).text();
  if (header !== '%PDF-') {
    throw new Error('有効なPDFファイルではありません');
  }
  
  // ファイルサイズの妥当性チェック
  if (file.size < 1024) { // 1KB未満
    throw new Error('PDFファイルが小さすぎます');
  }
  
  return true;
}

// 3. アップロード前の最適化フロー
async function optimizeBeforeUpload(file: File): Promise<{
  file: File;
  metadata: {
    pageCount?: number;
    isScanned?: boolean;
    originalSize: number;
    optimizedSize: number;
  };
}> {
  const originalSize = file.size;
  
  // PDFの場合の最適化戦略
  if (file.type === 'application/pdf') {
    // サイズチェック
    if (file.size > 25 * 1024 * 1024) {
      throw new Error(`PDFファイルが大きすぎます（${(file.size / 1024 / 1024).toFixed(1)}MB）。25MB以下にしてください。`);
    }
    
    // クライアントサイドでのPDF圧縮は限定的
    // 代わりにユーザーへの提案を表示
    if (file.size > 10 * 1024 * 1024) {
      console.warn('PDFファイルが10MBを超えています。以下の方法で圧縮することをお勧めします：');
      console.warn('1. Adobe Acrobatの「ファイルサイズを縮小」機能');
      console.warn('2. オンラインPDF圧縮ツール（SmallPDF、iLovePDF等）');
      console.warn('3. プリント時に「PDFとして保存」で品質を下げる');
    }
    
    return {
      file,
      metadata: {
        originalSize,
        optimizedSize: originalSize,
        isScanned: file.size > 5 * 1024 * 1024 // 5MB以上はスキャンPDFの可能性
      }
    };
  }
  
  // 画像の場合は圧縮
  if (file.type.startsWith('image/')) {
    const compressedFile = await compressImage(file);
    return {
      file: compressedFile,
      metadata: {
        originalSize,
        optimizedSize: compressedFile.size
      }
    };
  }
  
  return {
    file,
    metadata: {
      originalSize,
      optimizedSize: originalSize
    }
  };
}

// 4. スマートアップロード戦略
async function smartUpload(file: File, onProgress?: (message: string) => void) {
  try {
    onProgress?.('ファイルを検証中...');
    await validatePDF(file);
    
    onProgress?.('ファイルを最適化中...');
    const { file: optimizedFile, metadata } = await optimizeBeforeUpload(file);
    
    // サイズ削減率を表示
    if (metadata.optimizedSize < metadata.originalSize) {
      const reduction = Math.round((1 - metadata.optimizedSize / metadata.originalSize) * 100);
      onProgress?.(`ファイルサイズを${reduction}%削減しました`);
    }
    
    // アップロード方式の選択
    if (optimizedFile.size < 5 * 1024 * 1024) { // 5MB未満
      onProgress?.('高速アップロード中...');
      return await fastUpload(optimizedFile);
    } else {
      onProgress?.('大容量ファイルをアップロード中...');
      return await chunkedUpload(optimizedFile, onProgress);
    }
    
  } catch (error) {
    console.error('アップロードエラー:', error);
    throw error;
  }
}

// 5. 高速アップロード（小さいファイル用）
async function fastUpload(file: File) {
  const filePath = `${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('past-exams')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      duplex: 'half' // アップロード速度向上
    });
    
  if (error) throw error;
  return data;
}

// 6. チャンクアップロード（大きいファイル用）
async function chunkedUpload(
  file: File, 
  onProgress?: (message: string) => void
) {
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    
    const progress = Math.round(((i + 1) / totalChunks) * 100);
    onProgress?.(`アップロード中... ${progress}%`);
    
    // 各チャンクをアップロード
    // 実際の実装では、サーバーサイドでチャンクを結合する必要があります
  }
}

// 画像圧縮関数（既存）
async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  const maxWidth = 1920;
  const maxHeight = 1080;
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), file.type, 0.85);
  });
  
  return new File([blob], file.name, { type: file.type });
}

// 使用例
/*
const handleFileUpload = async (file: File) => {
  try {
    setUploadProgress('準備中...');
    
    await smartUpload(file, (message) => {
      setUploadProgress(message);
    });
    
    setUploadProgress('完了！');
  } catch (error) {
    alert(error.message);
  }
};
*/