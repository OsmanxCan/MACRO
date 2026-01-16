// lib/utils/imageToBase64.ts
export async function imageToBase64(imagePath: string): Promise<string> {
  try {
    const response = await fetch(imagePath);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('FileReader error'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Image to base64 conversion error:', error);
    return ''; // Hata durumunda boş string döndür
  }
}